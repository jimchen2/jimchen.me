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
              key={option.value || option.type}
              style={itemStyle(selectedValue === (option.value || option.type))}
              onClick={() => {
                onSelect(option.value || option.type);
                setIsOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelect(option.value || option.type);
                  setIsOpen(false);
                }
              }}
              role="menuitem"
              tabIndex={0}
              aria-selected={selectedValue === (option.value || option.type)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

const FilterSortComponent = ({ currentType, postTypeArray, paddingTop = 0, currentSort }) => {
  const { colors } = useGlobalColorScheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  // State for active type and sort
  const [activeType, setActiveType] = useState(currentType || "all");
  const [activeSort, setActiveSort] = useState(searchParams.get("sort") || currentSort || "date_latest");

  // Sync activeType and activeSort with URL on mount or URL change
  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    const sortFromUrl = searchParams.get("sort");

    if (typeFromUrl && postTypeArray.some((pt) => pt.type === typeFromUrl)) {
      setActiveType(typeFromUrl);
    } else {
      setActiveType("all");
    }

    const isValidSort = sortOptions.some((opt) => opt.value === sortFromUrl);
    setActiveSort(isValidSort ? sortFromUrl : currentSort || "date_latest");
  }, [searchParams, postTypeArray, currentSort]);

  // Sort options
  const sortOptions = [
    { value: "date_latest", label: "Newest" },
    { value: "date_oldest", label: "Oldest" },
    { value: "most_words", label: "Most Words" },
    { value: "least_words", label: "Least Words" },
  ];

  // Type options including "All"
  const typeOptions = [
    { type: "all", label: `All` },
    ...postTypeArray.map(({ type, count }) => ({
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} (${count})`,
      count,
    })),
  ];

  // Handle type selection
  const handleTypeClick = (type) => {
    setActiveType(type);
    const queryParams = {};
    if (type !== "all") queryParams.type = type;
    if (activeSort !== "date_latest") queryParams.sort = activeSort;
    router.replace({
      pathname: "/",
      query: queryParams,
    });
  };

  // Handle sort selection
  const handleSortClick = (sortValue) => {
    setActiveSort(sortValue);
    const queryParams = {};
    if (activeType !== "all") queryParams.type = activeType;
    if (sortValue !== "date_latest") queryParams.sort = sortValue;
    router.replace({
      pathname: "/",
      query: queryParams,
    });
  };

  // Get current labels
  const getCurrentTypeLabel = () => {
    const typeOption = typeOptions.find((option) => option.type === activeType);
    return typeOption ? `Type: ${typeOption.label}` : `Type: All )`;
  };

  const getCurrentSortLabel = () => {
    const sortOption = sortOptions.find((option) => option.value === activeSort);
    return sortOption ? `Sort: ${sortOption.label}` : "Sort: Newest";
  };

  const dark = colors.color_black === "#ffffff";

  return (
    <div
      style={{
        marginTop: `${paddingTop}px`,
      }}
      className="filter-container"
    >
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          whiteSpace: "nowrap",
          alignItems: "center",
          flexWrap: "nowrap",
          paddingBottom: "0.5rem",
        }}
      >
        <CustomDropdown id="dropdown-type" label={getCurrentTypeLabel()} options={typeOptions} selectedValue={activeType} onSelect={handleTypeClick} colors={colors} dark={dark} />
        <CustomDropdown id="dropdown-sort" label={getCurrentSortLabel()} options={sortOptions} selectedValue={activeSort} onSelect={handleSortClick} colors={colors} dark={dark} />
      </div>

      <style jsx>{`
        .filter-container {
          padding: 0 5%;
        }

        @media (min-width: 992px) {
          .filter-container {
            padding: 0 18%;
          }
        }
      `}</style>
    </div>
  );
};

export default FilterSortComponent;
