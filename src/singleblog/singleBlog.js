import React, { useEffect, useState, memo } from "react";
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
  const types = (Array.isArray(type) ? type : type.split(",")).map((t) =>
    t.trim()
  );

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
          {types.map((t) => (
            <a
              key={t}
              href={`/?type=${t.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-muted text-decoration-none me-2"
            >
              #{t.toLowerCase().replace(/\s+/g, "-")}
            </a>
          ))}
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

  const processedText = text.replace(
    /<pre><code class="(language-\w+)">(.*?)<\/code><\/pre>|<pre><code>(.*?)<\/code><\/pre>/gs,
    (match, language, codeWithLang, codeWithoutLang) => {
      const code = codeWithLang || codeWithoutLang;
      return `<codeblock code="${code.replace(/"/g, "")}"></codeblock>`;
    }
  );

  const elements = parse(processedText, {
    replace: (domNode) => {
      if (domNode.name === "codeblock") {
        const { code } = domNode.attribs;
        return <CodeBlock code={code.replace(/"/g, '"')} />;
      }
    },
  });

  const styles = [generateStyles()].join(" ");

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
