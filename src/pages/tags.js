// pages/tags.js

import React from "react";
import axios from "axios";
import Link from "next/link";

const TagsPageComponent = ({ postTypeArray }) => {
  // Prepend the "All" option to our tags array
  const allTags = [
    { type: "all", label: "All Posts", count: postTypeArray.reduce((sum, pt) => sum + pt.count, 0) },
    ...postTypeArray.map(({ type, count }) => ({
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      count,
    })),
  ];

  // --- STYLING for the full page ---
  const containerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "1rem 2rem",
  };

  const tagListStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "center",
    listStyle: "none",
    padding: 0,
  };

  const tagItemStyle = {
    display: "block",
    padding: "0.75rem 1.5rem",
    border: "1px solid #ddd",
    borderRadius: "25px",
    textDecoration: "none",
    color: "#333",
    fontWeight: 500,
    transition: "background-color 0.2s, color 0.2s",
  };

  // A simple hover effect can be managed with CSS-in-JS or a separate CSS file
  // For simplicity, we'll just define the style here.
  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = "#f0f0f0";
    e.currentTarget.style.borderColor = "#ccc";
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.borderColor = "#ddd";
  };

  return (
    <div style={containerStyle}>
      <div style={tagListStyle}>
        {allTags.map((tag) => (
          <Link
            key={tag.type}
            href={tag.type === "all" ? "/blog" : `/blog?type=${tag.type}`}
            passHref
            legacyBehavior // Recommended for styling anchor tags directly
          >
            <a
              style={tagItemStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label={`View posts tagged with ${tag.label} (${tag.count} posts)`}
            >
              {tag.label} ({tag.count})
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};
export async function getServerSideProps() {
  try {
    // We only need the filters, not the posts.
    // We call the same endpoint but will only use the 'filters' part of the response.
    const apiUrl = `${process.env.NEXT_PUBLIC_SITE}/api/blogpreview`;
    const response = await axios.get(apiUrl);

    const postTypeArray = response.data.filters?.types || [];

    return {
      props: {
        postTypeArray,
      },
    };
  } catch (err) {
    console.error("Error in getServerSideProps for tags page:", err);
    return {
      props: {
        postTypeArray: [],
        error: "Failed to fetch tags.",
      },
    };
  }
}

const TagsPage = ({ postTypeArray, error }) => {
  if (error) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>{error}</div>;
  }

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "2rem 0" }}>All Tags</h1>
      <TagsPageComponent postTypeArray={postTypeArray} />
    </div>
  );
};

export default TagsPage;