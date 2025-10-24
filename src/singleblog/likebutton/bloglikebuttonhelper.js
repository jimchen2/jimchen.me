import React, { useState, useEffect } from "react";
import axios from "axios";
import BlogLikeButton from "./bloglikebutton";
const BlogLikeButtonHelper = ({ blogid }) => {

  const [likes, setLikes] = useState([]); // Renamed data to likes for clarity
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SITE}/api/bloggetlikes?blogid=${blogid}&isarray=true`
        );
        setLikes(response.data.likes); // Assuming the server responds with a property named likes
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLikes();
  }, [blogid]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data!</p>;
  return <BlogLikeButton blogid={blogid} like={likes} />;
};

export default BlogLikeButtonHelper;
