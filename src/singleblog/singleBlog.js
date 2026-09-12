import React, { memo, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { attributesToProps, domToReact, htmlToDOM } from "html-react-parser";

import BlogLikeButton from "./bloglikebutton";
import BlogToc from "./blogToc";
import BlogViewCounter from "./blogViewCounter";
import CodeBlock from "./codeBlock";
import { formatTitle, normalizeTag, slugify } from "@/lib/format";

const HEADING_RE = /^h([2-6])$/;
const LANGUAGE_RE = /language-([\w+#.-]+)/i;

function collectText(node) {
  if (!node) return "";
  if (node.type === "text") return node.data ?? "";
  if (Array.isArray(node.children)) return node.children.map(collectText).join("");
  return "";
}

/** Walks the parsed HTML once, giving every section heading a stable id. */
function assignHeadingIds(nodes, headings, used) {
  for (const node of nodes || []) {
    if (node?.type !== "tag") continue;

    const match = HEADING_RE.exec(node.name);
    if (match) {
      const text = collectText(node).replace(/\s+/g, " ").trim();
      if (text) {
        const base = slugify(text);
        const seen = used.get(base) || 0;
        used.set(base, seen + 1);
        const id = node.attribs?.id || (seen === 0 ? base : `${base}-${seen}`);
        node.attribs = { ...(node.attribs || {}), id };
        headings.push({ id, text, level: Number(match[1]) });
      }
    }

    if (node.children) assignHeadingIds(node.children, headings, used);
  }
}

/**
 * Turns stored post HTML into React elements.
 *
 * Everything the old regex pre-pass did is handled here instead, which means
 * quotes and `<`/`&` inside code blocks survive intact, images get lazily
 * loaded, tables become scrollable and headings get anchor ids.
 */
function buildPostContent(html) {
  if (!html) return { elements: null, headings: [] };

  const dom = htmlToDOM(String(html));
  const headings = [];
  assignHeadingIds(dom, headings, new Map());

  const options = {
    replace(node) {
      if (node.type !== "tag") return undefined;

      if (node.name === "pre") {
        const codeNode = (node.children || []).find(
          (child) => child.type === "tag" && child.name === "code",
        );
        if (!codeNode) return undefined;
        const language = LANGUAGE_RE.exec(codeNode.attribs?.class || "");
        return <CodeBlock code={collectText(codeNode)} language={language ? language[1] : ""} />;
      }

      if (node.name === "h2" || node.name === "h3" || node.name === "h4") {
        const Tag = node.name;
        const props = attributesToProps(node.attribs || {});
        const id = node.attribs?.id;
        return (
          <Tag {...props}>
            {id ? (
              <a className="hash-link" href={`#${id}`} aria-label="Link to this section" tabIndex={-1}>
                #
              </a>
            ) : null}
            {domToReact(node.children, options)}
          </Tag>
        );
      }

      if (node.name === "img") {
        return (
          // eslint-disable-next-line @next/next/no-img-element -- post images come from arbitrary hosts
          <img {...attributesToProps(node.attribs || {})} loading="lazy" decoding="async" />
        );
      }

      if (node.name === "a") {
        const href = node.attribs?.href || "";
        const external = /^https?:\/\//i.test(href);
        return (
          <a
            {...attributesToProps(node.attribs || {})}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {domToReact(node.children, options)}
          </a>
        );
      }

      if (node.name === "table") {
        return (
          <div className="blog-table-scroll">
            <table {...attributesToProps(node.attribs || {})}>
              {domToReact(node.children, options)}
            </table>
          </div>
        );
      }

      return undefined;
    },
  };

  return { elements: domToReact(dom, options), headings };
}

/**
 * A post: header, body, footer, plus the sticky table of contents.
 *
 * Math stored as raw LaTeX is typeset on the client (KaTeX). Posts produced by
 * the markdown pipeline already arrive with KaTeX markup baked in.
 */
function SingleBlog({ title, text, type, blogid, date, wordcount, demo = false }) {
  const { elements, headings } = useMemo(() => buildPostContent(text), [text]);
  const contentRef = useRef(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return undefined;

    const raw = container.textContent || "";
    if (!raw.includes("$") && !raw.includes("\\(") && !raw.includes("\\[")) return undefined;

    let cancelled = false;

    import("katex/contrib/auto-render")
      .then((mod) => {
        const renderMathInElement = mod.default || mod;
        if (cancelled || typeof renderMathInElement !== "function") return;
        renderMathInElement(container, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false },
            { left: "$", right: "$", display: false },
          ],
          throwOnError: false,
          strict: "ignore",
          ignoredClasses: ["code-block"],
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [elements]);

  const tags = useMemo(
    () =>
      (Array.isArray(type) ? type : String(type || "").split(","))
        .map((tag) => String(tag).trim())
        .filter(Boolean),
    [type],
  );

  return (
    <div className="blog-layout" id="top">
      <article className="blog-article">
        <header className="blog-header">
          <p className="blog-meta">
            {date ? <time dateTime={date.iso}>{date.label}</time> : null}
            {wordcount ? (
              <>
                <span className="blog-meta-sep" aria-hidden="true">
                  •
                </span>
                <span>{wordcount} words</span>
              </>
            ) : null}
            {!demo && <BlogViewCounter blogid={blogid} />}
          </p>

          {tags.length > 0 && (
            <p className="blog-tags">
              {tags.map((tag) => (
                <Link key={tag} href={`/?type=${encodeURIComponent(normalizeTag(tag))}`} className="blog-tag">
                  #{normalizeTag(tag)}
                </Link>
              ))}
            </p>
          )}
        </header>

        <h1 className="blog-title">{formatTitle(title)}</h1>

        <div className="blog-content" ref={contentRef}>
          {elements}
        </div>

        <footer className="blog-footer">
          <Link className="blog-footer-link" href="/">
            ← All posts
          </Link>
          {!demo && <BlogLikeButton blogid={blogid} />}
        </footer>
      </article>

      <aside className="blog-sidebar">
        <BlogToc headings={headings} />
      </aside>
    </div>
  );
}

export default memo(SingleBlog);
