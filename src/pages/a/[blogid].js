import React from "react";
import Head from "next/head";
import Link from "next/link";
import SingleBlog from "@/singleblog/singleBlog";
import CommentSection from "@/comment/commentsection";
import { displayTitle, extractHeadings, formatLongDate, stripHtml } from "@/lib/display";
// Only referenced inside getServerSideProps, so Next keeps this (and `pg`) out
// of the client bundle.
import {
  getBlogByBlogid,
  getAdjacentPosts,
  isDatabaseConfigured,
} from "@/lib/blogRepo";

function siteUrl(req) {
  if (process.env.NEXT_PUBLIC_SITE) return process.env.NEXT_PUBLIC_SITE.replace(/\/$/, "");
  const protocol = req?.headers?.["x-forwarded-proto"] || "http";
  const host = req?.headers?.host || "localhost:3000";
  return `${protocol}://${host}`;
}

export default function Blog({ blog, adjacent, canonicalUrl, usingLocalContent, loadError }) {
  if (!blog) {
    return (
      <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center" }}>
        <h1>{loadError ? "Couldn't load this post" : "Post not found"}</h1>
        {loadError && <p>{loadError}</p>}
        <p>
          <Link href="/" style={{ color: "blue", textDecoration: "underline" }}>
            Back to all posts
          </Link>
        </p>
      </div>
    );
  }

  const title = displayTitle(blog.title);
  const description =
    blog.preview_text || `${stripHtml(blog.body).slice(0, 160).trim()}...`;
  const typeString = Array.isArray(blog.type) ? blog.type.join(", ") : blog.type || "blog";
  const dateLabel = formatLongDate(blog.date);
  const headings = extractHeadings(blog.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: blog.date,
    dateModified: blog.updated_at || blog.date,
    wordCount: blog.word_count,
    keywords: typeString,
    author: { "@type": "Person", name: "Jim Chen" },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content={`${typeString}, ${title}, blog`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {blog.preview_image && <meta property="og:image" content={blog.preview_image} />}
        <meta name="twitter:card" content={blog.preview_image ? "summary_large_image" : "summary"} />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div>
        {usingLocalContent && (
          <p
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              border: "1px solid #dee2e6",
              borderRadius: "6px",
            }}
          >
            Serving sample posts from <code>content/blogs</code> because{" "}
            <code>POSTGRESQL_URL</code> is not set.
          </p>
        )}

        <SingleBlog
          title={blog.title}
          text={blog.body}
          type={typeString}
          blogid={blog.blogid}
          date={dateLabel}
          wordcount={blog.word_count}
          headings={headings}
        />

        {(adjacent?.previous || adjacent?.next) && (
          <nav
            aria-label="More posts"
            style={{
              maxWidth: "700px",
              margin: "2rem auto 3rem",
              padding: "0 1rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "space-between",
              borderTop: "1px solid #dee2e6",
              paddingTop: "1rem",
            }}
          >
            {adjacent.previous ? (
              <Link
                href={`/a/${adjacent.previous.blogid}`}
                style={{ color: "blue", textDecoration: "underline" }}
              >
                ← {displayTitle(adjacent.previous.title)}
              </Link>
            ) : (
              <span />
            )}
            {adjacent.next && (
              <Link
                href={`/a/${adjacent.next.blogid}`}
                style={{ color: "blue", textDecoration: "underline" }}
              >
                {displayTitle(adjacent.next.title)} →
              </Link>
            )}
          </nav>
        )}

        <CommentSection blogid={blog.blogid} blogname={blog.title} />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { blogid } = context.params;

  context.res?.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300",
  );

  try {
    const blog = await getBlogByBlogid(blogid);
    if (!blog) return { notFound: true };

    const adjacent = await getAdjacentPosts(blogid);

    return {
      props: {
        blog,
        adjacent,
        canonicalUrl: `${siteUrl(context.req)}/a/${blogid}`,
        usingLocalContent: !isDatabaseConfigured(),
      },
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return {
      props: {
        blog: null,
        adjacent: null,
        canonicalUrl: `${siteUrl(context.req)}/a/${blogid}`,
        usingLocalContent: !isDatabaseConfigured(),
        loadError: error.message || "Unexpected error while loading the post.",
      },
    };
  }
}
