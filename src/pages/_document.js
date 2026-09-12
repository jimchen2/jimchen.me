import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* React uses `charSet`; the lowercase attribute logs a warning. */}
          <meta charSet="UTF-8" />
          <meta name="author" content="Jim Chen" />
          <meta name="robots" content="index, follow" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          {/* Only the /about page uses these faces; loading them from <head>
              avoids a render-blocking @import inside the document body. */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
