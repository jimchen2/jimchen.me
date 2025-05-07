import React from "react";
import axios from "axios";
import Head from "next/head";
import SingleBlog from "@/blogcontent/singleBlog";
import Msg from "@/comment/leaveamessage";

function Blog({ blogs, language, type, error }) {
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!blogs || blogs.length === 0) {
    return <div>Blog not found</div>;
  }

  const blog = blogs[0];
  // Create a description from the blog body (first 160 characters)
  const description = blog.body.substring(0, 160).trim() + (blog.body.length > 160 ? '...' : '');
  
  // Get the canonical URL
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE}/${language}/${type}/${encodeURIComponent(blog.title.replace(/\s+/g, '-').toLowerCase())}`;

  return (
    <>
      <Head>
        <title>{`${blog.title}`}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${type}, ${blog.title}, blog`} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={blog.image || `${process.env.NEXT_PUBLIC_SITE}/default-blog-image.jpg`} />

        <link rel="canonical" href={canonicalUrl} />
      </Head>
      
      <div>
        <SingleBlog 
          title={blog.title} 
          text={blog.body} 
          language={language} 
          type={type} 
          blogid={blog.blogid} 
          date={blog.date} 
          wordcount={blog.word_count} 
        />
        <Msg blogid={blog.blogid} blogname={blog.title} />
      </div>
    </>
  );
}

// Server-side rendering function
export async function getServerSideProps(context) {
  const { language, type, title } = context.params;

  try {
    // Encode all parameters
    const encodedLanguage = encodeURIComponent(language);
    const encodedType = encodeURIComponent(type);
    const encodedTitle = encodeURIComponent(title);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SITE}/api/blog/${encodedLanguage}/${encodedType}/${encodedTitle}`
    );

    return {
      props: {
        blogs: response.data,
        language,
        type,
        error: null,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        blogs: [],
        language,
        type,
        error: "Failed to fetch blog data",
      },
    };
  }
}

export default Blog;
