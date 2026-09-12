import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page not found — Jim Chen&apos;s Blog</title>
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="not-found">
        <h1>Page not found</h1>
        <p>The page you were looking for does not exist, or it moved.</p>
        <p>
          <Link href="/">← Back to the blog</Link>
        </p>
      </div>

      <style jsx>{`
        .not-found {
          max-width: 640px;
          margin: 4rem auto;
          padding: 0 1rem;
          text-align: center;
        }
        .not-found h1 {
          font-size: 1.75rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }
        .not-found p {
          color: #6c757d;
        }
      `}</style>
    </>
  );
}
