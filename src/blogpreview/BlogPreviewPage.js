import React from "react";
import PreviewCard from "./PreviewCard.js";
import ToggleButtonGroupComponent from "./ToggleButtonGroupComponent.js";
import { paddingtop } from "../config/global.js";
import { useGlobalColorScheme } from "../config/global.js";

function BlogPreviewPage({
  data,
  postTypes,
  selectedTypes,
  onSelectionChange,
  totalPosts,
}) {
  const containerStyle = {
    minHeight: "100vh",
  };

  const contentStyle = {
    maxWidth: "1150px", 
    margin: "0 auto",  
    padding: "0 20px", 
  };

  const { colors } = useGlobalColorScheme();

  return (
    <div style={containerStyle}>
      <div style={{ ...contentStyle, paddingBottom: "2rem" }}>
        <ToggleButtonGroupComponent
          selectedTypes={selectedTypes}
          onSelectionChange={onSelectionChange}
          postTypes={postTypes}
          totalPosts={totalPosts}
          colors={colors}
          paddingtop={paddingtop}
        />
        <br />
        <br />
        <div style={{ marginTop: "2rem" }}></div>
        {data.map((post, index) => (
          <div key={index}>
            <PreviewCard
              title={post.title}
              text={post.body}
              date={post.date}
              type={post.type}
              language={post.language}
            />
          </div>
        ))}
        <div style={{ marginBottom: "5rem" }}></div>
      </div>
    </div>
  );
}

export default BlogPreviewPage;