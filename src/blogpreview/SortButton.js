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
    borderColor: colors.color_blue,
    color: colors.color_blue,
    marginTop: 10,
  };

  const dropdownItemStyle = (selected) => ({
    backgroundColor: colors.color_white,
    color: selected ? colors.color_black : colors.color_blue,
    fontWeight: selected ? "bold" : "normal",
  });

  const handleSortClick = (sortValue) => {
    if (activeType === "all") {
      router.push(sortValue === "date_latest" ? "/" : `/?sort=${sortValue}`);
    } else {
      router.push(
        `/?type=${activeType}${
          sortValue === "date_latest" ? "" : `&sort=${sortValue}`
        }`
      );
    }
  };

  const getCurrentSortLabel = () => {
    const sort = currentSort || "date_latest";
    const sortOption = sortOptions.find((option) => option.value === sort);
    return sortOption ? sortOption.label : "Newest First";
  };

  return (
    <Dropdown className="align-self-end">
      <Dropdown.Toggle style={buttonStyle} id="dropdown-sort">
        Sort: {getCurrentSortLabel()}
      </Dropdown.Toggle>

      <Dropdown.Menu>
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
