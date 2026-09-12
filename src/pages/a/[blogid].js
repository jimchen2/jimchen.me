import React from "react";
import Head from "next/head";
import SingleBlog from "@/singleblog/singleBlog";
import Msg from "@/comment/commentsection";
import { getBlog } from "@/lib/blogStore";
import { stripHtml } from "@/lib/blogFormat";

export default function Blog({ blog, type, error }) {
  if (error) {
    return <div style={{ padding: "3rem 1rem", textAlign: "center" }}>Error: {error}</div>;
  }

  if (!blog) {
    return <div style={{ padding: "3rem 1rem", textAlign: "center" }}>Blog not found</div>;
  }

  // Description from the stored preview text, falling back to the body.
  const rawDescription = blog.preview_text || stripHtml(blog.body);
  const description =
    rawDescription.substring(0, 160).trim() +
    (rawDescription.length > 160 ? "..." : "");

  const typeString = Array.isArray(type) ? type.join(", ") : type || "blog";

  const siteUrl = process.env.NEXT_PUBLIC_SITE || "";
  const canonicalUrl = `${siteUrl}/a/${blog.blogid}`;

  const displayDate = blog.date
    ? new Date(blog.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content={`${typeString}, ${blog.title}, blog`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content={blog.preview_image || `${siteUrl}/image.png`}
        />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <div>
        <SingleBlog
          title={blog.title}
          text={blog.body}
          type={typeString}
          blogid={blog.blogid}
          date={displayDate}
          wordcount={blog.word_count}
        />
        <Msg blogid={blog.blogid} blogname={blog.title} />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { blogid } = context.params;

  try {
    const blogData = await getBlog(blogid);

    if (!blogData) {
      return { notFound: true };
    }

    // JSON-serializable copy of the row (Date -> ISO string).
    const blog = {
      ...blogData,
      date: blogData.date ? new Date(blogData.date).toISOString() : null,
    };
    delete blog.plain_text;
    delete blog.snippet_source;

    context.res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=3600"
    );

    return {
      props: {
        blog,
        type: blog.type,
        error: null,
      },
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return {
      props: {
        blog: null,
        type: null,
        error: "Failed to fetch blog data",
      },
    };
  }
}
