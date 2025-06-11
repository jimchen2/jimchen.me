import React, { useState, useEffect } from "react";
import PreviewCard from "./PreviewCard.js";
import Pagination from "@/blogpreview/Pagination.js";
import { paddingtop } from "@/config/global.js";
import OtherComponent from "./OtherComponent";

const useIsMobile = (breakpoint = 1000) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
};

// Accept 'searchTerm' as a new prop
function BlogPreviewPage({ currentType, data, pagination, postTypeArray, currentSort, searchTerm }) {
  const isMobile = useIsMobile();

  const containerStyle = {
    minHeight: "100vh",
  };

  const contentStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    padding: "1rem 20px", // Adjusted padding
    maxWidth: "1200px",
    margin: "0 auto",
  };

  // Conditionally show sidebar only if there are types to filter by
  const showSidebar = !isMobile && postTypeArray && postTypeArray.length > 0;

  const sidebarStyle = {
    flex: "0 0 350px",
    marginTop: paddingtop,
    alignSelf: "flex-start",
  };

  const mainContentStyle = {
    flex: "1",
    marginTop: 50,
    marginLeft: showSidebar ? "2rem" : "0",
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {showSidebar && (
          <div style={sidebarStyle}>
            <OtherComponent currentType={currentType} postTypeArray={postTypeArray} currentSort={currentSort} isSidebar={true} />
          </div>
        )}

        <div style={mainContentStyle}>
          {data && data.length > 0 ? (
            data.map((post, index) => (
              <div key={index}>
                <PreviewCard
                  blogid={post.blogid}
                  title={post.title}
                  text={post.preview} // 'preview' contains the snippet from the API
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
          {pagination && pagination.totalPages > 1 && <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />}
        </div>

        {isMobile && postTypeArray && postTypeArray.length > 0 && <OtherComponent currentType={currentType} postTypeArray={postTypeArray} currentSort={currentSort} isSidebar={false} />}
      </div>
    </div>
  );
}

export default BlogPreviewPage;
