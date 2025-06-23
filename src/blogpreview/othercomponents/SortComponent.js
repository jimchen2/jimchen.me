import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const SortComponent = ({ currentSort, currentType }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeSort, setActiveSort] = useState(currentSort || "date_latest");
  const [showCountFor, setShowCountFor] = useState(null); // Track which sort's count to show

  useEffect(() => {
    const sortFromUrl = searchParams.get("sort");
    const isValidSort = sortOptions.some((opt) => opt.value === sortFromUrl);
    setActiveSort(isValidSort ? sortFromUrl : currentSort || "date_latest");
  }, [searchParams, currentSort]);

  const sortOptions = [
    { value: "date_latest", label: "Newest" },
    { value: "date_oldest", label: "Oldest" },
    { value: "most_words", label: "Most Words" },
    { value: "least_words", label: "Least Words" },
  ];

  const handleSortClick = (sortValue) => {
    setActiveSort(sortValue);
    setShowCountFor((prev) => (prev === sortValue ? null : sortValue)); // Toggle count display
    const queryParams = {};
    if (currentType && currentType !== "all") queryParams.type = currentType;
    if (sortValue !== "date_latest") queryParams.sort = sortValue;
    router.replace({
      pathname: "/",
      query: queryParams,
    });
  };

  // --- REFINED STYLING LOGIC ---

  const sortListStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "0.2rem 0.5rem",
    padding: "1rem",
    borderRadius: "8px",
  };

  const sortItemStyle = (isSelected) => ({
    fontWeight: isSelected ? "bold" : "normal",
    cursor: "pointer",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    transition: "color 0.2s",
  });

  return (
    <div style={{ marginBottom: "1rem" }}>
      <span style={{ display: "block", marginBottom: "0.5rem", paddingLeft: "1rem", fontWeight: "bold" }}>Sort:</span>
      <div style={sortListStyle}>
        {sortOptions.map((option) => (
          <div
            key={option.value}
            style={sortItemStyle(activeSort === option.value)}
            onClick={() => handleSortClick(option.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleSortClick(option.value);
            }}
            role="button"
            tabIndex={0}
            aria-selected={activeSort === option.value}
            aria-label={`Sort by ${option.label}`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortComponent;