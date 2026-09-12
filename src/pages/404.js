import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page not found — Jim Chen&apos;s Blog</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div
        style={{
          maxWidth: "560px",
          margin: "4rem auto",
          padding: "0 1rem",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "0.85rem", letterSpacing: "0.1em" }}>404</p>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
          This page does not exist
        </h1>
        <p style={{ marginBottom: "1.5rem", opacity: 0.8 }}>
          The post may have been renamed, or the link is broken. The list of
          everything that does exist is one click away.
        </p>
        <p>
          <Link href="/" style={{ color: "blue", textDecoration: "underline" }}>
            Back to all posts
          </Link>
          {" · "}
          <Link
            href="/about"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            About
          </Link>
        </p>
      </div>
    </>
  );
}
