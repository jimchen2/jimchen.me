import { React } from "react";
import PreviewCard from "./PreviewCard.js";
import Pagination from "@/blogpreview/Pagination.js";
import { paddingtop } from "@/config/global.js";
import ToggleButtonGroupComponent from "./ToggleButtonGroup.js";

function BlogPreviewPage({ currentType, data, pagination, postTypeArray, currentSort }) {
  const containerStyle = {
    minHeight: "100vh",
  };

  const contentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
  };

  return (
    <div style={containerStyle}>
      <br />
      <br />
      <br />
      <div style={{ ...contentStyle }}>
        <ToggleButtonGroupComponent currentType={currentType} postTypeArray={postTypeArray} paddingtop={paddingtop} />
        <div style={{ marginTop: "2rem" }}></div>
        {data && data.length > 0 ? (
          data.map((post, index) => (
            <div key={index} style={{ padding: "0 20px" }}>
              <PreviewCard title={post.title} text={post.body} date={post.date} type={post.type} language={post.language} wordcount={post.word_count} />
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", margin: "5rem 0" }}>No blog posts available.</div>
        )}
        {pagination && <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />}
      </div>
    </div>
  );
}

export default BlogPreviewPage;
