"use client";

import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Navbar, Nav } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ColorSchemeProvider,
  useGlobalColorScheme,
  setIpAddress,
} from "../lib/config.js";

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

// --- Combined Layout Component ---
function Layout({ children }) {
  const { themeMode, isHydrated } = useGlobalColorScheme();
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
      <Navbar
        fixed="top"
        variant={themeMode === "dark" ? "dark" : "light"}
        bg={themeMode === "dark" ? "dark" : "light"}
        expand="lg"
        style={{
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        <Container style={{ maxWidth: "1140px" }}>
          <Navbar.Brand
            as={Link}
            href="/"
            className="d-lg-block"
            style={{
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: "300",
              marginLeft: "15%",
            }}
          >
            Jim Chen's Blog
          </Navbar.Brand>
        </Container>
      </Navbar>

      <style jsx global>{`
        body {
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .navbar-brand, .nav-link {
          transition: color 0.3s ease;
        }
        /* Add scroll offset for sections with IDs */
        section[id], div[id] {
          padding-top: 70px; /* Matches navbar height */
          margin-top: -70px; /* Compensates for padding */
          scroll-margin-top: 70px; /* Adjusts scroll target for modern browsers */
        }
      `}</style>
      <style jsx>{`
        @media (max-width: 991px) {
          .custom-toggler {
            margin-right: 15px;
          }
          .navbar-brand {
            margin-left: 10px !important;
          }
          .navbar-collapse {
            margin-top: 10px;
          }
        }
      `}</style>

      <main style={mainContentStyle}>
        {children}
      </main>
    </div>
  );
}

// --- Main App Component ---
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
