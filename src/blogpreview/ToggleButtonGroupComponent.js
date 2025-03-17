"use client"; // Add this for Next.js client component

import React from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

const ToggleButtonGroupComponent = ({
  selectedTypes,
  onSelectionChange,
  postTypes,
  totalPosts,
  colors,
  paddingtop,
}) => {
  const buttonStyle = (type) => ({
    backgroundColor: selectedTypes.includes(type)
      ? colors.color_blue_2
      : colors.color_white,
    color: selectedTypes.includes(type)
      ? colors.color_white
      : colors.color_blue_2,
    borderColor: colors.color_blue_2,
    top: `${paddingtop}px`,
    flexShrink: 0,
    flexGrow: 0,
    padding: "0.5rem 0.7rem",
    borderRadius: "0rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, color 0.3s",
  });

  return (
    <ToggleButtonGroup
      style={{
        display: "flex",
        flexWrap: "wrap",
        marginBottom: "2rem",
        paddingRight: "15%",
        paddingLeft: "15%",
      }}
      type="checkbox"
      value={selectedTypes}
      onChange={onSelectionChange}
    >
      <ToggleButton
        key="all"
        id="tbg-btn-all"
        value="all"
        style={buttonStyle("all")}
      >
        {`all (${totalPosts})`}
      </ToggleButton>

      {postTypes.map(({ type, count }) => (
        <ToggleButton
          key={type}
          id={`tbg-btn-${type}`}
          value={type}
          style={buttonStyle(type)}
        >
          {type} ({count})
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ToggleButtonGroupComponent;