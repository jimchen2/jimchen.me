"use client";

import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Navbar, Nav } from "react-bootstrap"; // Removed Button
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ColorSchemeProvider,
  useGlobalColorScheme,
  setIpAddress,
} from "../lib/config.js"; // Adjust path if necessary

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
  const { themeMode, isHydrated } = useGlobalColorScheme(); // toggleThemeMode is no longer used here
  const layoutStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    // backgroundColor and color will be managed by DarkReader or Bootstrap's theme classes
  };

  const mainContentStyle = {
    flex: "1",
    paddingTop: "70px", // Adjust if navbar height changes
  };

  // if (!isHydrated) {
  //   // You might want a loading state or specific handling here,
  //   // but for now, we let Bootstrap handle initial rendering.
  //   // The navbar variant will correctly apply once themeMode is hydrated.
  // }

  return (
    <div style={layoutStyle}>
      <Navbar
        fixed="top"
        // Use Bootstrap's theming variants based on our themeMode
        variant={themeMode === "dark" ? "dark" : "light"}
        bg={themeMode === "dark" ? "dark" : "light"}
        expand="lg" // Ensure expand is set
        style={{
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Shadow might need adjustment for dark mode
          zIndex: 1000,
        }}
      >
        <Container style={{ maxWidth: "1140px" }}>
          <Navbar.Brand
            as={Link}
            href="/"
            className="d-lg-block"
            style={{
              // Color will be handled by Navbar variant
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: "300",
              marginLeft: "15%", // This might need to be conditional or adjusted
            }}
          >
            Jim Chen's Blog
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="custom-toggler d-lg-none"
          />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="align-items-center">
              {/* Theme Toggle Button has been removed from here */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <style jsx global>{`
        body {
          transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition */
        }
        .navbar-brand, .nav-link {
            transition: color 0.3s ease; /* Smooth transition for navbar text */
        }
      `}</style>
      <style jsx>{`
        @media (max-width: 991px) {
          .custom-toggler {
            margin-right: 15px;
          }
          /* Adjust Navbar Brand margin for smaller screens if needed */
          .navbar-brand {
            margin-left: 10px !important; 
          }
          .navbar-collapse {
            margin-top: 10px; /* Add some space when collapsed */
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