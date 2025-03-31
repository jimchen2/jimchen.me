import React from "react";
import PreviewCard from "./PreviewCard.js";
import Pagination from "@/pagination/Pagination.js";

function BlogPreviewPage({ data, pagination }) {
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
        <div style={{ marginTop: "2rem" }}></div>
        {data && data.length > 0 ? (
          data.map((post, index) => (
            <div key={index}>
              <PreviewCard 
                title={post.title} 
                text={post.body} 
                date={post.date} 
                type={post.type} 
                language={post.language} 
              />
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', margin: '5rem 0' }}>
            No blog posts available.
          </div>
        )}
        
        {pagination && (
          <Pagination 
            currentPage={pagination.currentPage} 
            totalPages={pagination.totalPages} 
          />
        )}
        
        <div style={{ marginBottom: "5rem" }}></div>
      </div>
    </div>
  );
}

export default BlogPreviewPage;
