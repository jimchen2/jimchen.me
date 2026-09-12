import React, { useEffect, useState, memo } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import parse from "html-react-parser";
import { BlogToc } from "./blogToc";
import BlogLikeButton from "./bloglikebutton";
import CodeBlock from "./codeBlock";
import { generateStyles } from "./blogstylesHelper";
import BlogViewCounter from "./blogViewCounter";

function calculateBlogPadding(windowWidth = null) {
  const getPaddingValues = (width) => {
    if (width >= 1200) return { left: 10, right: 20 };
    if (width >= 600) return { left: 10, right: 10 };
    return { left: 5, right: 5 };
  };

  const width = windowWidth || 1200;
  const padding = getPaddingValues(width);

  return {
    paddingLeft: `${padding.left}%`,
    paddingRight: `${padding.right}%`,
  };
}

// ── BlogHeader ──────────────────────────────────────────────────────────────
const BlogHeader = ({ date, type, wordcount, blogid }) => {
  const displayDate = date === "December 31, 9999" ? "Current" : date;
  const types = (Array.isArray(type) ? type : String(type).split(","))
    .map((t) => t.trim())
    .filter(Boolean);

  // Track whether we're below the 500 px breakpoint
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < 500);
    check(); // run once on mount
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="blog-header mb-3">
      <br />
      <div
        style={{
          display: "flex",
          // Stack vertically on small screens, row otherwise
          flexDirection: isSmall ? "column" : "row",
          justifyContent: isSmall ? "flex-start" : "space-between",
          alignItems: isSmall ? "flex-start" : "center",
          gap: isSmall ? "0.35rem" : 0,
        }}
      >
        {/* Date · word count · view counter */}
        <small className="text">
          {displayDate} • {wordcount} words
          <BlogViewCounter blogid={blogid} />
        </small>

        {/* Type tags */}
        <div>
          {types.map((t) => {
            const slug = t.toLowerCase().replace(/\s+/g, "-");
            return (
              <Link
                key={t}
                href={`/?type=${slug}`}
                className="text-muted text-decoration-none me-2"
              >
                #{slug}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── BlogTitle ───────────────────────────────────────────────────────────────
const BlogTitle = ({ title }) => (
  <h2 className="mb-4">
    <div>{title.split("-").join(" ")}</div>
  </h2>
);

/** Extracts the text of a <code> DOM node from html-react-parser. */
const codeTextOf = (node) => {
  if (!node) return "";
  if (node.type === "text") return node.data || "";
  return (node.children || []).map(codeTextOf).join("");
};

// ── SingleBlog ──────────────────────────────────────────────────────────────
function SingleBlog({ date, text, title, language, type, blogid, wordcount }) {
  const [paddingStyles, setPaddingStyles] = useState(calculateBlogPadding());

  useEffect(() => {
    const handleResize = () => {
      setPaddingStyles(calculateBlogPadding(window.innerWidth));
    };
    setPaddingStyles(calculateBlogPadding(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Parse the stored HTML. Code fences become <CodeBlock> components straight
  // from the DOM tree — no regex surgery on the HTML string, which used to
  // strip every double quote inside code samples.
  const elements = parse(text || "", {
    replace: (domNode) => {
      if (domNode.type !== "tag") return undefined;

      if (domNode.name === "pre") {
        const codeNode = (domNode.children || []).find(
          (child) => child.type === "tag" && child.name === "code"
        );
        if (!codeNode) return undefined;
        const className = (codeNode.attribs && codeNode.attribs.class) || "";
        const langMatch = className.match(/language-([\w+#-]+)/);
        return (
          <CodeBlock
            code={codeTextOf(codeNode)}
            language={langMatch ? langMatch[1] : null}
          />
        );
      }

      // Legacy marker kept for old cached bodies, if any ever resurface.
      if (domNode.name === "codeblock") {
        const raw = (domNode.attribs && domNode.attribs.code) || "";
        return <CodeBlock code={raw.replace(/&quot;/g, '"')} language={null} />;
      }

      return undefined;
    },
  });

  const styles = generateStyles();

  return (
    <Container fluid className="pb-3">
      <Row>
        <Col
          md={12}
          lg={9}
          xl={10}
          style={{
            paddingLeft: paddingStyles.paddingLeft,
            paddingRight: paddingStyles.paddingRight,
          }}
        >
          <div className="mb-4">
            <BlogHeader
              date={date}
              language={language}
              type={type}
              title={title}
              wordcount={wordcount}
              blogid={blogid}
            />
            <BlogTitle title={title} />
            <div className="blog-content">
              {elements}
              <style>{styles}</style>
            </div>
            <BlogLikeButton blogid={blogid} />
            <br />
          </div>
        </Col>
        <Col className="d-none d-lg-block">
          <BlogToc />
        </Col>
      </Row>
    </Container>
  );
}

export default memo(SingleBlog);
