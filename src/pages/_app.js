"use client";

import React, { useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ColorSchemeProvider, setIpAddress } from "../config/config.js";

import MainLayout from "@/layout/MainLayout.js";

// --- Helper function to fetch IP (Unchanged) ---
const fetchIpInfo = async () => {
  try {
    const response = await axios.get("/api/get-ip");
    if (response?.data?.ip) {
      setIpAddress(response.data.ip);
    }
  } catch (error) {
    console.error("Failed to fetch IP:", error);
  }
};


// --- Main App Component ---
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    fetchIpInfo();
  }, []);

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

      {/* Global styles can be placed here or in a global.css file */}
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