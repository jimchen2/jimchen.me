import React, { useState, useEffect } from "react";
import PreviewCard from "./PreviewCard.js";
import Pagination from "@/blogpreview/Pagination.js";
import { paddingtop } from "@/config/global.js";
import TypeComponent from "./TypeComponent";

// A simple custom hook to detect if the screen is mobile-sized.
// It's client-side only and safe for SSR with Next.js.
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Set initial value after mounting on the client
    handleResize();
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};


function BlogPreviewPage({ currentType, data, pagination, postTypeArray, currentSort, currentLanguage }) {
  const isMobile = useIsMobile();

  const containerStyle = {
    minHeight: "100vh",
    paddingTop: paddingtop,
  };

  // The main layout container. It switches between row (desktop) and column (mobile).
  const contentStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "2rem",
    margin: "0 auto",
    padding: "2rem 20px 0 20px",
  };

  // Style for the desktop-only left sidebar
  const sidebarStyle = {
    flex: "0 0 350px",
    position: "sticky",
    top: `calc(${paddingtop} + 2rem)`,
    alignSelf: "flex-start",
  };

  // Style for the main content area (posts)
  const mainContentStyle = {
    flex: "1",
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {/* --- Left Sidebar (Desktop Only) --- */}
        {!isMobile && (
          <div style={sidebarStyle}>
            <TypeComponent
              currentType={currentType}
              postTypeArray={postTypeArray}
              currentSort={currentSort}
              isSidebar={true} // Use the compact sidebar style
            />
          </div>
        )}

        {/* --- Main Content (Posts and Pagination) --- */}
        <div style={mainContentStyle}>
          {data && data.length > 0 ? (
            data.map((post, index) => (
              <div key={index}>
                <PreviewCard
                  blogid={post.blogid}
                  title={post.title}
                  text={post.body}
                  date={post.date}
                  type={post.type}
                  language={post.language}
                  wordcount={post.word_count}
                />
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", margin: "5rem 0" }}>No blog posts available.</div>
          )}
          {pagination && <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />}
        </div>

        {/* --- Bottom Type Component (Mobile Only) --- */}
        {isMobile && (
           <TypeComponent
              currentType={currentType}
              postTypeArray={postTypeArray}
              currentSort={currentSort}
              isSidebar={false} // Use the horizontal button style
            />
        )}
      </div>
    </div>
  );
}

export default BlogPreviewPage;