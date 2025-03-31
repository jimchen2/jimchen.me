"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGlobalColorScheme } from "../config/global";

const ToggleButtonGroupComponent = ({ currentType, postTypeArray, paddingtop }) => {
  const { colors } = useGlobalColorScheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeType, setActiveType] = useState(currentType || "all" || (postTypeArray.length > 0 ? postTypeArray[0].type : ""));

  // Update activeType when URL changes
  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl && postTypeArray.some((pt) => pt.type === typeFromUrl)) {
      setActiveType(typeFromUrl);
    } else if (!typeFromUrl) {
      setActiveType("all");
    }
  }, [searchParams, postTypeArray]);

  const buttonStyle = (type) => ({
    backgroundColor: activeType === type ? colors.color_blue : colors.color_white,
    color: activeType === type ? colors.color_white : colors.color_blue,
    borderColor: colors.color_blue,
    top: `${paddingtop}px`,
    flexShrink: 0,
    flexGrow: 0,
    padding: "0.5rem 0.7rem",
    marginLeft: "-3px",
    borderRadius: "0rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, color 0.3s",
  });

  const handleButtonClick = (type) => {
    setActiveType(type);
    if (type === "all") {
      router.push("/");
    } else {
      router.push(`/?type=${type}`);
    }
  };

  const totalPostsCount = postTypeArray.reduce((sum, { count }) => sum + count, 0);
  const sortedPostTypeArray = [...postTypeArray].sort((a, b) => b.count - a.count);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        paddingRight: "10%",
        paddingLeft: "10%",
      }}
      type="checkbox"
    >
      <button onClick={() => handleButtonClick("all")} style={buttonStyle("all")}>
        all ({totalPostsCount})
      </button>
      {sortedPostTypeArray.map(({ type, count }) => (
        <button key={type} onClick={() => handleButtonClick(type)} style={{ ...buttonStyle(type) }}>
          {type} ({count})
        </button>
      ))}
    </div>
  );
};

export default ToggleButtonGroupComponent;
