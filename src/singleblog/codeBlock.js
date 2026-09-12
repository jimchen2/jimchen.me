import React, { useCallback, useMemo, useState } from "react";

import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import diff from "highlight.js/lib/languages/diff";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import plaintext from "highlight.js/lib/languages/plaintext";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

const LANGUAGES = {
  bash,
  c,
  cpp,
  csharp,
  css,
  diff,
  go,
  java,
  javascript,
  json,
  markdown,
  plaintext,
  python,
  rust,
  sql,
  typescript,
  xml,
  yaml,
};

let registered = false;
function registerLanguages() {
  if (registered) return;
  for (const [name, language] of Object.entries(LANGUAGES)) {
    hljs.registerLanguage(name, language);
  }
  registered = true;
}

const ALIASES = {
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  python3: "python",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  console: "bash",
  yml: "yaml",
  html: "xml",
  xhtml: "xml",
  svg: "xml",
  "c++": "cpp",
  cs: "csharp",
  "c#": "csharp",
  golang: "go",
  rs: "rust",
  postgres: "sql",
  psql: "sql",
  text: "plaintext",
  txt: "plaintext",
  md: "markdown",
};

const LABELS = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  bash: "Shell",
  json: "JSON",
  yaml: "YAML",
  xml: "HTML",
  css: "CSS",
  sql: "SQL",
  rust: "Rust",
  go: "Go",
  java: "Java",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  diff: "Diff",
  markdown: "Markdown",
  plaintext: "Text",
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function resolveLanguage(language) {
  const key = String(language || "").trim().toLowerCase();
  if (!key) return null;
  const resolved = ALIASES[key] || key;
  return hljs.getLanguage(resolved) ? resolved : null;
}

/**
 * Fenced code block with a copy button.
 * Highlighting happens during render (server *and* client), so the markup is
 * identical after hydration — no flash of unhighlighted code.
 */
function CodeBlock({ code = "", language = "" }) {
  const [copied, setCopied] = useState(false);

  const resolved = useMemo(() => {
    registerLanguages();
    return resolveLanguage(language);
  }, [language]);

  const highlighted = useMemo(() => {
    const source = String(code).replace(/\n+$/, "");
    if (!source) return "";
    if (resolved) {
      try {
        return hljs.highlight(source, { language: resolved, ignoreIllegals: true }).value;
      } catch {
        return escapeHtml(source);
      }
    }
    return escapeHtml(source);
  }, [code, resolved]);

  const handleCopy = useCallback(async () => {
    const source = String(code).replace(/\n+$/, "");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(source);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = source;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [code]);

  const label = resolved ? LABELS[resolved] || resolved : "";

  return (
    <figure className="code-block">
      <figcaption className="code-block-bar">
        <span className="code-block-lang">{label || "code"}</span>
        <button type="button" className="code-block-copy" onClick={handleCopy} aria-live="polite">
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre className="code-block-pre">
        <code
          className={resolved ? `hljs language-${resolved}` : "hljs"}
          // eslint-disable-next-line react/no-danger -- highlight.js escapes all input
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </figure>
  );
}

export default CodeBlock;
