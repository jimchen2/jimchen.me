"use client";

import React, { useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ColorSchemeProvider,
  setIpAddress,
} from "../lib/config.js";
import NavigationBar from "@/navbar/navbar.js";

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

// --- Layout Component ---
function Layout({ children }) {
  const layoutStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  };

  const mainContentStyle = {
    flex: "1",
    paddingTop: "70px", // Matches navbar height
  };

  return (
    <div style={layoutStyle}>
      <NavigationBar />

      <style jsx global>{`
        body {
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .navbar-brand,
        .nav-link {
          transition: color 0.3s ease;
        }
        /* Add scroll offset for sections with IDs */
        section[id],
        div[id] {
          padding-top: 70px; /* Matches navbar height */
          margin-top: -70px; /* Compensates for padding */
          scroll-margin-top: 70px; /* Adjusts scroll target for modern browsers */
        }
      `}</style>

      <main style={mainContentStyle}>{children}</main>
    </div>
  );
}

// --- Main App Component (Unchanged) ---
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    fetchIpInfo();
  }, []);

  return (
    <ColorSchemeProvider>
      <Head>
        <title>Jim Chen's Blog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ColorSchemeProvider>
  );
}

export default MyApp;