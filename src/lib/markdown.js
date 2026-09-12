// src/lib/markdown.js
// Server-side Markdown -> HTML pipeline used for file-based posts.
//
// Two things happen here:
//   1. Math ($...$, $$...$$, \(...\), \[...\]) is pulled out *before* the Markdown
//      pass, rendered with KaTeX, and replaced by a tiny placeholder element.
//   2. Markdown is rendered to HTML (GFM) with heading ids, lazy images and
//      safe external links.
//
// The KaTeX markup is stored in a data attribute instead of being inlined so that
// the client renderer can hand it to React through `dangerouslySetInnerHTML`
// (see src/singleblog/blogContent.js). That keeps server and client output
// byte-identical, which is what prevents hydration warnings.

import { Marked } from "marked";
import katex from "katex";

const PLACEHOLDER_OPEN = "@@KATEX";
const PLACEHOLDER_CLOSE = "@@";

// ---------------------------------------------------------------------------
// Math extraction
// ---------------------------------------------------------------------------

/**
 * Splits Markdown into "code" and "text" segments so that math delimiters
 * inside code fences / inline code are never touched.
 */
function splitCodeAndText(markdown) {
  const segments = [];
  let rest = markdown;
  let buffer = "";

  const flushText = () => {
    if (buffer) {
      segments.push({ code: false, value: buffer });
      buffer = "";
    }
  };

  while (rest.length > 0) {
    // Fenced code block: ``` or ~~~
    const fence = /^([ \t]*)(`{3,}|~{3,})/.exec(rest);
    if (fence) {
      const marker = fence[2][0].repeat(fence[2].length);
      const closing = new RegExp(`\\n[ \\t]*\\${marker}{${fence[2].length},}[ \\t]*(?:\\n|$)`);
      const closeMatch = closing.exec(rest.slice(fence[0].length));
      const end = closeMatch
        ? fence[0].length + closeMatch.index + closeMatch[0].length
        : rest.length;
      flushText();
      segments.push({ code: true, value: rest.slice(0, end) });
      rest = rest.slice(end);
      continue;
    }

    // Inline code span: `...`, ``...``
    const inline = /^(`+)([\s\S]*?[^`])\1(?!`)/.exec(rest);
    if (inline) {
      flushText();
      segments.push({ code: true, value: inline[0] });
      rest = rest.slice(inline[0].length);
      continue;
    }

    const nextSpecial = (() => {
      const f = rest.slice(1).search(/(^|\n)[ \t]*(`{3,}|~{3,})/);
      const i = rest.slice(1).indexOf("`");
      const candidates = [f === -1 ? Infinity : f + 1, i === -1 ? Infinity : i + 1];
      const min = Math.min(...candidates);
      return min === Infinity ? -1 : min;
    })();

    if (nextSpecial === -1) {
      buffer += rest;
      rest = "";
    } else {
      buffer += rest.slice(0, nextSpecial);
      rest = rest.slice(nextSpecial);
    }
  }

  flushText();
  return segments;
}

/**
 * Finds every math expression outside of code and swaps it for a placeholder.
 * Returns `{ markdown, formulas }`.
 */
export function extractMath(markdown) {
  const formulas = [];
  const segments = splitCodeAndText(markdown);

  const out = segments.map((segment) => {
    if (segment.code) return segment.value;

    let text = segment.value;

    const push = (tex, displayMode) => {
      const index = formulas.push({ tex, displayMode }) - 1;
      return `${PLACEHOLDER_OPEN}${index}${PLACEHOLDER_CLOSE}`;
    };

    // $$ ... $$  and  \[ ... \]  (display, may span lines)
    text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => push(tex.trim(), true));
    text = text.replace(/\\\[([\s\S]+?)\\\]/g, (_, tex) => push(tex.trim(), true));

    // \( ... \)  (inline)
    text = text.replace(/\\\(([\s\S]+?)\\\)/g, (_, tex) => push(tex.trim(), false));

    // $ ... $  (inline). The lookarounds mirror KaTeX's auto-render rules so that
    // prose like "it costs $5 and $10" is left alone: no space directly inside the
    // delimiters and no digit right after the closing one.
    text = text.replace(
      /(^|[^\\$\w])\$([^\s$](?:[^$]*?[^\s$])?)\$(?!\d)/g,
      (match, prefix, tex) => prefix + push(tex.trim(), false),
    );

    return text;
  });

  return { markdown: out.join(""), formulas };
}

// ---------------------------------------------------------------------------
// Slug helpers (used for heading ids -> table of contents)
// ---------------------------------------------------------------------------

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------------------------------------------------------------------------
// Attribute escaping (for the data-math-html payload)
// ---------------------------------------------------------------------------

function escapeAttr(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ---------------------------------------------------------------------------
// Markdown -> HTML
// ---------------------------------------------------------------------------

function createMarked() {
  const instance = new Marked({ gfm: true, breaks: false });

  instance.use({
    renderer: {
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
        const external = /^https?:\/\//i.test(href || "");
        const rel = external ? ' rel="noopener noreferrer"' : "";
        const target = external ? ' target="_blank"' : "";
        return `<a href="${escapeAttr(href || "")}"${titleAttr}${target}${rel}>${text}</a>`;
      },
      image({ href, title, text }) {
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
        const alt = text ? ` alt="${escapeAttr(text)}"` : ' alt=""';
        return `<img src="${escapeAttr(href || "")}"${alt}${titleAttr} loading="lazy" decoding="async" />`;
      },
    },
  });

  return instance;
}

/**
 * Renders Markdown (with math) to an HTML string.
 *
 * Math comes back as `<span class="math-slot" data-math-html="...">` so the
 * client can inject the KaTeX markup without shipping it through the HTML parser.
 */
export function renderMarkdownToHtml(markdown, { headingIdPrefix } = {}) {
  const { markdown: mathFree, formulas } = extractMath(markdown || "");

  // Heading ids must be unique per document; the prefix keeps them stable when
  // the same file is rendered more than once in a request.
  const seen = new Map();
  const instance = createMarked();
  instance.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const plain = tokens
          .map((token) => token.text ?? token.raw ?? "")
          .join("")
          .replace(/[*_`~]/g, "");
        const base = slugify(plain) || `section-${depth}`;
        const key = headingIdPrefix ? `${headingIdPrefix}-${base}` : base;
        const count = seen.get(key) || 0;
        seen.set(key, count + 1);
        const id = count === 0 ? base : `${base}-${count}`;
        return `<h${depth} id="${escapeAttr(id)}">${text}</h${depth}>\n`;
      },
    },
  });
  let html = instance.parse(mathFree);

  // Replace placeholders. A placeholder that owns its paragraph becomes block math.
  html = html.replace(
    new RegExp(`<p>\\s*\\${PLACEHOLDER_OPEN}(\\d+)\\${PLACEHOLDER_CLOSE}\\s*</p>`, "g"),
    (match, rawIndex) => renderFormula(formulas[Number(rawIndex)], true),
  );
  html = html.replace(
    new RegExp(`\\${PLACEHOLDER_OPEN}(\\d+)\\${PLACEHOLDER_CLOSE}`, "g"),
    (match, rawIndex) => renderFormula(formulas[Number(rawIndex)], false),
  );

  return html;
}

function renderFormula(formula, asBlock) {
  if (!formula) return "";
  try {
    const html = katex.renderToString(formula.tex, {
      displayMode: asBlock || formula.displayMode,
      throwOnError: false,
      strict: false,
      output: "htmlAndMathml",
    });
    return `<span class="math-slot" data-math-html="${escapeAttr(html)}"></span>`;
  } catch (err) {
    // Never let one bad formula take the whole post down.
    console.error("KaTeX render failed:", err?.message);
    const fallback = asBlock
      ? `<span class="math-slot math-error"><code>${escapeAttr(formula.tex)}</code></span>`
      : `<code>${escapeAttr(formula.tex)}</code>`;
    return fallback;
  }
}

/**
 * Strips Markdown/HTML down to readable text. Used for word counts and previews.
 */
export function markdownToPlainText(markdown) {
  return (markdown || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/[*_~]{1,3}/g, "")
    .replace(/\|/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(markdown) {
  const text = markdownToPlainText(markdown);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

export function makeSnippet(markdown, length = 200) {
  const text = markdownToPlainText(markdown);
  if (text.length <= length) return text;
  const cut = text.slice(0, length);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : length).trimEnd()}...`;
}
