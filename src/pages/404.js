import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page not found — Jim Chen&apos;s Blog</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center" }}>
        <h1>404</h1>
        <p>That page does not exist. It may have been renamed or removed.</p>
        <p>
          <Link href="/" style={{ color: "blue", textDecoration: "underline" }}>
            Back to all posts
          </Link>
        </p>
      </div>
    </>
  );
}
