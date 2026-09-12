/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Trim the barrel files that would otherwise pull whole icon/component sets in.
  experimental: {
    optimizePackageImports: ["react-bootstrap", "react-icons", "lucide-react"],
  },

  // `content/posts/*.md` is read at runtime (demo content / database fallback),
  // so it has to be traced into the serverless bundle on deploy.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },

  // Lets the dev server accept requests from a proxied preview host.
  allowedDevOrigins: ["*.e2b.app", "*.vercel.app", "localhost:3000"],
};

export default nextConfig;
