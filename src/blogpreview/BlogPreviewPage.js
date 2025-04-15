import { React, useState, useEffect } from "react";
import PreviewCard from "./PreviewCard.js";
import Pagination from "@/blogpreview/Pagination.js";
import { paddingtop, useGlobalColorScheme } from "@/config/global.js";
import { useSearchParams } from "next/navigation.js";
import { useRouter } from "next/router.js";
import SortButton from "./SortButton.js"; // Import the new component

const ToggleButtonGroupComponent = ({
  currentType,
  postTypeArray,
  paddingtop,
}) => {
  const { colors } = useGlobalColorScheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeType, setActiveType] = useState(
    currentType ||
      "all" ||
      (postTypeArray.length > 0 ? postTypeArray[0].type : "")
  );

  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl && postTypeArray.some((pt) => pt.type === typeFromUrl)) {
      setActiveType(typeFromUrl);
    } else if (!typeFromUrl) {
      setActiveType("all");
    }
  }, [searchParams, postTypeArray]);

  const buttonStyle = (type) => ({
    backgroundColor:
      activeType === type ? colors.color_blue : colors.color_white,
    color: activeType === type ? colors.color_white : colors.color_blue,
    borderColor: colors.color_blue,
    top: `${paddingtop}px`,
    flexShrink: 0,
    flexGrow: 0,
    padding: "0.5rem 0.7rem",
    marginLeft: "-3px",
    marginTop: "-3px",
    borderRadius: "0rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, color 0.3s",
  });

  const handleButtonClick = (type) => {
    setActiveType(type);
    const currentSort = searchParams.get("sort");
    if (type === "all") {
      router.push(currentSort ? `/?sort=${currentSort}` : "/");
    } else {
      router.push(`/?type=${type}${currentSort ? `&sort=${currentSort}` : ""}`);
    }
  };

  const totalPostsCount = postTypeArray.reduce(
    (sum, { count }) => sum + count,
    0
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingRight: "10%",
        paddingLeft: "10%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
        type="checkbox"
      >
        <button
          onClick={() => handleButtonClick("all")}
          style={buttonStyle("all")}
        >
          all ({totalPostsCount})
        </button>
        {postTypeArray.map(({ type, count }) => (
          <button
            key={type}
            onClick={() => handleButtonClick(type)}
            style={{ ...buttonStyle(type) }}
          >
            {type} ({count})
          </button>
        ))}
      </div>
      <SortButton
        style={{ backgroundColor: colors.color_white }}
        currentSort={searchParams.get("sort") || "date_latest"}
        activeType={activeType}
      />
    </div>
  );
};

function BlogPreviewPage({
  currentType,
  data,
  pagination,
  postTypeArray,
  currentSort,
}) {
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
      <br />
      <br />
      <br />
      <div style={{ ...contentStyle }}>
        <ToggleButtonGroupComponent
          currentType={currentType}
          postTypeArray={postTypeArray}
          paddingtop={paddingtop}
        />
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
                wordcount={post.word_count}
              />
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", margin: "5rem 0" }}>
            No blog posts available.
          </div>
        )}
        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
          />
        )}
      </div>
    </div>
  );
}

export default BlogPreviewPage;
