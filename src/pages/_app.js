// /pages/_app.js

"use client";

import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Navbar } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ColorSchemeProvider, useGlobalColorScheme, setIpAddress } from "../lib/config.js";

// --- Imports for i18n ---
import { useTranslation } from "next-i18next";
import { appWithTranslation } from "next-i18next";

// --- NEW: Import useRouter for language redirection ---
import { useRouter } from "next/router";

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

// --- Combined Layout Component (Unchanged) ---
function Layout({ children }) {
  const { themeMode } = useGlobalColorScheme();
  const { t } = useTranslation("common");

  const layoutStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  };

  const mainContentStyle = {
    flex: "1",
    paddingTop: "70px",
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
            {t("blog-title")}
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Global styles remain the same */}
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
          padding-top: 70px;
          margin-top: -70px;
          scroll-margin-top: 70px;
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

      <main style={mainContentStyle}>{children}</main>
    </div>
  );
}

// --- Main App Component ---
function MyApp({ Component, pageProps }) {
  const { t } = useTranslation("common");
  // --- NEW: Get router details for language logic ---
  const router = useRouter();
  const { locale, locales, pathname, asPath, query } = router;

  // --- NEW: useEffect for Automatic Language Redirection ---
  // This is the "brain" that makes the language choice persistent.
  useEffect(() => {
    const savedLocale = localStorage.getItem("user_preferred_locale");

    // 1. Check if a preference is saved in localStorage.
    // 2. Check if that preference is a valid, supported locale.
    // 3. Check that we are not already on the preferred locale (to prevent a redirect loop).
    if (
      savedLocale &&
      locales.includes(savedLocale) &&
      locale !== savedLocale &&
      pathname === "/" // <-- ADD THIS LINE
    ) {
      // If all conditions are met, redirect to the same page but with the preferred locale.
      router.push({ pathname, query }, asPath, { locale: savedLocale });
    }
  }, [locale, locales, pathname, asPath, query, router]); // Dependencies ensure this runs on page change

  // This useEffect for fetching IP remains unchanged.
  useEffect(() => {
    fetchIpInfo();
  }, []);

  return (
    <ColorSchemeProvider>
      <Head>
        <title>{t("blog-title")}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ColorSchemeProvider>
  );
}

// --- Final export remains wrapped with appWithTranslation ---
export default appWithTranslation(MyApp);
