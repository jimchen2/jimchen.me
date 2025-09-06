// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    // These are your routing locales.
    locales: ['x-default', 'en', 'zh', 'ru'],
    // 'x-default' is the route for "original" articles.
    // Because it's the default, it will not have a prefix in the URL.
    // e.g., /a/12345
    defaultLocale: 'x-default',
    // Important: Disable locale detection to have full control over URLs.
    localeDetection: false,
  },
};

export default nextConfig;