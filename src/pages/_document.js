import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
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

          {/* Favicon */}
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <meta name="theme-color" content="#000000" />
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
