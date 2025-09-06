// next-i18next.config.js

const path = require('path');

module.exports = {
  i18n: {
    // This defaultLocale is for fallback purposes for i18next.
    defaultLocale: 'en',
    // These are the languages you actually have translation files for.
    locales: ['en', 'zh', 'ru'],
  },
  localePath: path.resolve('./public/locales'),
  // reloadOnPrerender: process.env.NODE_ENV === 'development', // Optional: for dev
};