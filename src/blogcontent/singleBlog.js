import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { MathJaxContext } from "better-react-mathjax";
import parse from "html-react-parser";
import { SideNav } from "./sideBar";
import { useGlobalColorScheme } from "../config/global";
import BlogLikeButtonHelper from "./likebutton/bloglikebuttonhelper";
import CodeBlock from "./codeBlock";
import { generateStyles } from "../styles/blogstylesHelper";

// Default padding values for server-side rendering
function calculateBlogPadding(windowWidth = null) {
  const basePaddingTop = 30;

  // Default padding values based on screen sizef
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

const BlogHeader = ({ date, language, type, title, colors, wordcount }) => (
  <div className="blog-header mb-3">
    <br />

    <div className="d-flex justify-content-between align-items-center">
      <div>
        <small className="text" style={{ color: colors.color_black }}>
          {date} • {wordcount} words
        </small>
      </div>
      <Link
        href={`/embed/${language}/${type}/${title}`}
        className="small"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: "underline",
          color: colors.color_blue,
        }}
      >
        Save as PDF
      </Link>
    </div>
  </div>
);

const BlogTitle = ({ title, colors }) => (
  <h2 className="mb-4">
    <div style={{ color: colors.color_blue }}>{title.split("-").join(" ")}</div>
  </h2>
);

function SingleBlog({ date, text, title, language, type, bloguuid, wordcount }) {
  const { colors } = useGlobalColorScheme();
  const [paddingStyles, setPaddingStyles] = useState(calculateBlogPadding()); // Default for SSR

  useEffect(() => {
    // Only runs on the client-side
    const handleResize = () => {
      setPaddingStyles(calculateBlogPadding(window.innerWidth));
    };

    // Set initial padding on mount
    setPaddingStyles(calculateBlogPadding(window.innerWidth));

    // Add resize listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const processedText = text.replace(/<pre><code class="(language-\w+)">(.*?)<\/code><\/pre>|<pre><code>(.*?)<\/code><\/pre>/gs, (match, language, codeWithLang, codeWithoutLang) => {
    const code = codeWithLang || codeWithoutLang;
    const langClass = language ? language : "";
    return `<codeblock language="${langClass}" code="${code.replace(/"/g, "")}"></codeblock>`;
  });

  const elements = parse(processedText, {
    replace: (domNode) => {
      if (domNode.name === "codeblock") {
        const { language, code } = domNode.attribs;
        return <CodeBlock language={language} code={code.replace(/"/g, '"')} />;
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
            <BlogHeader date={date} language={language} type={type} title={title} colors={colors} wordcount={wordcount}/>
            <BlogTitle title={title} colors={colors} />
            <MathJaxContext>
              <div className="blog-content">
                {elements}
                <style>{styles}</style>
              </div>
            </MathJaxContext>
            <BlogLikeButtonHelper bloguuid={bloguuid} />
            <br />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SingleBlog;
