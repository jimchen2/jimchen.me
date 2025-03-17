import React from "react";
import axios from "axios";
import SingleBlog from "@/blogcontent/SingleBlog";
import Msg from "@/comment/leaveamessage";

function Blog({ blogs, language, type, error }) {
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!blogs || blogs.length === 0) {
    return <div>Blog not found</div>;
  }

  return (
    <div>
      <SingleBlog 
        title={blogs[0].title} 
        text={blogs[0].body} 
        language={language} 
        type={type} 
        bloguuid={blogs[0].uuid} 
        date={blogs[0].date} 
      />
      <Msg bloguuid={blogs[0].uuid} blogname={blogs[0].title} />
    </div>
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
