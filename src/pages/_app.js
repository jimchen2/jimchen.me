import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ColorSchemeProvider, useGlobalColorScheme } from "../config/global.js";
import NavBar from "../navbar/navbar.js";
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
      <AppContent Component={Component} pageProps={pageProps} isEmbedPage={isEmbedPage} />
    </ColorSchemeProvider>
  );
}

export default MyApp;
