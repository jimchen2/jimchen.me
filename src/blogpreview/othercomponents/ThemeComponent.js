import React from "react";
import { useGlobalColorScheme } from "@/lib/config"; // Ensure this path is correct for your project

const ThemeComponent = () => {
  const { themeMode, toggleThemeMode, isHydrated } = useGlobalColorScheme();

  const themeOptions = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];

  const handleThemeClick = (selectedMode) => {
    if (!isHydrated) return;
    if (themeMode !== selectedMode) {
      toggleThemeMode(); // This will flip to the other mode
    }
  };

  const itemStyle = (isSelected) => ({
    fontWeight: isSelected ? "bold" : "normal",
    cursor: "pointer",
    padding: "0 0.25rem", // Minimal padding for clickability
    display: "inline-block", // Keep them on the same line
  });

  return (
    <div
      style={{
        marginLeft: "5%",
        marginBottom: "5%",
        marginTop: "5%",
        fontSize: "1rem", // Adjust font size as needed
        lineHeight: "1.5",
      }}
    >
      <span style={{ marginRight: "0.25rem" }}>Theme:</span>
      {isHydrated ? (
        themeOptions.map((option, index) => (
          <React.Fragment key={option.value}>
            <span
              style={itemStyle(themeMode === option.value)}
              onClick={() => handleThemeClick(option.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleThemeClick(option.value);
              }}
              role="button"
              tabIndex={0}
              aria-selected={themeMode === option.value}
              aria-label={`Set theme to ${option.label}`}
            >
              {option.label}
            </span>
          </React.Fragment>
        ))
      ) : (
        <span style={{ fontStyle: "italic", marginLeft: "0.25rem" }}>Loading...</span>
      )}
    </div>
  );
};

export default ThemeComponent;