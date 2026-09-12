import Head from "next/head";
import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/global.css";

import MainLayout from "@/layout/MainLayout";
import { ColorSchemeProvider } from "@/layout/theme";

/** Main App Component */
function MyApp({ Component, pageProps }) {
  return (
    <ColorSchemeProvider>
      <Head>
        <title>Jim Chen&apos;s Blog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f8f9fa" />
      </Head>

      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ColorSchemeProvider>
  );
}

export default MyApp;
