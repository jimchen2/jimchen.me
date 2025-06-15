// pages/_app.js

"use client"; // Required because we use hooks (useEffect, useGlobalColorScheme)

import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link"; // <-- Import Link for the Navbar
import { Container, Navbar, Nav } from "react-bootstrap"; // <-- Import React Bootstrap components
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ColorSchemeProvider,
  useGlobalColorScheme,
  setIpAddress,
} from "../config/global.js";

// --- Helper function to fetch IP ---
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
// This component now includes the NavBar logic directly.
function Layout({ children }) {
  const { colors } = useGlobalColorScheme();

  // Effect to set the body background color from the global theme
  useEffect(() => {
    document.body.style.backgroundColor = colors.color_white;
  }, [colors.color_white]);

  // Styles for the main layout container
  const layoutStyle = {
    color: colors.color_black,
    backgroundColor: colors.color_white,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  };

  const mainContentStyle = {
    flex: "1",
  };

  return (
    <div style={layoutStyle}>
      {/* --- Start of NavBar logic --- */}
      <Navbar
        style={{
          fixed: "top",
          backgroundColor: colors.color_light_gray,
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
              color: colors.color_black,
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: "300",
              marginLeft: "15%",
            }}
          >
            Jim Chen's Blog
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="custom-toggler d-lg-none"
          />
          <Navbar.Collapse id="basic-navbar-nav" className="d-lg-flex">
            <Nav className="ms-auto d-none d-lg-flex"></Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* --- End of NavBar logic --- */}

      {/* Styled JSX for the custom toggler, now part of the layout */}
      <style jsx>{`
        @media (max-width: 991px) {
          .custom-toggler {
            margin-right: 15px;
          }
        }
      `}</style>

      <main style={mainContentStyle}>
        {children} {/* Renders the current page */}
      </main>
    </div>
  );
}

// --- Main App Component ---
function MyApp({ Component, pageProps }) {
  // Fetch IP on initial load
  useEffect(() => {
    fetchIpInfo();
  }, []);

  return (
    <ColorSchemeProvider>
      <Head>
        <title>Jim Chen's Blog</title> {/* Default title for all pages */}
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ColorSchemeProvider>
  );
}

export default MyApp;
