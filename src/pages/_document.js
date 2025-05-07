import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <title>Jim Chen's Blog</title>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="author" content="Jim Chen" />
          <meta name="robots" content="index, follow" />
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
