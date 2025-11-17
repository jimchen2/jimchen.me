import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { getIpAddress } from "@/config/config";

function BlogLikeButton({ blogid, like }) {
  const [likes, setLikes] = useState(like ? like.length : 0);
  const [liked, setLiked] = useState(false);
  const [userIP, setUserIP] = useState("unknown");

  useEffect(() => {
    let totalElapsedTime = 0;
    const maxElapsedTime = 5000; // Give up after 5000ms (5 seconds)
    let delay = 500; // Start with a 500ms delay

    const fetchIP = async () => {
      const ip = await getIpAddress();
      if (ip !== "unknown") {
        setUserIP(ip);
        setLiked(like && like.includes(ip)); // Ensure like is defined
        return true; // IP found, stop polling
      }
      return false; // IP not found, continue polling
    };

    // Immediately attempt to fetch IP without waiting
    fetchIP();

    const intervalId = setInterval(async () => {
      const ipFound = await fetchIP();
      totalElapsedTime += delay;
      if (ipFound || totalElapsedTime >= maxElapsedTime) {
        clearInterval(intervalId); // Stop polling if IP found or max time reached
      } else {
        delay = 1000; // After first check, check every second
      }
    }, delay);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [like]); // Dependency on `like` to re-run effect if it changes

const handleLike = async () => {
  if (userIP === "unknown") {
    console.log("Attempted to like/dislike, but user IP is unknown.");
    return;
  }

  const isLiked = liked; // Current state before toggle
  const newLikes = isLiked ? likes - 1 : likes + 1;
  
  // Optimistic update - update UI immediately
  setLiked(!isLiked);
  setLikes(newLikes);

  const patchUrl = `${process.env.NEXT_PUBLIC_SITE}/api/blogtogglelike?blogid=${encodeURIComponent(blogid)}`;
  try {
    console.log(`Sending PATCH request to: ${patchUrl}`);
    console.log(`Payload: `, { userIP, isLiked });

    const response = await axios.patch(patchUrl, {
      userIP,
      isLiked,
    });

    console.log("PATCH request successful, response:", response.data);
  } catch (error) {
    console.error("Error updating comment like:", error);
    // Revert the optimistic update on error
    setLiked(isLiked);
    setLikes(likes);
  }
};  const baseStyle = {
    fontSize: "0.75rem",
    padding: "2px 6px",
    margin: "5px",
    transition: "background-color 0.3s, color 0.3s",
  };

  const likedButtonStyle = {
    ...baseStyle,
  };

  return (
    <Button style={liked ? likedButtonStyle : baseStyle} onClick={handleLike}>
      {liked ? "Liked" : "Like"} {likes}
    </Button>
  );
}

export default BlogLikeButton;
