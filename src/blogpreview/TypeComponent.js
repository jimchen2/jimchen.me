import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGlobalColorScheme } from "@/config/global.js";

const TypeComponent = ({ currentType, postTypeArray, currentSort, isSidebar }) => {
  const { colors } = useGlobalColorScheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeType, setActiveType] = useState(currentType || "all");
  const [showCountFor, setShowCountFor] = useState(null); // Track which type's count to show

  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl && postTypeArray.some((pt) => pt.type === typeFromUrl)) {
      setActiveType(typeFromUrl);
    } else {
      setActiveType("all");
    }
  }, [searchParams, postTypeArray]);

  const typeOptions = [
    { type: "all", label: `All`, count: postTypeArray.reduce((sum, pt) => sum + pt.count, 0) },
    ...postTypeArray.map(({ type, count }) => ({
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      count,
    })),
  ];

  const handleTypeClick = (type) => {
    setActiveType(type);
    setShowCountFor((prev) => (prev === type ? null : type)); // Toggle count display
    const queryParams = {};
    if (type !== "all") queryParams.type = type;
    if (currentSort && currentSort !== "date_latest") queryParams.sort = currentSort;
    router.replace({
      pathname: "/",
      query: queryParams,
    });
  };

  // --- REFINED STYLING LOGIC ---

  // Style for the container div. It's only a styled "box" in the sidebar.
  const typeListStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "0.2rem 0.5rem",
    padding: "1rem",
    backgroundColor: colors.color_light_gray,
    borderRadius: "8px",
  };

  // Style for each individual tag. This is now the SAME compact style for both mobile and desktop.
  const typeItemStyle = (isSelected) => {
    return {
      color: isSelected ? colors.color_black : colors.color_text_faded,
      fontWeight: isSelected ? "bold" : "normal",
      cursor: "pointer",
      fontSize: "0.9rem",
      lineHeight: "1.5",
      transition: "color 0.2s",
    };
  };

  return (
    <div>
      <span style={{ display: "block", marginBottom: "0.5rem", paddingLeft: "1rem", fontWeight: "bold" }}>Tags:</span>

      <div style={typeListStyle}>
        {typeOptions.map((option) => (
          <div
            key={option.type}
            style={typeItemStyle(activeType === option.type)}
            onClick={() => handleTypeClick(option.type)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleTypeClick(option.type);
              }
            }}
            role="button"
            tabIndex={0}
            aria-selected={activeType === option.type}
            aria-label={`Filter by type ${option.label} (${option.count} posts)`}
          >
            {option.label}
            {showCountFor === option.type && ` (${option.count})`} {/* Show count if clicked */}
          </div>
        ))}
      </div>
      <br />
    </div>
  );
};

export default TypeComponent;