import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { MathJaxContext } from "better-react-mathjax";
import parse from "html-react-parser";
import { SideNav } from "./sidebar/sidebar";
import { useGlobalColorScheme } from "../config/global";
import { calculateBlogPadding } from "./SingleBlogPaddingHelper";
import BlogLikeButtonHelper from "./likebutton/bloglikebuttonhelper";
import CodeBlock from "./CodeBlock";
import { generateCommonStyles, generateThemeStyles, generateAdditionalStyles } from "./stylesHelper";

const BlogHeader = ({ date, language, type, title, colors }) => (
  <div className="blog-header mb-3">
    <div className="d-flex justify-content-between align-items-center">
      <small className="text" style={{ color: colors.color_black }}>
        {date}
      </small>
      <Link
        href={`/embed/${language}/${type}/${title}`}
        className="small"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: "underline",
          color: colors.color_blue_2,
        }}
      >
        Save as PDF
      </Link>
    </div>
  </div>
);

const BlogTitle = ({ title, colors }) => (
  <h2 className="mb-4">
    <div style={{ color: colors.color_blue_2 }}>{title.split("-").join(" ")}</div>
  </h2>
);

function SingleBlog({ date, text, title, language, type, bloguuid }) {
  const { colors } = useGlobalColorScheme();
  const [paddingStyles, setPaddingStyles] = useState(calculateBlogPadding());

  useEffect(() => {
    const handleResize = () => setPaddingStyles(calculateBlogPadding());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const processedText = text.replace(/<pre><code class="(language-\w+)">(.*?)<\/code><\/pre>|<pre><code>(.*?)<\/code><\/pre>/gs, (match, language, codeWithLang, codeWithoutLang) => {
    const code = codeWithLang || codeWithoutLang;
    const langClass = language ? language : "";
    return `<codeblock language="${langClass}" code="${code.replace(/"/g, "&quot;")}"></codeblock>`;
  });

  const elements = parse(processedText, {
    replace: (domNode) => {
      if (domNode.name === "codeblock") {
        const { language, code } = domNode.attribs;
        return <CodeBlock language={language} code={code.replace(/&quot;/g, '"')} />;
      }
    },
  });

  const styles = [generateCommonStyles(colors), generateThemeStyles(colors), generateAdditionalStyles(colors)].join(" ");

  return (
    <Container fluid className="pb-3">
      <div className="my-4" />
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
            <BlogHeader date={date} language={language} type={type} title={title} colors={colors} />
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