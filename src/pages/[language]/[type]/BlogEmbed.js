import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import parse from "html-react-parser";
import backendurl from "../config/config";

function SingleBlogEmbed() {
  const [blog, setBlog] = useState(null); // Changed to null initial state
  const { language, type, title } = useParams();

  useEffect(() => {
    // Encode all parameters
    const encodedLanguage = encodeURIComponent(language);
    const encodedType = encodeURIComponent(type);
    const encodedTitle = encodeURIComponent(title);

    Axios.get(`${backendurl}/blog/${encodedLanguage}/${encodedType}/${encodedTitle}`)
      .then((response) => {
        setBlog(response.data);
      })
      .catch((error) => console.error("Error fetching blog data:", error));

    // Set up the print after delay
    const printAfterDelay = setTimeout(() => window.print(), 1500);
    return () => clearTimeout(printAfterDelay);
  }, [language, type, title]);

  // Show loading state while data is being fetched
  if (!blog) {
    return <div>Loading...</div>;
  }

  // Render the blog post once data is available
  return (
    <div>
      <h1>{blog[0].title}</h1>
      <p>{blog[0].date}</p>
      {parse(blog[0].body)}
    </div>
  );
}

export default SingleBlogEmbed;