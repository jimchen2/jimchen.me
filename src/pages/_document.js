import Document, { Html, Head, Main, NextScript } from "next/document";

const themeInitScript = `
(function () {
  try {
    var match = document.cookie.match(/(?:^|; )themeMode=([^;]+)/);
    var mode = match ? decodeURIComponent(match[1]) : "light";
    if (mode !== "dark" && mode !== "light") mode = "light";
    document.documentElement.setAttribute("data-theme", mode);
  } catch (e) {}
})();
`;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="author" content="Jim Chen" />
          <meta name="robots" content="index, follow" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          {/* KaTeX stylesheet is bundled from node_modules in _app.js so the
              version always matches the renderer; no third-party CSS here. */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="preconnect"
            href="https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          />
          {/* Apply the saved theme before first paint (no dark-mode flash). */}
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
