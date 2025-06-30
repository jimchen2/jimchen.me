// TypeComponent.js

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const TypeComponent = ({ currentType, postTypeArray, currentSort }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeType, setActiveType] = useState(currentType || "all");
const [showCountFor, setShowCountFor] = useState(currentType || null);
  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl && postTypeArray.some((pt) => pt.type === typeFromUrl)) {
      setActiveType(typeFromUrl);
    } else {
      setActiveType("all");
    }
  }, [searchParams, postTypeArray]);

  const typeOptions = [
    // The count for "all" is calculated but will not be shown, which is fine.
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

  const typeListStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "0.2rem 0.5rem",
    padding: "1rem",
    borderRadius: "8px",
  };

  const typeItemStyle = (isSelected) => ({
    fontWeight: isSelected ? "bold" : "normal",
    cursor: "pointer",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    transition: "color 0.2s",
  });

  return (
    <div style={{ marginBottom: "1rem" }}>
      <span style={{ display: "block", marginBottom: "0.5rem", paddingLeft: "1rem", fontWeight: "bold" }}>Tags:</span>
      <div style={typeListStyle}>
        {typeOptions.map((option) => (
          <div
            key={option.type}
            style={typeItemStyle(activeType === option.type)}
            onClick={() => handleTypeClick(option.type)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleTypeClick(option.type);
            }}
            role="button"
            tabIndex={0}
            aria-selected={activeType === option.type}
            // MODIFIED: Make aria-label conditional to not announce the meaningless "All" count
            aria-label={
              option.type === "all"
                ? `Filter by type ${option.label}`
                : `Filter by type ${option.label} (${option.count} posts)`
            }
          >
            {option.label}
            {showCountFor === option.type && option.type !== "all" && ` (${option.count})`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypeComponent;
