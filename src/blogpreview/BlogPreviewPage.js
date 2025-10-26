import React from "react";
import PreviewCard from "./PreviewCard.js";
import Pagination from "@/blogpreview/Pagination.js";

function BlogPreviewPage({ data, pagination, searchTerm }) {
  return (
<div style={{ maxWidth: "700px", margin: "0 auto" }}>
      {data && data.length > 0 ? (
        data.map((post, index) => (
          <div key={index} style={{ marginBottom: "2rem" }}>
            <PreviewCard
              blogid={post.blogid}
              title={post.title}
              text={post.preview_text}
              date={post.date}
              tags={post.type}
              wordcount={post.word_count}
              previewimage={post.preview_image}
              searchTerm={searchTerm} // Pass searchTerm for highlighting
            />
          </div>
        ))
      ) : (
        <div style={{ textAlign: "center", margin: "5rem 0" }}>No results found.</div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </div>
  );
}

export default BlogPreviewPage;
