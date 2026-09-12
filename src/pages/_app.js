import React from "react";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";
// Bundled with the app instead of pulled from a CDN: versioned with the katex
// package and available offline.
import "katex/dist/katex.min.css";
import "@/styles/blog.css";
import { ColorSchemeProvider } from "@/layout/theme";
import MainLayout from "@/layout/MainLayout.js";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE || "").replace(/\/$/, "");

function MyApp({ Component, pageProps }) {
  // A page can opt out of the chrome by setting `Component.showSidebar = false`.
  const showSidebar = Component.showSidebar !== false;

  return (
    <ColorSchemeProvider>
      <Head>
        <title>Jim Chen&apos;s Blog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Journals, travel notes and technical writing by Jim Chen."
        />
        <meta property="og:site_name" content="Jim Chen's Blog" />
        {SITE_URL && <meta property="og:url" content={SITE_URL} />}
        <link rel="alternate" type="application/rss+xml" title="Jim Chen's Blog" href="/api/rss" />
      </Head>

      <MainLayout showSidebar={showSidebar}>
        <Component {...pageProps} />
      </MainLayout>

      {/* Global styles */}
      <style jsx global>{`
        body {
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .navbar-brand,
        .nav-link {
          transition: color 0.3s ease;
        }
        section[id],
        div[id],
        h1[id],
        h2[id],
        h3[id] {
          scroll-margin-top: 70px;
        }
        mark {
          background-color: yellow;
          color: inherit;
          padding: 0;
        }
      `}</style>
    </ColorSchemeProvider>
  );
}

export default MyApp;
