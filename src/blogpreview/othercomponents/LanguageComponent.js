// /components/LanguageComponent.js

import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from 'next-i18next';

const LanguageComponent = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  // `locale` will be 'x-default', 'en', 'zh', or 'ru'
  const { pathname, query, asPath, locale: activeLocale } = router;

  // The labels are dynamically loaded using the t() function from your translation files.
  const languages = [
    { code: "x-default", label: t('languages.original') },
    { code: "en", label: t('languages.english') },
    { code: "zh", label: t('languages.chinese') },
    { code: "ru", label: t('languages.russian') },
  ];

  // --- NEW ---
  // This function is called when a user clicks a language link.
  // It saves their explicit choice to localStorage.
  const handleLanguageClick = (locale) => {
    localStorage.setItem('user_preferred_locale', locale);
  };

  // --- Styling (Unchanged) ---
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
              {/* --- MODIFIED --- 
                  The onClick handler is added here to save the preference.
                  The Link component still handles the navigation itself. */}
              <a
                style={linkStyle(activeLocale === lang.code)}
                onClick={() => handleLanguageClick(lang.code)}
              >
                {lang.label}
              </a>
            </Link>
            
            {/* Render the separator between links */}
            {index < languages.length - 1 && <span aria-hidden="true">/</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LanguageComponent;