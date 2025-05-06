import { React, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation.js";
import { useRouter } from "next/router.js";
import { useGlobalColorScheme } from "@/config/global.js";
import SortButton from "./SortButton";

const ToggleButtonGroupComponent = ({ currentType, postTypeArray, paddingTop }) => {
  const { colors } = useGlobalColorScheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeType, setActiveType] = useState(currentType || "all" || (postTypeArray.length > 0 ? postTypeArray[0].type : ""));
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl && postTypeArray.some((pt) => pt.type === typeFromUrl)) {
      setActiveType(typeFromUrl);
    } else if (!typeFromUrl) {
      setActiveType("all");
    }
  }, [searchParams, postTypeArray]);

  const buttonStyle = (type) => ({
    backgroundColor: activeType === type 
      ? colors.color_blue 
      : hoveredButton === type 
        ? colors.color_gray 
        : colors.color_white,
    color: activeType === type 
    ? colors.color_white : colors.color_black,
    borderRadius: "8px",
    padding: "0.5rem 0.5rem",
    margin: "0.3rem",
    top: `${paddingTop}px`,
    flexShrink: 0,
    flexGrow: 0,
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
    fontWeight: "500",
    transform: hoveredButton === type ? "translateY(-1px)" : "none",
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

  const totalPostsCount = postTypeArray.reduce((sum, { count }) => sum + count, 0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "0 8%",
        gap: "1rem",
      }}
    >
      <div
        role="group"
      >
        <button 
          onClick={() => handleButtonClick("all")} 
          style={buttonStyle("all")}
          onMouseEnter={() => setHoveredButton("all")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          All ({totalPostsCount})
        </button>
        {postTypeArray.map(({ type, count }) => (
          <button 
            key={type} 
            onClick={() => handleButtonClick(type)} 
            style={buttonStyle(type)}
            onMouseEnter={() => setHoveredButton(type)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
          </button>
        ))}
      </div>
      {/* <SortButton
        currentSort={searchParams.get("sort") || "date_latest"}
        activeType={activeType}
      /> */}
    </div>
  );
};

export default ToggleButtonGroupComponent;
