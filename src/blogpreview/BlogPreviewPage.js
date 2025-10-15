import React, { useState, useEffect } from "react";
import PreviewCard from "./PreviewCard.js";
import Pagination from "@/blogpreview/Pagination.js";
import OtherComponent from "../sidebar/Sidebar.js";

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

function BlogPreviewPage({ currentType, data, pagination, postTypeArray, currentSort, searchTerm }) {
  const isMobile = useIsMobile();

  const containerStyle = {
    minHeight: "100vh",
  };

  const contentStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    padding: "1rem 20px", // Adjusted padding
  };

  const sidebarStyle = {
    flex: "0 0 300px",
    alignSelf: "flex-start",
  };

  const mainContentStyle = {
    flex: "1",
    marginLeft: !isMobile ? "5%" : "auto",
    marginRight: !isMobile ? "10%" : "auto",
    maxWidth: "800px",
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {/* --- CHANGE 2: Reordered the elements --- */}
        {/* The main content now comes FIRST in the JSX for desktop view */}
        <div style={mainContentStyle}>
          {data && data.length > 0 ? (
            data.map((post, index) => (
              <div key={index}>
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
          {pagination && pagination.totalPages > 1 && <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />}
        </div>

        {/* The sidebar now comes SECOND, so it appears on the right */}
        {!isMobile && (
          <div style={sidebarStyle}>
            <OtherComponent currentType={currentType} postTypeArray={postTypeArray} currentSort={currentSort} isSidebar={true} />
          </div>
        )}

        {/* The mobile layout remains unchanged, appearing at the bottom */}
        {isMobile && postTypeArray && postTypeArray.length > 0 && <OtherComponent currentType={currentType} postTypeArray={postTypeArray} currentSort={currentSort} isSidebar={false} />}
      </div>
    </div>
  );
}

export default BlogPreviewPage;
