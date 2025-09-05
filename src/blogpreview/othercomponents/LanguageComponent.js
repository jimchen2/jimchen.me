// components/LanguageComponent.js

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Import the cookie library

const LanguageComponent = () => {
  // 1. Added "Original" to the list of languages.
  const languages = [
    { code: "original", label: "Original" },
    { code: "zh", label: "中文" },
    { code: "en", label: "English" },
    { code: "ru", label: "Русский" },
  ];

  // 2. State to hold the active language. Default to 'original' if no cookie is found.
  const [activeLang, setActiveLang] = useState("original");

  // On component mount, read the language from the cookie.
  useEffect(() => {
    const savedLang = Cookies.get("language");
    if (savedLang && languages.some((lang) => lang.code === savedLang)) {
      setActiveLang(savedLang);
    }
  }, []); // The empty dependency array ensures this runs only once on mount.

  const handleLanguageSelect = (langCode) => {
    // If the selected language is already active, do nothing.
    if (activeLang === langCode) {
      return;
    }

    // Set the cookie. It will expire in 365 days.
    Cookies.set("language", langCode, { expires: 365 });

    // Reload the page to apply the language change site-wide.
    window.location.reload();
  };

  // --- STYLING ---
  const containerStyle = {
    padding: "1rem",
    paddingBottom: "0.5rem",
  };

  const listStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "0.2rem 0.5rem",
    alignItems: "center",
  };

  const itemStyle = (isSelected) => ({
    fontWeight: isSelected ? "bold" : "normal",
    cursor: "pointer",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    transition: "color 0.2s",
  });

  return (
    <div style={containerStyle}>
      <span style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Language:</span>
      <div style={listStyle}>
        {languages.map((lang, index) => (
          <React.Fragment key={lang.code}>
            <span
              style={itemStyle(activeLang === lang.code)}
              onClick={() => handleLanguageSelect(lang.code)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleLanguageSelect(lang.code);
              }}
              role="button"
              tabIndex={0}
              aria-selected={activeLang === lang.code}
              aria-label={`Set language to ${lang.label}`}
            >
              {lang.label}
            </span>
            {/* Add a separator between items */}
            {index < languages.length - 1 && <span aria-hidden="true">/</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LanguageComponent;