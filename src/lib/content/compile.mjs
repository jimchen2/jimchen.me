/**
 * compile.mjs — turns a markdown blog post (with simple YAML-ish front matter)
 * into the HTML shape the rest of the site already expects
 * (`<h2 id="...">`, `<pre><code class="language-x">`, KaTeX markup, tables...).
 *
 * It is plain ESM with no repo-internal aliases so both Next.js (via webpack)
 * and plain Node (`npm run seed`) can import it.
 */
import MarkdownIt from "markdown-it";
import katex from "katex";

// ---------------------------------------------------------------- front matter
export function parseFrontMatter(source) {
  const meta = {};
  let body = source;
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (match) {
    body = source.slice(match[0].length);
    for (const rawLine of match[1].split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const idx = line.indexOf(":");
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      // strip quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      // inline array: [a, b, c]
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((v) => v.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
      }
      meta[key] = value;
    }
  }
  return { meta, body };
}

// --------------------------------------------------------------------- katex
function renderMath(tex, displayMode) {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: "ignore",
      trust: false,
      output: "htmlAndMathml",
    });
  } catch {
    // Never take the whole page down because of one bad formula.
    const safe = tex
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return displayMode
      ? `<pre class="math-error">${safe}</pre>`
      : `<code class="math-error">${safe}</code>`;
  }
}

function mathPlugin(md) {
  // ---- inline: $...$  and \(...\)
  md.inline.ruler.after("escape", "math_inline", (state, silent) => {
    const src = state.src;
    const start = state.pos;
    const ch = src[start];
    if (ch !== "$" && ch !== "\\") return false;

    let open, close;
    if (ch === "$") {
      if (src[start + 1] === "$") return false; // block math
      if (!src[start + 1] || /\s/.test(src[start + 1])) return false;
      open = 1;
      close = "$";
    } else {
      if (!src.startsWith("\\(", start)) return false;
      open = 2;
      close = "\\)";
    }

    let pos = start + open;
    let found = -1;
    while (pos < src.length) {
      if (src[pos] === "\\") {
        pos += 2;
        continue;
      }
      if (src.startsWith(close, pos)) {
        found = pos;
        break;
      }
      pos += 1;
    }
    if (found === -1) return false;
    // closing delimiter must not be preceded by whitespace
    if (/\s/.test(src[found - 1])) return false;
    // avoid swallowing currency like "$5 and $10"
    if (close === "$" && /[0-9]/.test(src[found + 1] || "")) return false;
    if (silent) return true;

    const token = state.push("math_inline", "math", 0);
    token.markup = close;
    token.content = src.slice(start + open, found);
    state.pos = found + close.length;
    return true;
  });
  md.renderer.rules.math_inline = (tokens, idx) =>
    renderMath(tokens[idx].content, false);

  // ---- block: $$ ... $$  and \[ ... \]
  md.block.ruler.before("fence", "math_block", (state, startLine, endLine, silent) => {
    const src = state.src;
    const startPos = state.bMarks[startLine] + state.tShift[startLine];
    const maxPos = state.eMarks[startLine];
    const first = src.slice(startPos, maxPos).trim();

    let closer;
    if (first.startsWith("$$")) closer = "$$";
    else if (first.startsWith("\\[")) closer = "\\]";
    else return false;

    const rest = first.slice(2).trim();
    // single-line form: $$ ... $$
    if (rest.endsWith(closer) && rest.length > closer.length) {
      if (silent) return true;
      const token = state.push("math_block", "math", 0);
      token.block = true;
      token.content = rest.slice(0, rest.length - closer.length).trim();
      token.map = [startLine, startLine + 1];
      state.line = startLine + 1;
      return true;
    }

    let line = startLine + 1;
    let found = false;
    while (line < endLine) {
      const ls = state.bMarks[line] + state.tShift[line];
      const le = state.eMarks[line];
      if (src.slice(ls, le).trim() === closer) {
        found = true;
        break;
      }
      line += 1;
    }
    if (!found) return false;
    if (silent) return true;

    const lines = [];
    if (rest) lines.push(rest);
    for (let l = startLine + 1; l < line; l += 1) {
      lines.push(src.slice(state.bMarks[l], state.eMarks[l]));
    }
    const token = state.push("math_block", "math", 0);
    token.block = true;
    token.content = lines.join("\n").trim();
    token.map = [startLine, line + 1];
    state.line = line + 1;
    return true;
  });
  md.renderer.rules.math_block = (tokens, idx) =>
    `<div class="math-display">${renderMath(tokens[idx].content, true)}</div>\n`;
}

// ------------------------------------------------------------- heading ids
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/`/g, "")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function headingIdsPlugin(md) {
  md.core.ruler.push("heading_ids", (state) => {
    const seen = new Map();
    for (let i = 0; i < state.tokens.length; i += 1) {
      const token = state.tokens[i];
      if (token.type !== "heading_open") continue;
      const inline = state.tokens[i + 1];
      const text = inline && inline.type === "inline" ? inline.content : "";
      let slug = slugify(text) || "section";
      if (seen.has(slug)) {
        const n = seen.get(slug) + 1;
        seen.set(slug, n);
        slug = `${slug}-${n}`;
      } else {
        seen.set(slug, 0);
      }
      token.attrSet("id", slug);
    }
  });
}

// ------------------------------------------------------------------ md init
const md = new MarkdownIt({
  html: false, // never trust raw HTML in posts
  linkify: true,
  breaks: false,
  typographer: false,
});
md.use(mathPlugin);
md.use(headingIdsPlugin);

// external links open in a new tab, like the rest of the site's links
const defaultLinkOpen =
  md.renderer.rules.link_open ||
  ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = tokens[idx].attrGet("href") || "";
  if (/^https?:\/\//i.test(href)) {
    tokens[idx].attrSet("target", "_blank");
    tokens[idx].attrSet("rel", "noreferrer");
  }
  return defaultLinkOpen(tokens, idx, options, env, self);
};

// ------------------------------------------------------------- plain text
export function htmlToPlainText(html) {
  return html
    .replace(/<span class="katex-mathml">[\s\S]*?<\/math><\/span>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text) {
  // CJK characters count as one word each, latin words split on whitespace
  const cjk = (text.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g) || []).length;
  const latin = text
    .replace(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return cjk + latin;
}

// ------------------------------------------------------------------ compile
export function compilePost(source, fallbackId = "post") {
  const { meta, body } = parseFrontMatter(source);
  const html = md.render(body).trim();
  const plain = htmlToPlainText(html);

  const types = Array.isArray(meta.type)
    ? meta.type
    : typeof meta.type === "string"
      ? meta.type.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  const date = meta.date ? new Date(`${meta.date}T12:00:00.000Z`) : new Date();

  const previewText =
    meta.preview_text ||
    (plain.length > 220 ? `${plain.slice(0, 220).trimEnd()}...` : plain);

  return {
    blogid: meta.blogid || fallbackId,
    title: meta.title || fallbackId,
    date: Number.isNaN(date.getTime()) ? new Date() : date,
    type: types,
    body: html,
    plain_text: plain,
    word_count: meta.word_count ? parseInt(meta.word_count, 10) : countWords(plain),
    preview_image: meta.preview_image || null,
    preview_text: previewText,
  };
}

export { md as markdownIt };
