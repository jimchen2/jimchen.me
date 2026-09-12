/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // `pg` is a native-ish Node package; let Node resolve it instead of bundling.
  serverExternalPackages: ["pg"],

  images: {
    // Post preview images live in Cloudflare R2 (see README).
    remotePatterns: [{ protocol: "https", hostname: "**.r2.dev" }],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Hashed by the build, so these are safe to cache forever.
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
