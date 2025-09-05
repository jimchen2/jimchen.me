import dbConnect from "@/lib/db/dbConnect";
import React from "react";
import Head from "next/head";
import SingleBlog from "@/blogcontent/singleBlog";
import Msg from "@/comment/leaveamessage";

export default function Blog({ blog, tags, error }) {
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  // Create a description from the blog body (first 160 characters)
  const description = blog.body.substring(0, 160).trim() + (blog.body.length > 160 ? "..." : "");

  // Join the `tags` array into a string for keywords.
  const tagsString = Array.isArray(tags) && tags.length > 0 ? tags.join(", ") : "blog";

  // Define the canonical URL based on the /a/[blogid] route
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE}/a/${blog.blogid}`;

  const displayDate = new Date(blog.date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${tagsString}, ${blog.title}, blog`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={blog.preview_image || `${process.env.NEXT_PUBLIC_SITE}/default-blog-image.jpg`} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <div>
        <SingleBlog
          title={blog.title}
          text={blog.body}
          type={tagsString}
          blogid={blog.blogid}
          date={displayDate}
          wordcount={blog.word_count}
        />
        <Msg blogid={blog.blogid} blogname={blog.title} />
      </div>
    </>
  );
}

// ===================================================================
// UPDATED getServerSideProps to handle language switching
// ===================================================================

export async function getServerSideProps(context) {
  const { blogid } = context.params;
  const { req } = context;

  try {
    // 1. Get the language from the cookie set by LanguageComponent
    const lang = req.cookies.language;

    // 2. Determine the correct table name based on the language
    // SECURITY: Whitelist languages to prevent SQL injection. Never inject user input directly.
    const allowedLangs = ["zh", "en", "ru"];
    let tableName = "blogs"; // Default to the original 'blogs' table

    if (lang && allowedLangs.includes(lang)) {
      tableName = `blogs_${lang}`;
    }

    // Connect to the database
    const pool = await dbConnect();

    // 3. Use the dynamic tableName in the query
    // Note: Table names cannot be parameterized with '$1', so we use the sanitized `tableName` variable.
    const query = `
      SELECT blogid, tags, title, body, date, word_count, preview_image, preview_text
      FROM ${tableName}
      WHERE blogid = $1
    `;
    const result = await pool.query(query, [blogid]);

    // If no blog is found in the selected language table, return 404
    if (result.rows.length === 0) {
      return {
        notFound: true,
      };
    }

    const blogData = result.rows[0];

    // Format the data for the component props
    const blog = {
      ...blogData,
      date: blogData.date.toISOString(), // Serialize date for Next.js
    };

    return {
      props: {
        blog,
        tags: blog.tags, // Pass the tags array
        error: null,
      },
    };
  } catch (error) {
    console.error(`Error fetching blog data for blogid ${blogid}:`, error);
    return {
      props: {
        blog: null,
        tags: null,
        error: "Failed to fetch blog data. Please try again later.",
      },
    };
  }
}