// BlogPreviewPage.js

import React, { useState, useEffect } from "react";
import PreviewCard from "./PreviewCard.js";
import Pagination from "@/blogpreview/Pagination.js";
import OtherComponent from "./othercomponents/OtherComponent.js";
import { useTranslation } from "next-i18next"; // Import the hook

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
  // 1. Get both `t` (for translation) and `i18n` (for language)
  const { t, i18n } = useTranslation("common");
  const isMobile = useIsMobile();

  // 2. Determine the locale for date formatting, treating 'x-default' as 'en'
  const dateLocale = i18n.language === 'x-default' ? 'en' : i18n.language;

  const containerStyle = {
    minHeight: "100vh",
  };

  const contentStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    padding: "1rem 20px",
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
        <div style={mainContentStyle}>
          {data && data.length > 0 ? (
            data.map((post, index) => {
              // 3. Handle all date formatting logic right here
              let displayDate;
              if (post.date === "Dec 31, 9999") {
                displayDate = t("previewCard.current"); // Use translation for "In Progress"
              } else if (post.date) {
                try {
                  // Format the date using the determined locale
                  displayDate = new Intl.DateTimeFormat(dateLocale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }).format(new Date(post.date));
                } catch (error) {
                  displayDate = post.date; // Fallback to original string on error
                }
              } else {
                displayDate = ""; // Or handle as needed if date is missing
              }

              return (
                <div key={index}>
                  <PreviewCard
                    blogid={post.blogid}
                    title={post.title}
                    text={post.preview_text}
                    date={displayDate} // 4. Pass the final, formatted string
                    tags={post.type}
                    wordcount={post.word_count}
                    previewimage={post.preview_image}
                    searchTerm={searchTerm}
                  />
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: "center", margin: "5rem 0" }}>No results found.</div>
          )}
          {pagination && pagination.totalPages > 1 && <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />}
        </div>

        {!isMobile && (
          <div style={sidebarStyle}>
            <OtherComponent currentType={currentType} postTypeArray={postTypeArray} currentSort={currentSort} isSidebar={true} />
          </div>
        )}

        {isMobile && postTypeArray && postTypeArray.length > 0 && <OtherComponent currentType={currentType} postTypeArray={postTypeArray} currentSort={currentSort} isSidebar={false} />}
      </div>
    </div>
  );
}

export default BlogPreviewPage;