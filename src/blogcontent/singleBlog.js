import React, { useEffect, useState, memo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import parse from "html-react-parser";
import { SideNav } from "./sideBar";
import { useGlobalColorScheme } from "../config/global";
import BlogLikeButtonHelper from "./likebutton/bloglikebuttonhelper";
import CodeBlock from "./codeBlock";
import { generateStyles } from "./blogstylesHelper";

// Default padding values for server-side rendering
function calculateBlogPadding(windowWidth = null) {
  const basePaddingTop = 50;

  // Default padding values based on screen size
  const getPaddingValues = (width) => {
    if (width >= 1200) return { left: 10, right: 20 };
    if (width >= 600) return { left: 10, right: 10 };
    return { left: 5, right: 5 };
  };

  // Use provided windowWidth or fallback to a default (e.g., 1200 for SSR)
  const width = windowWidth || 1200; // Default width for SSR
  const padding = getPaddingValues(width);

  return {
    paddingTop: `${basePaddingTop}px`,
    paddingLeft: `${padding.left}%`,
    paddingRight: `${padding.right}%`,
  };
}

const BlogHeader = ({ date, language, type, title, colors, wordcount, blogid }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const shortUrl = `${window.location.origin}/a/${blogid}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="blog-header mb-3">
      <br />
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <small className="text" style={{ color: colors.color_black }}>
            {date} • {wordcount} words
          </small>
        </div>
      </div>
    </div>
  );
};

const BlogTitle = ({ title, colors }) => (
  <h2 className="mb-4">
    <div style={{ color: colors.color_blue }}>{title.split("-").join(" ")}</div>
  </h2>
);

function SingleBlog({ date, text, title, language, type, blogid, wordcount }) {
  const { colors } = useGlobalColorScheme();
  const [paddingStyles, setPaddingStyles] = useState(calculateBlogPadding()); // Default for SSR

  useEffect(() => {
    const handleResize = () => {
      setPaddingStyles(calculateBlogPadding(window.innerWidth));
    };
    setPaddingStyles(calculateBlogPadding(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const processedText = text.replace(/<pre><code class="(language-\w+)">(.*?)<\/code><\/pre>|<pre><code>(.*?)<\/code><\/pre>/gs, (match, language, codeWithLang, codeWithoutLang) => {
    const code = codeWithLang || codeWithoutLang;
    return `<codeblock code="${code.replace(/"/g, "")}"></codeblock>`;
  });

  const elements = parse(processedText, {
    replace: (domNode) => {
      if (domNode.name === "codeblock") {
        const { code } = domNode.attribs;
        return <CodeBlock code={code.replace(/"/g, '"')} />;
      }
    },
  });

  const styles = [generateStyles(colors)].join(" ");

  return (
    <Container fluid className="pb-3">
      <Row>
        <Col className="d-none d-lg-block">
          <SideNav />
        </Col>
        <Col
          md={12}
          lg={9}
          xl={10}
          style={{
            paddingTop: paddingStyles.paddingTop,
            paddingLeft: paddingStyles.paddingLeft,
            paddingRight: paddingStyles.paddingRight,
          }}
        >
          <div className="mb-4">
            <BlogHeader date={date} language={language} type={type} title={title} colors={colors} wordcount={wordcount} blogid={blogid} />
            <BlogTitle title={title} colors={colors} />
            <div className="blog-content">
              {elements}
              <style>{styles}</style>
            </div>
            <BlogLikeButtonHelper blogid={blogid} />
            <br />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default memo(SingleBlog);
