import React from "react";
import PreviewCard from "./PreviewCard.js";

function BlogPreviewPage({ data }) {
  const containerStyle = {
    minHeight: "100vh",
  };

  const contentStyle = {
    maxWidth: "1150px",
    margin: "0 auto",
    padding: "0 20px",
  };

  return (
    <div style={containerStyle}>
      <div style={{ ...contentStyle, paddingBottom: "2rem" }}>
        <div ></div>
        {data.map((post, index) => (
          <div key={index}>
            <PreviewCard title={post.title} text={post.body} date={post.date} type={post.type} language={post.language} />
          </div>
        ))}
        <div style={{ marginBottom: "5rem" }}></div>
      </div>
    </div>
  );
}

export default BlogPreviewPage;
