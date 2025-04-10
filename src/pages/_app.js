import React, { useEffect } from "react";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import { ColorSchemeProvider, useGlobalColorScheme } from "../config/global.js";
import NavBar from "../static/navbar.js";
import Footer from "../static/footer";
import axios from "axios";
import { setIpAddress } from "../config/global.js";
function AppContent({ Component, pageProps, isEmbedPage }) {
  const { colors } = useGlobalColorScheme();

  const appStyle = {
    color: colors.color_black,
    backgroundColor: colors.color_white,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh", // This ensures the container takes at least the full viewport height
  };

  const mainContentStyle = {
    flex: "1", // This makes the content area expand to fill available space
  };

  useEffect(() => {
    document.body.style.backgroundColor = colors.color_white;
  }, [colors.color_white]);

  return (
    <div style={appStyle}>
      {!isEmbedPage && <NavBar />}
      <main style={mainContentStyle}>
        <Component {...pageProps} />
      </main>
      {!isEmbedPage && <Footer />}
    </div>
  );
}

// Separate function to fetch IP asynchronously
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

function MyApp({ Component, pageProps, router }) {
  useEffect(() => {
    fetchIpInfo();
  }, []);

  const isEmbedPage = router.pathname.startsWith("/embed");

  return (
    <ColorSchemeProvider>
      <Head>
        <title>Jim Chen's Blog</title>
        <meta name="description" content="Daily Journals and Tech Notes" />
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="Jim Chen, blog, daily journals, tech notes" />
        <meta name="author" content="Jim Chen" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Jim Chen's Blog" />
        <meta property="og:description" content="Daily Journals and Tech Notes" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jimchen.me" />
        <meta property="og:image" content="https://jimchen.me/og-image.jpg" />
        <meta name="yandex-verification" content="f8271f9a26d335e8" />
        <meta name="google-site-verification" content="qPhK3i_YnrDKpavnD90hQjDbS4u1QhqWDuTamAa8RDk" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <AppContent Component={Component} pageProps={pageProps} isEmbedPage={isEmbedPage} />
    </ColorSchemeProvider>
  );
}

export default MyApp;
