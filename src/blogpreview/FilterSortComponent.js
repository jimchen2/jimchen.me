import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Dropdown } from "react-bootstrap";
import { useGlobalColorScheme } from "@/config/global.js";

const FilterSortComponent = ({ currentType, postTypeArray, paddingTop = 0, currentSort, currentLanguage }) => {
  const { colors } = useGlobalColorScheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  // State for active type, language, and sort
  const [activeType, setActiveType] = useState(currentType || "all");
  const [activeLanguage, setActiveLanguage] = useState(currentLanguage || searchParams.get("lang") || "all");
  const [activeSort, setActiveSort] = useState(searchParams.get("sort") || currentSort || "date_latest");

  // Sync activeType, activeLanguage, and activeSort with URL on mount or URL change
  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    const langFromUrl = searchParams.get("lang");
    const sortFromUrl = searchParams.get("sort");

    // Sync type
    if (typeFromUrl && postTypeArray.some((pt) => pt.type === typeFromUrl && (activeLanguage === "all" || pt.language === activeLanguage))) {
      setActiveType(typeFromUrl);
    } else {
      setActiveType("all");
    }

    // Sync language
    if (langFromUrl && postTypeArray.some((pt) => pt.language === langFromUrl)) {
      setActiveLanguage(langFromUrl);
    } else {
      setActiveLanguage("all");
    }

    // Sync sort
    const isValidSort = sortOptions.some((opt) => opt.value === sortFromUrl);
    setActiveSort(isValidSort ? sortFromUrl : currentSort || "date_latest");
  }, [searchParams, postTypeArray, currentSort, currentLanguage]);

  // Sort options
  const sortOptions = [
    { value: "date_latest", label: "Newest" },
    { value: "date_oldest", label: "Oldest" },
    { value: "most_words", label: "Most Words" },
    { value: "least_words", label: "Least Words" },
  ];

  // Extract unique languages
  const languageOptions = [
    { language: "all", label: "All" },
    ...Array.from(new Set(postTypeArray.map((pt) => pt.language)))
      .filter((lang) => lang && lang !== "unknown")
      .map((lang) => ({ language: lang, label: lang })),
  ];

  // Filter types based on selected language
  const filteredTypeArray = activeLanguage === "all" ? postTypeArray : postTypeArray.filter((pt) => pt.language === activeLanguage);

  // Calculate total posts count for filtered types
  const totalPostsCount = filteredTypeArray.reduce((sum, { count }) => sum + count, 0);

  // Type options including "All"
  const typeOptions = [
    { type: "all", label: `All (${totalPostsCount})`, count: totalPostsCount },
    ...filteredTypeArray.map(({ type, count }) => ({
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} (${count})`,
      count,
    })),
  ];

  // Styles
  const buttonStyle = {
    backgroundColor: colors.color_white,
    borderColor: colors.color_black,
    color: colors.color_black,
    margin: "0.3rem",
    padding: "0.5rem",
    borderRadius: "8px",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.08)",
    fontWeight: "500",
    whiteSpace: "nowrap", // Ensure buttons don't wrap text
  };

  const dropdownItemStyle = (selected) => ({
    backgroundColor: colors.color_white,
    color: selected ? colors.color_black : colors.color_black,
    fontWeight: selected ? "bold" : "normal",
  });

  // Handle language selection
  const handleLanguageClick = (language) => {
    setActiveLanguage(language);
    setActiveType("all"); // Reset type when language changes
    const queryParams = {};
    if (language !== "all") queryParams.lang = language;
    if (activeSort !== "date_latest") queryParams.sort = activeSort;
    router.replace({
      pathname: "/",
      query: queryParams,
    });
  };

  // Handle type selection
  const handleTypeClick = (type) => {
    setActiveType(type);
    const queryParams = {};
    if (type !== "all") queryParams.type = type;
    if (activeLanguage !== "all") queryParams.lang = activeLanguage;
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
    if (activeLanguage !== "all") queryParams.lang = activeLanguage;
    if (sortValue !== "date_latest") queryParams.sort = sortValue;
    router.replace({
      pathname: "/",
      query: queryParams,
    });
  };

  // Get current labels
  const getCurrentLanguageLabel = () => {
    const langOption = languageOptions.find((option) => option.language === activeLanguage);
    return langOption ? langOption.label : "All Languages";
  };

  const getCurrentTypeLabel = () => {
    const typeOption = typeOptions.find((option) => option.type === activeType);
    return typeOption ? typeOption.label : `All (${totalPostsCount})`;
  };

  const getCurrentSortLabel = () => {
    const sortOption = sortOptions.find((option) => option.value === activeSort);
    return sortOption ? sortOption.label : "Newest First";
  };

  const dark = colors.color_black === "#ffffff";

  return (
    <div
      style={{
        padding: window.innerWidth > 768 ? "0 18%" : "0 5%",
        marginTop: `${paddingTop}px`,
      }}
    >
      {/* Scrollable Button Container */}
      <div
        style={{
          display: "flex",
          overflowY: "scroll",
          whiteSpace: "nowrap",
          alignItems: "center",
          flexWrap: "nowrap",
          paddingBottom: "0.5rem",
        }}
      >
        {/* Language Filter Dropdown */}
        <Dropdown data-bs-theme={dark ? "dark" : "light"} style={{ display: "inline-block" }}>
          <Dropdown.Toggle style={buttonStyle} id="dropdown-language">
            Lang: {getCurrentLanguageLabel()}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {languageOptions.map((option) => (
              <Dropdown.Item key={option.language} style={dropdownItemStyle(activeLanguage === option.language)} onClick={() => handleLanguageClick(option.language)}>
                {option.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        {/* Type Filter Dropdown */}
        <Dropdown data-bs-theme={dark ? "dark" : "light"} style={{ display: "inline-block" }}>
          <Dropdown.Toggle style={buttonStyle} id="dropdown-type">
            Type: {getCurrentTypeLabel()}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {typeOptions.map((option) => (
              <Dropdown.Item key={option.type} style={dropdownItemStyle(activeType === option.type)} onClick={() => handleTypeClick(option.type)}>
                {option.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        {/* Sort Dropdown */}
        <Dropdown data-bs-theme={dark ? "dark" : "light"} style={{ display: "inline-block" }}>
          <Dropdown.Toggle style={buttonStyle} id="dropdown-sort">
            Sort: {getCurrentSortLabel()}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {sortOptions.map((option) => (
              <Dropdown.Item key={option.value} style={dropdownItemStyle(activeSort === option.value)} onClick={() => handleSortClick(option.value)}>
                {option.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default FilterSortComponent;
