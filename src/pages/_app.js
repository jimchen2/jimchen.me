"use client";

import React from "react";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";
import "katex/dist/katex.min.css";
import { ColorSchemeProvider } from "@/layout/theme";

import MainLayout from "@/layout/MainLayout.js";

// --- Main App Component ---
function MyApp({ Component, pageProps }) {
  // Check if the page component has a `showSidebar` property set to false.
  // If not specified, it defaults to true.
  const showSidebar = Component.showSidebar !== false;

  return (
    <ColorSchemeProvider>
      <Head>
        <title>Jim Chen&apos;s Blog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Daily journals, travel notes and tech writing by Jim Chen: machine learning, systems, math, cooking and slow trains."
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Jim Chen's Blog RSS"
          href="/api/rss"
        />
      </Head>

      {/* --- Use the new MainLayout --- */}
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
        div[id] {
          scroll-margin-top: 70px;
        }
        /* Pre-paint theme colors: avoids the white flash before DarkReader
           kicks in when the saved preference is dark. */
        html[data-theme="dark"] {
          background-color: #1a1b1e;
          color-scheme: dark;
        }
        html[data-theme="light"] {
          background-color: #ffffff;
          color-scheme: light;
        }
        a:focus-visible,
        button:focus-visible,
        input:focus-visible,
        textarea:focus-visible {
          outline: 2px solid #0d6efd;
          outline-offset: 2px;
        }
      `}</style>
    </ColorSchemeProvider>
  );
}

export default MyApp;
