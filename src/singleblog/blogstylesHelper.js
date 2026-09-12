/**
 * Blog content stylesheet, injected next to the parsed post.
 *
 * House rules (see README): system typography only, natural link underlines,
 * sharp edges, instant state changes.
 */
export const generateStyles = () => `

.blog-content h1,
.blog-content h2,
.blog-content h3 {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  font-weight: 600;
  letter-spacing: -0.2px;
  line-height: 1.25;
}

.blog-content h1 {
  font-size: 32px;
  margin-bottom: 0.8em;
}

.blog-content h2 {
  font-size: 26px;
  margin-top: 1.6em;
  margin-bottom: 0.7em;
}

.blog-content h3 {
  font-size: 22px;
  margin-top: 1.4em;
  margin-bottom: 0.6em;
}

.blog-content h4,
.blog-content h5,
.blog-content h6 {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-weight: 600;
  margin-top: 1.2em;
  margin-bottom: 0.5em;
}

.blog-content p {
  font-size: 17px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  line-height: 1.7;
  margin-bottom: 1.5em;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}

.blog-content blockquote {
  border-left: 4px solid #999;
  padding: 10px 20px;
  margin: 20px 0;
  font-style: italic;
  background: rgba(128, 128, 128, 0.08);
  font-family: Georgia, "Times New Roman", serif;
}

.blog-content blockquote p {
  margin-bottom: 0;
}

.blog-content details {
  padding: 15px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}

.blog-content code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas,
    "Liberation Mono", monospace;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 90%;
  background: rgba(128, 128, 128, 0.14);
}

/* ── code blocks (CodeBlock component) ─────────────────────────────── */
.blog-content .code-block {
  position: relative;
  margin-bottom: 1.5em;
  border: 1px solid rgba(128, 128, 128, 0.35);
}

.blog-content .code-block-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 10px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.35);
  background: rgba(128, 128, 128, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 12px;
}

.blog-content .code-block-lang {
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.blog-content .code-block-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.blog-content .code-block pre {
  margin: 0;
  padding: 15px;
  border-radius: 0;
  font-size: 90%;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: normal;
  background: rgba(128, 128, 128, 0.07);
}

.blog-content .code-block pre code {
  padding: 0;
  background: none;
  font-size: 100%;
}

/* legacy bare <pre> blocks (should not occur anymore) */
.blog-content pre:not(.code-block pre) {
  padding: 15px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 90%;
  margin-bottom: 15px;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  background: rgba(128, 128, 128, 0.07);
  border: 1px solid rgba(128, 128, 128, 0.35);
}

.copy-button {
  padding: 3px 10px;
  border: 1px solid rgba(128, 128, 128, 0.5);
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
  color: inherit;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 12px;
}

.copied-notification {
  font-size: 12px;
  opacity: 0.8;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* ── syntax highlighting tokens (light & dark readable) ────────────── */
.blog-content .hljs-comment { font-style: italic; opacity: 0.75; }
.blog-content .hljs-keyword,
.blog-content .hljs-selector-tag,
.blog-content .hljs-literal { color: #0550ae; font-weight: 600; }
.blog-content .hljs-string,
.blog-content .hljs-regexp,
.blog-content .hljs-addition { color: #116329; }
.blog-content .hljs-number,
.blog-content .hljs-built_in,
.blog-content .hljs-type { color: #953800; }
.blog-content .hljs-title,
.blog-content .hljs-function .hljs-title,
.blog-content .hljs-name { color: #8250df; }
.blog-content .hljs-attr,
.blog-content .hljs-attribute,
.blog-content .hljs-variable,
.blog-content .hljs-params { color: #953800; }
.blog-content .hljs-meta,
.blog-content .hljs-symbol,
.blog-content .hljs-bullet { color: #0550ae; }
.blog-content .hljs-deletion { color: #b35900; }

/* ── math (KaTeX, rendered server-side) ────────────────────────────── */
.blog-content .math-display {
  margin: 1.5em 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.25em 0;
  text-align: center;
}

.blog-content .katex { font-size: 1.08em; }
.blog-content .katex-display { margin: 0.5em 0; }

/* ── tables ────────────────────────────────────────────────────────── */
.blog-content table {
  max-width: 100%;
  overflow-x: auto;
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  border-collapse: collapse;
  margin: 25px 0;
  border: 1px solid rgba(128, 128, 128, 0.45);
  font-size: 15px;
}

.blog-content table th {
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
  background: rgba(128, 128, 128, 0.1);
}

.blog-content table th, .blog-content table td {
  padding: 10px 15px;
  border: 1px solid rgba(128, 128, 128, 0.45);
}

.blog-content img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
}

/* Video styles */
.blog-content video {
  max-width: 80%;
  height: auto;
  border-radius: 12px;
  display: block;
  margin: 0 auto 1.5em;
}

/* Video wrapper for better responsiveness */
.blog-content .video-wrapper {
  position: relative;
  width: 80%;
  margin: 0 auto 1.5em;
}

/* Hide figcaption or other caption elements */
.blog-content figcaption {
  display: none;
}

.blog-content iframe {
  width: 80%;
  border: none;
  border-radius: 12px;
}

.blog-content a {
  text-decoration: underline;
  border-bottom: 1px solid transparent;
  word-break: break-word;
  overflow-wrap: break-word;
  display: inline-block;
  max-width: 100%;
}

.blog-content ul, .blog-content ol {
  margin-bottom: 1.5em;
  padding-left: 2em;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  line-height: 1.6;
  font-size: 16px;
}

.blog-content ul li, .blog-content ol li {
  margin-bottom: 0.5em;
}

.blog-content ul li a, .blog-content ol li a {
  text-decoration: underline;
}

.blog-content ul li p, .blog-content ol li p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
}

.blog-content hr {
  margin: 2em 0;
  border: none;
  border-top: 1px solid rgba(128, 128, 128, 0.45);
}`;
