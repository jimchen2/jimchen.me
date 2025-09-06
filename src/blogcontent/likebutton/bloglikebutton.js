import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { getIpAddress } from "@/lib/config";
import { useTranslation } from "next-i18next"; // 1. Import the hook

function BlogLikeButton({ blogid, like }) {
  const { t } = useTranslation("common"); // 2. Initialize the hook
  const [likes, setLikes] = useState(like ? like.length : 0);
  const [liked, setLiked] = useState(false);
  const [userIP, setUserIP] = useState("unknown");

  useEffect(() => {
    let totalElapsedTime = 0;
    const maxElapsedTime = 5000;
    let delay = 500;

    const fetchIP = async () => {
      const ip = await getIpAddress();
      if (ip !== "unknown") {
        setUserIP(ip);
        setLiked(like && like.includes(ip));
        return true;
      }
      return false;
    };

    fetchIP();

    const intervalId = setInterval(async () => {
      const ipFound = await fetchIP();
      totalElapsedTime += delay;
      if (ipFound || totalElapsedTime >= maxElapsedTime) {
        clearInterval(intervalId);
      } else {
        delay = 1000;
      }
    }, delay);

    return () => clearInterval(intervalId);
  }, [like]);

  const handleLike = async () => {
    if (userIP === "unknown") {
      console.log("Attempted to like/dislike, but user IP is unknown.");
      return;
    }

    const isLiked = liked;
    const newLikes = isLiked ? likes - 1 : likes + 1;
    const patchUrl = `${process.env.NEXT_PUBLIC_SITE}/api/blogtogglelike?blogid=${encodeURIComponent(blogid)}`;
    
    try {
      await axios.patch(patchUrl, {
        userIP,
        isLiked,
      });
      setLiked(!isLiked);
      setLikes(newLikes);
    } catch (error) {
      console.error("Error updating blog like:", error);
    }
  };

  const baseStyle = {
    fontSize: "0.75rem",
    padding: "2px 6px",
    margin: "5px",
    transition: "background-color 0.3s, color 0.3s",
  };

  const likedButtonStyle = { ...baseStyle };

  return (
    <Button style={liked ? likedButtonStyle : baseStyle} onClick={handleLike}>
      {/* 3. Replace hardcoded text with the t() function */}
      {t(liked ? "comment.liked" : "comment.like")} {likes}
    </Button>
  );
}

export default BlogLikeButton;