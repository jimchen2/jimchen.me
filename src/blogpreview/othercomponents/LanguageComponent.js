// components/LanguageComponent.js

import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from 'next-i18next'; // Import the translation hook

const LanguageComponent = () => {
  const { t } = useTranslation('common'); // Initialize the hook
  const router = useRouter();
  // `locale` will now be 'x-default', 'en', 'zh', or 'ru'
  const { pathname, query, asPath, locale: activeLocale } = router;

  // --- KEY CHANGE ---
  // The labels are now dynamically loaded using the t() function.
  const languages = [
    { code: "x-default", label: t('languages.original') },
    { code: "en", label: t('languages.english') },
    { code: "zh", label: t('languages.chinese') },
    { code: "ru", label: t('languages.russian') },
  ];

  // --- STYLING (Unchanged) ---
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
  const linkStyle = (isSelected) => ({
    fontWeight: isSelected ? "bold" : "normal",
    cursor: "pointer",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    transition: "color 0.2s",
    textDecoration: 'none',
    color: 'inherit',
  });

  return (
    <div style={containerStyle}>
      {/* Use the t function for the main label */}
      <span style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
        {t('languages.label')}
      </span>
      <div style={listStyle}>
        {languages.map((lang, index) => (
          <React.Fragment key={lang.code}>
            <Link
              href={{ pathname, query }} // The page we are on
              as={asPath}                 // The exact URL path with query params
              locale={lang.code}          // The new locale to switch to
              legacyBehavior
            >
              <a style={linkStyle(activeLocale === lang.code)}>
                {lang.label}
              </a>
            </Link>
            
            {index < languages.length - 1 && <span aria-hidden="true">/</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LanguageComponent;