import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Axios from "axios";
import SingleBlog from "@/blogcontent/SingleBlog";
import Msg from "@/comment/leaveamessage";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  const { language, type, title } = router.query;

  useEffect(() => {
    // Encode all parameters
    const encodedLanguage = encodeURIComponent(language);
    const encodedType = encodeURIComponent(type);
    const encodedTitle = encodeURIComponent(title);

    Axios.get(`/api/blog/${encodedLanguage}/${encodedType}/${encodedTitle}`)
      .then((response) => {
        setBlogs(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [language, type, title]);

  if (blogs.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SingleBlog title={blogs[0].title} text={blogs[0].body} language={language} type={type} bloguuid={blogs[0].uuid} date={blogs[0].date} />
      {<Msg bloguuid={blogs[0].uuid} blogname={blogs[0].title} />}
    </div>
  );
}

export default Blog;