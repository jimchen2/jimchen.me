import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ColorSchemeProvider, useGlobalColorScheme } from "../config/global.js";
import NavBar from "../static/navbar.js";
import Footer from "../static/footer";
import axios from "axios";
import { setIpAddress } from "../config/global.js";

function MyApp({ Component, pageProps, router }) {
  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        const userResponse = await axios.get("https://ipapi.co/json");
        if (userResponse?.data?.ip) {
          setIpAddress(userResponse.data.ip);
        }
      } catch (error) {}
    };

    fetchIpInfo();
  }, []);

  const isEmbedPage = router.pathname.startsWith("/embed");

  return (
    <ColorSchemeProvider>
      <AppContent Component={Component} pageProps={pageProps} isEmbedPage={isEmbedPage} />
    </ColorSchemeProvider>
  );
}

function AppContent({ Component, pageProps, isEmbedPage }) {
  const { colors } = useGlobalColorScheme();

  const appStyle = {
    color: colors.color_black,
    backgroundColor: colors.color_white,
  };

  useEffect(() => {
    document.body.style.backgroundColor = colors.color_white;
  }, [colors.color_white]);

  return (
    <div style={appStyle}>
      {!isEmbedPage && <NavBar />}
      <Component {...pageProps} />
      {!isEmbedPage && <Footer />}
    </div>
  );
}

export default MyApp;
