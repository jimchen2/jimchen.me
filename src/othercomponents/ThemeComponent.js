import React from "react";
import { useGlobalColorScheme, toggleTheme } from "../config/global";
import { FaPalette } from "react-icons/fa";

const ThemeComponent = () => {
  const { colors, updateColor } = useGlobalColorScheme();

  const handleToggleTheme = () => {
    toggleTheme(colors, updateColor);
  };

  return (
    <div className="theme-wrapper" style={{ marginLeft: "5%", marginBottom: "5%", marginTop: "5%", fontSize: "1rem", fontWeight: "bold" }}>
      <div>
        <div
          className="theme-button"
          onClick={handleToggleTheme}
          role="button"
          tabIndex={0}
          aria-label="Toggle website color theme"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleToggleTheme();
          }}
          style={{ display: "flex" }}
        >
          <div>Toggle Theme</div>
          <div style={{ minWidth: "20px" }}></div>
          <FaPalette />
        </div>
      </div>

      <style jsx>{`
        .theme-wrapper {
          background: ${colors.color_light_gray};
        }
        .theme-button {
          background: ${colors.color_white};
        }
      `}</style>
    </div>
  );
};

export default ThemeComponent;
