import React, { useEffect, useState, memo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import parse from "html-react-parser";
import { SideBar } from "./sideBar";
import BlogLikeButtonHelper from "./likebutton/bloglikebuttonhelper";
import CodeBlock from "./codeBlock";
import { generateStyles } from "./blogstylesHelper";

// Default padding values for server-side rendering
function calculateBlogPadding(windowWidth = null) {
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
    paddingLeft: `${padding.left}%`,
    paddingRight: `${padding.right}%`,
  };
}

const BlogHeader = ({ date, wordcount }) => {
  console.log(date);

  const displayDate = date === "December 31, 9999" ? "Current" : date;

  return (
    <div className="blog-header mb-3">
      <br />
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <small className="text">
            {/* --- AND HERE --- */}
            {/* Use the new variable to display the date */}
            {displayDate} • {wordcount} words
          </small>
        </div>
      </div>
    </div>
  );
};

const BlogTitle = ({ title }) => (
  <h2 className="mb-4">
    <div>{title.split("-").join(" ")}</div>
  </h2>
);

function SingleBlog({ date, text, title, language, type, blogid, wordcount }) {
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

  const styles = [generateStyles()].join(" ");

  return (
    <Container fluid className="pb-3">
      <Row>
        {/* The main content column now comes first */}
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
            <BlogHeader date={date} language={language} type={type} title={title} wordcount={wordcount} blogid={blogid} />
            <BlogTitle title={title} />
            <div className="blog-content">
              {elements}
              <style>{styles}</style>
            </div>
            <BlogLikeButtonHelper blogid={blogid} />
            <br />
          </div>
        </Col>
        <Col className="d-none d-lg-block">
          <SideBar />
        </Col>
      </Row>
    </Container>
  );
}

export default memo(SingleBlog);
