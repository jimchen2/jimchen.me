import React from "react";
import { useTranslation } from 'next-i18next'; // 1. Import the hook
import { useGlobalColorScheme } from "@/lib/config"; // Ensure this path is correct for your project

const ThemeComponent = () => {
  const { t } = useTranslation('common'); // 2. Initialize the hook
  const { themeMode, toggleThemeMode, isHydrated } = useGlobalColorScheme();

  // 3. Define theme options inside the component to use the `t` function
  const themeOptions = [
    { value: "light", label: t('theme.light') },
    { value: "dark", label: t('theme.dark') },
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
      {/* 4. Translate the "Theme:" label */}
      <span style={{ marginRight: "0.25rem", fontWeight: "bold" }}>{t('theme.label')}</span>
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
              // 5. Translate the aria-label using interpolation
              aria-label={t('theme.ariaLabel', { label: option.label })}
            >
              {option.label}
            </span>
          </React.Fragment>
        ))
      ) : (
        // 6. Translate the "Loading..." fallback text
        <span style={{ fontStyle: "italic", marginLeft: "0.25rem" }}>{t('loading')}</span>
      )}
    </div>
  );
};

export default ThemeComponent;