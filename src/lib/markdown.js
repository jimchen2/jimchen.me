import { marked } from "marked";
import katex from "katex";

import { slugify } from "./format";

/**
 * Small markdown pipeline used by the local content source (`content/posts/*.md`).
 *
 * It is deliberately conservative: fenced code blocks and math are extracted
 * *before* markdown runs, so `$a_1$` and `` `snake_case` `` survive untouched,
 * then everything is stitched back together afterwards.
 */

const PLACEHOLDER = (kind, index) => `%%%${kind}${index}%%%`;

const FENCE_RE = /^[ \t]*(`{3,}|~{3,})[ \t]*([^\n]*)\n([\s\S]*?)\n?[ \t]*\1[ \t]*$/gm;
const INLINE_CODE_RE = /(`+)([^`\n]*?)\1/g;
const BLOCK_MATH_RE = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g;
const INLINE_MATH_RE =
  /\\\(([\s\S]+?)\\\)|(?<![\w$])\$(?!\s)((?:\\.|[^$\\\n])+?)(?<!\s)\$(?![\w$])/g;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export { slugify };

function renderMath(tex, displayMode) {
  return katex.renderToString(tex.trim(), {
    displayMode,
    throwOnError: false,
    strict: "ignore",
    trust: false,
    output: "html",
    errorColor: "#c0392b",
  });
}

/**
 * Runs the markdown -> HTML conversion for a single post body.
 * Returns HTML that is safe to feed to html-react-parser (the caller renders it
 * through React, so it never lands as raw innerHTML).
 */
export function renderMarkdown(markdown = "") {
  const codeBlocks = [];
  const mathBlocks = [];

  // 1. Pull fenced code blocks out first.
  let source = String(markdown).replace(FENCE_RE, (_match, _fence, info, code) => {
    const language = String(info || "").trim().split(/\s+/)[0].toLowerCase();
    codeBlocks.push({ code, language });
    return `\n${PLACEHOLDER("CODEFENCE", codeBlocks.length - 1)}\n`;
  });

  // 2. Inline code spans.
  source = source.replace(INLINE_CODE_RE, (_match, _ticks, code) => {
    codeBlocks.push({ code, language: "" });
    return PLACEHOLDER("CODESPAN", codeBlocks.length - 1);
  });

  // 3. Display math ($$...$$ and \[...\]).
  source = source.replace(BLOCK_MATH_RE, (_match, dollars, brackets) => {
    mathBlocks.push({ html: renderMath(dollars ?? brackets, true), block: true });
    return `\n${PLACEHOLDER("MATH", mathBlocks.length - 1)}\n`;
  });

  // 4. Inline math (\(...\) and $...$).
  source = source.replace(INLINE_MATH_RE, (_match, parens, dollars) => {
    mathBlocks.push({ html: renderMath(parens ?? dollars, false), block: false });
    return PLACEHOLDER("MATH", mathBlocks.length - 1);
  });

  // 5. Markdown itself, with a few renderer tweaks.
  const usedIds = new Map();
  const uniqueId = (text) => {
    const base = slugify(text);
    const seen = usedIds.get(base) || 0;
    usedIds.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen}`;
  };

  const renderer = {
    // The post title is rendered as the page <h1>, so markdown headings shift down one level.
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const level = Math.min(6, depth + 1);
      const id = uniqueId(text.replace(/<[^>]*>/g, ""));
      return `<h${level} id="${id}">${text}</h${level}>\n`;
    },
    image({ href, title, text }) {
      const alt = escapeHtml(text || "");
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
      return `<img src="${escapeHtml(href)}" alt="${alt}"${titleAttr} loading="lazy" decoding="async" />`;
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//i.test(href || "");
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
      return `<a href="${escapeHtml(href)}"${titleAttr}${attrs}>${text}</a>`;
    },
    codespan() {
      // Codespans are restored from placeholders afterwards.
      return "";
    },
  };

  marked.use({ gfm: true, breaks: false, renderer });

  let html = marked.parse(source);

  // 6. Rebuild, math first so the block wrapper is not disturbed by markdown paragraphs.
  html = html.replace(
    new RegExp(`<p>\\s*${PLACEHOLDER("MATH", "(\\d+)")}\\s*</p>`, "g"),
    (_match, index) => {
      const item = mathBlocks[Number(index)];
      return item?.block
        ? `<div class="math-block">${item.html}</div>`
        : `<p>${item?.html ?? ""}</p>`;
    },
  );

  html = html.replace(new RegExp(PLACEHOLDER("MATH", "(\\d+)"), "g"), (_match, index) => {
    const item = mathBlocks[Number(index)];
    return item
      ? item.block
        ? `<div class="math-block">${item.html}</div>`
        : item.html
      : "";
  });

  // A fenced block on its own line is wrapped in a paragraph by markdown; unwrap it
  // so the markup stays valid (`<pre>` cannot live inside `<p>`).
  html = html.replace(
    new RegExp(`<p>\\s*${PLACEHOLDER("CODEFENCE", "(\\d+)")}\\s*</p>`, "g"),
    (_match, index) => PLACEHOLDER("CODEFENCE", index),
  );

  html = html.replace(
    new RegExp(PLACEHOLDER("CODEFENCE", "(\\d+)"), "g"),
    (_match, index) => {
      const item = codeBlocks[Number(index)];
      if (!item) return "";
      const cls = item.language ? ` class="language-${escapeHtml(item.language)}"` : "";
      return `<pre><code${cls}>${escapeHtml(item.code)}</code></pre>`;
    },
  );

  html = html.replace(
    new RegExp(PLACEHOLDER("CODESPAN", "(\\d+)"), "g"),
    (_match, index) => {
      const item = codeBlocks[Number(index)];
      return item ? `<code>${escapeHtml(item.code)}</code>` : "";
    },
  );

  return html;
}

/** Very small YAML-ish front matter parser: strings, numbers, inline + block lists. */
export function parseFrontMatter(raw) {
  const text = String(raw).replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { data: {}, content: text };

  const data = {};
  const lines = match[1].split("\n");
  let currentList = null;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const listItem = /^\s*-\s+(.*)$/.exec(line);
    if (listItem && currentList) {
      currentList.push(unquote(listItem[1].trim()));
      continue;
    }

    const pair = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line);
    if (!pair) continue;

    const key = pair[1];
    const value = pair[2].trim();
    currentList = null;

    if (!value) {
      currentList = [];
      data[key] = currentList;
      continue;
    }

    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((entry) => unquote(entry.trim()))
        .filter(Boolean);
    } else if (value === "true" || value === "false") {
      data[key] = value === "true";
    } else {
      data[key] = unquote(value);
    }
  }

  return { data, content: text.slice(match[0].length) };
}

function unquote(value) {
  const trimmed = String(value).trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}
