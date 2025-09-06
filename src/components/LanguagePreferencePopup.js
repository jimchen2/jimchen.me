// /components/LanguagePreferencePopup.js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// --- Embedded Translations ---
// This allows the prompt to be shown in the user's detected language
// before the main page's translation has loaded.
const popupTranslations = {
  // English is our fallback
  en: {
    title: "View this page in {{language}}?",
    description: "We've detected that your browser is set to {{language}}. You can switch to the translated version or continue with the original content.",
    switch_button: "Switch to {{language}}",
    stay_button: "Stay on Original"
  },
  ru: {
    title: "Посмотреть эту страницу на {{language}}?",
    description: "Мы определили, что ваш браузер настроен на {{language}}. Вы можете переключиться на переведенную версию или продолжить просмотр оригинального контента.",
    switch_button: "Переключиться на {{language}}",
    stay_button: "Остаться на оригинале"
  },
  zh: {
    title: "要用{{language}}浏览此页面吗？",
    description: "我们检测到您的浏览器语言是{{language}}。您可以切换到翻译版本或继续浏览原文。",
    switch_button: "切换到{{language}}",
    stay_button: "保留原文"
  }
};

// Map to get the language's native name for display
const languageNameMap = {
  en: 'English',
  zh: '中文',
  ru: 'Русский',
};

const LanguagePreferencePopup = () => {
  const router = useRouter();
  const { locale, locales, pathname, asPath, query } = router;

  const [isVisible, setIsVisible] = useState(false);
  const [detectedLocale, setDetectedLocale] = useState('');

  useEffect(() => {
    // --- MODIFIED ---
    // Check for the specific preference key. If the user has EVER made a choice
    // (either via this popup or the manual language switcher), we don't show the popup.
    const preference = localStorage.getItem('user_preferred_locale');
    if (preference) {
      return;
    }

    // Only show the popup on the "original" page (x-default)
    if (locale !== 'x-default') {
      return;
    }

    // Get the user's browser language (e.g., 'en-US' -> 'en')
    const browserLang = navigator.language.split('-')[0];

    // Check if the detected language is one of our supported, non-original languages
    if (locales.includes(browserLang) && browserLang !== 'en') {
      setDetectedLocale(browserLang);
      setIsVisible(true);
    }
  }, [locale, locales]); // Dependencies for the effect

  const handleSwitch = () => {
    // --- MODIFIED ---
    // Store the specific locale the user is switching TO.
    // This allows the logic in _app.js to remember their choice for future visits.
    localStorage.setItem('user_preferred_locale', detectedLocale);
    setIsVisible(false);
    // Redirect to the same page but with the new locale
    router.push({ pathname, query }, asPath, { locale: detectedLocale });
  };

  const handleStay = () => {
    // --- MODIFIED ---
    // Explicitly store that the user chose to stay on the original version.
    // This prevents the popup from appearing again on their next visit.
    localStorage.setItem('user_preferred_locale', 'x-default');
    setIsVisible(false);
  };

  // If the popup shouldn't be visible, render nothing.
  if (!isVisible) {
    return null;
  }

  // Select the correct translation object based on detected locale, fallback to English
  const t = popupTranslations[detectedLocale] || popupTranslations.en;
  const detectedLanguageName = languageNameMap[detectedLocale] || detectedLocale;

  // --- Basic Inline Styling ---
  const popupStyles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, },
    modal: { backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', maxWidth: '450px', width: '90%', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', color: '#333' },
    title: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', },
    description: { marginBottom: '1.5rem', lineHeight: '1.5', },
    buttonContainer: { display: 'flex', gap: '1rem', justifyContent: 'center', },
    button: { padding: '0.75rem 1.5rem', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer', transition: 'background-color 0.2s', },
    primaryButton: { backgroundColor: '#0070f3', color: 'white', },
    secondaryButton: { backgroundColor: '#eaeaea', color: '#333' }
  };

  return (
    <div style={popupStyles.overlay}>
      <div style={popupStyles.modal}>
        <h2 style={popupStyles.title}>
          {t.title.replace('{{language}}', detectedLanguageName)}
        </h2>
        <p style={popupStyles.description}>
          {t.description.replace('{{language}}', detectedLanguageName)}
        </p>
        <div style={popupStyles.buttonContainer}>
          <button
            onClick={handleStay}
            style={{ ...popupStyles.button, ...popupStyles.secondaryButton }}
          >
            {t.stay_button}
          </button>
          <button
            onClick={handleSwitch}
            style={{ ...popupStyles.button, ...popupStyles.primaryButton }}
          >
            {t.switch_button.replace('{{language}}', detectedLanguageName)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePreferencePopup;