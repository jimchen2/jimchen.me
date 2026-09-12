import React, { memo, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BlogToc } from "./blogToc";
import BlogLikeButton from "./bloglikebutton";
import BlogViewCounter from "./blogViewCounter";
import BlogContent from "./blogContent";
import { displayTitle } from "@/lib/display";
// Blog content styles are global CSS and live in _app.js (pages-router rule).

function calculateBlogPadding(windowWidth = null) {
  const getPaddingValues = (width) => {
    if (width >= 1200) return { left: 10, right: 20 };
    if (width >= 600) return { left: 10, right: 10 };
    return { left: 5, right: 5 };
  };

  const padding = getPaddingValues(windowWidth || 1200);

  return {
    paddingLeft: `${padding.left}%`,
    paddingRight: `${padding.right}%`,
  };
}

function useIsNarrow(breakpoint = 500) {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isNarrow;
}

const BlogHeader = ({ date, type, wordcount, blogid }) => {
  const types = (Array.isArray(type) ? type : String(type ?? "").split(","))
    .map((t) => String(t).trim())
    .filter(Boolean);

  const isSmall = useIsNarrow();

  return (
    <div className="blog-header mb-3">
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: isSmall ? "column" : "row",
          justifyContent: isSmall ? "flex-start" : "space-between",
          alignItems: isSmall ? "flex-start" : "center",
          gap: isSmall ? "0.35rem" : 0,
        }}
      >
        <small className="text">
          {date} • {wordcount} words
          <BlogViewCounter blogid={blogid} />
        </small>

        <div>
          {types.map((t) => {
            const slug = t.toLowerCase().replace(/\s+/g, "-");
            return (
              <a
                key={slug}
                href={`/?type=${encodeURIComponent(slug)}`}
                className="text-muted text-decoration-none me-2"
              >
                #{slug}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const BlogTitle = ({ title }) => (
  <h1 className="blog-title mb-4">{displayTitle(title)}</h1>
);

function SingleBlog({ date, text, title, type, blogid, wordcount, headings }) {
  const [paddingStyles, setPaddingStyles] = useState(() => calculateBlogPadding());

  useEffect(() => {
    const handleResize = () => setPaddingStyles(calculateBlogPadding(window.innerWidth));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          <article className="mb-4">
            <BlogHeader
              date={date}
              type={type}
              title={title}
              wordcount={wordcount}
              blogid={blogid}
            />
            <BlogTitle title={title} />
            <div className="blog-content">
              <BlogContent html={text} />
            </div>            <BlogLikeButton blogid={blogid} />
            <br />
          </article>
        </Col>
        <Col className="d-none d-lg-block">
          <BlogToc blogid={blogid} headings={headings} />
        </Col>
      </Row>
    </Container>
  );
}

export default memo(SingleBlog);
