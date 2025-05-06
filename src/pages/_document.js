import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
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
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <meta name="theme-color" content="#000000" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Georgia&family=Open+Sans:ital@0;1&family=Roboto+Mono&family=Roboto:wght@400;500&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,500;1,400&family=Quicksand:wght@400;500&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css" />
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
