"use client";

import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Navbar } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ColorSchemeProvider,
  useGlobalColorScheme,
  setIpAddress,
} from "../lib/config.js";
// --> 1. Add these imports for i18n
import { useTranslation } from 'next-i18next';
import { appWithTranslation } from 'next-i18next';

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
  const { themeMode } = useGlobalColorScheme();
  // --> 2. Use the translation hook
  const { t } = useTranslation('common');

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
            {/* --> 3. Replace the static text with the t() function */}
            {t('blog-title')}
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Global styles remain the same */}
      <style jsx global>{`
        body {
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .navbar-brand, .nav-link {
          transition: color 0.3s ease;
        }
        section[id], div[id] {
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

      <main style={mainContentStyle}>
        {children}
      </main>
    </div>
  );
}

// --- Main App Component ---
function MyApp({ Component, pageProps }) {
  // --> 4. Use the translation hook here as well for the <Head> component
  const { t } = useTranslation('common');

  useEffect(() => {
    fetchIpInfo();
  }, []);

  return (
    <ColorSchemeProvider>
      <Head>
        <title>{t('blog-title')}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ColorSchemeProvider>
  );
}

// --> 6. Make sure your final export is wrapped with appWithTranslation
export default appWithTranslation(MyApp);