/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // `content/posts/*.md` is read with fs at runtime; make sure it is included
  // in serverless deployments (Vercel) as well.
  outputFileTracingIncludes: {
    "/**": ["./content/posts/**/*.md"],
  },
};

export default nextConfig;
