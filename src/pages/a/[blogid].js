import dbConnect from "@/db/dbConnect";
import React from "react";
import Head from "next/head";
import SingleBlog from "@/singleblog/singleBlog";
import Msg from "@/comment/leaveamessage";

export default function Blog({ blog, type, error }) {
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  // Create a description from the blog body (first 160 characters)
  const description = blog.body.substring(0, 160).trim() + (blog.body.length > 160 ? "..." : "");

  // Join the type array into a string for keywords (e.g., "tag1, tag2, tag3")
  const typeString = Array.isArray(type) ? type.join(", ") : type || "blog";

  // Define the canonical URL based on the /a/[blogid] route
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE}/a/${blog.blogid}`;

  const displayDate = new Date(blog.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE}/default-blog-image.jpg`} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <div>
        <SingleBlog
          title={blog.title}
          text={blog.body}
          type={typeString} // Pass type as a string
          blogid={blog.blogid}
          date={displayDate}
          wordcount={blog.word_count}
        />
        <Msg blogid={blog.blogid} blogname={blog.title} />
      </div>
    </>
  );
}
Blog.showSidebar = false;

export async function getServerSideProps(context) {
  const { blogid } = context.params;

  try {
    const pool = await dbConnect();

    const query = `
      SELECT blogid, type, title, body, date, word_count
      FROM blogs
      WHERE blogid = $1
    `;
    const result = await pool.query(query, [blogid]);

    if (result.rows.length === 0) {
      return {
        notFound: true,
      };
    }

    // Get the raw blog data from the database
    const blogData = result.rows[0];

    // Create a new object that is JSON serializable
    // by converting the Date object to a string.
    const blog = {
      ...blogData,
      date: blogData.date.toISOString(), // <-- THE FIX
    };

    return {
      props: {
        blog, // Pass the serializable blog object
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
