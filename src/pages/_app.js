"use client";

import React from "react";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";
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
        <title>Jim Chen's Blog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
      `}</style>
    </ColorSchemeProvider>
  );
}

export default MyApp;