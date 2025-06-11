import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGlobalColorScheme } from "@/config/global.js";
import Modal from "./Modal";

const CustomDropdown = ({ id, label, options, selectedValue, onSelect, colors, dark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const buttonStyle = {
    backgroundColor: colors.color_white,
    borderColor: colors.color_black,
    color: colors.color_black,
    margin: "0.3rem",
    padding: "0.5rem",
    borderRadius: "8px",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.08)",
    fontWeight: "500",
    whiteSpace: "nowrap",
    cursor: "pointer",
  };

  const itemStyle = (isSelected) => ({
    backgroundColor: isSelected ? colors.color_light_gray : colors.color_white,
    color: colors.color_black,
    padding: "0.75rem 1rem",
    margin: "0.2rem 0",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: isSelected ? "bold" : "normal",
    textAlign: "center",
    transition: "background-color 0.2s",
  });

  return (
    <div ref={dropdownRef} style={{ display: "inline-block" }}>
      <button style={buttonStyle} onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-controls={id} aria-haspopup="true">
        {label}
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} colors={colors} dark={dark}>
        <div id={id} role="menu">
          {options.map((option) => (
            <div
              key={option.value}
              style={itemStyle(selectedValue === option.value)}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelect(option.value);
                  setIsOpen(false);
                }
              }}
              role="menuitem"
              tabIndex={0}
              aria-selected={selectedValue === option.value}
            >
              {option.label}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

const SortComponent = ({ currentSort, currentType }) => {
  const { colors } = useGlobalColorScheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeSort, setActiveSort] = useState(searchParams.get("sort") || currentSort || "date_latest");

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
    const queryParams = {};
    if (currentType && currentType !== "all") queryParams.type = currentType;
    if (sortValue !== "date_latest") queryParams.sort = sortValue;
    router.replace({
      pathname: "/",
      query: queryParams,
    });
  };

  const getCurrentSortLabel = () => {
    const sortOption = sortOptions.find((option) => option.value === activeSort);
    return sortOption ? `Sort: ${sortOption.label}` : "Sort: Newest";
  };

  const dark = colors.color_black === "#ffffff";

  return (
    <CustomDropdown 
      id="dropdown-sort" 
      label={getCurrentSortLabel()} 
      options={sortOptions} 
      selectedValue={activeSort} 
      onSelect={handleSortClick} 
      colors={colors} 
      dark={dark} 
    />
  );
};

export default SortComponent;