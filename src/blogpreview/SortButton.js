import { useRouter } from "next/router";
import { useGlobalColorScheme } from "@/config/global.js";
import { Dropdown } from "react-bootstrap";

const SortButton = ({ currentSort, activeType }) => {
  const { colors } = useGlobalColorScheme();
  const router = useRouter();

  const sortOptions = [
    { value: "date_latest", label: "Newest First" },
    { value: "date_oldest", label: "Oldest First" },
    { value: "most_words", label: "Most Words" },
    { value: "least_words", label: "Least Words" },
  ];

  const buttonStyle = {
    backgroundColor: colors.color_white,
    borderColor: colors.color_black,
    color: colors.color_black,
    marginTop: 10,
  };

  const dropdownItemStyle = (selected) => ({
    backgroundColor: colors.color_white,
    color: selected ? colors.color_black : colors.color_black,
    fontWeight: selected ? "bold" : "normal",
  });

  const handleSortClick = (sortValue) => {
    const queryParams = {};

    if (activeType !== "all") {
      queryParams.type = activeType;
    }

    if (sortValue !== "date_latest") {
      queryParams.sort = sortValue;
    }

    router.push({
      pathname: "/",
      query: queryParams,
    });
  };

  const getCurrentSortLabel = () => {
    const sortOption = sortOptions.find(
      (option) => option.value === currentSort
    );
    return sortOption ? sortOption.label : "Newest First";
  };

  let dark = colors.color_black == "#ffffff" ? true : false;

  return (
    <Dropdown
      data-bs-theme={dark ? "dark" : "light"}
      className="align-self-end"
    >
      <Dropdown.Toggle style={buttonStyle} id="dropdown-sort">
        Sort: {getCurrentSortLabel()}
      </Dropdown.Toggle>

      <Dropdown.Menu className="no-padding-dropdown">
        {" "}
        {sortOptions.map((option) => (
          <Dropdown.Item
            key={option.value}
            style={dropdownItemStyle(currentSort === option.value)}
            onClick={() => handleSortClick(option.value)}
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SortButton;
