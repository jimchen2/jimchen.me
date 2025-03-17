import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Axios from "axios";
import SingleBlog from "@/blogcontent/SingleBlog";
import Msg from "@/comment/leaveamessage";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const { language, type, title } = router.query;

  useEffect(() => {
    if (!language || !type || !title) {
      return;
    }

    // Encode all parameters
    const encodedLanguage = encodeURIComponent(language);
    const encodedType = encodeURIComponent(type);
    const encodedTitle = encodeURIComponent(title);

    setLoading(true);
    Axios.get(`/api/blog/${encodedLanguage}/${encodedType}/${encodedTitle}`)
      .then((response) => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch blog data");
        setLoading(false);
      });
  }, [language, type, title]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (blogs.length === 0) {
    return <div>Blog not found</div>;
  }

  return (
    <div>
      <SingleBlog title={blogs[0].title} text={blogs[0].body} language={language} type={type} bloguuid={blogs[0].uuid} date={blogs[0].date} />
      <Msg bloguuid={blogs[0].uuid} blogname={blogs[0].title} />
    </div>
  );
}

export default Blog;
