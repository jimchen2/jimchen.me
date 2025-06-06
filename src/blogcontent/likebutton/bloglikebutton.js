import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { getIpAddress, useGlobalColorScheme } from "@/config/global.js";

function BlogLikeButton({ blogid, like }) {
  const { colors } = useGlobalColorScheme();
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

    const isLiked = liked; // If already liked, this will be true, indicating we want to remove the like
    const newLikes = isLiked ? likes - 1 : likes + 1; // Adjust the likes count accordingly
    const patchUrl = `${process.env.NEXT_PUBLIC_SITE}/api/blogtogglelike?blogid=${encodeURIComponent(blogid)}`;
    try {
      console.log(`Sending PATCH request to: ${patchUrl}`);
      console.log(`Payload: `, { userIP, isLiked: !isLiked }); // Note: The logic might be inverted based on the action

      const response = await axios.patch(patchUrl, {
        userIP,
        isLiked, // Invert isLiked since true now indicates removal (dislike)
      });

      console.log("PATCH request successful, response:", response.data);

      setLiked(!isLiked); // Update liked state based on the action performed
      setLikes(newLikes); // Update likes count based on the action
    } catch (error) {
      console.error("Error updating comment like:", error);
    }
  };

  const baseStyle = {
    fontSize: "0.75rem",
    color: colors.color_blue,
    backgroundColor: colors.color_white,
    borderColor: colors.color_blue,
    padding: "2px 6px",
    margin: "5px",
    transition: "background-color 0.3s, color 0.3s",
  };

  const likedButtonStyle = {
    ...baseStyle,
    backgroundColor: colors.color_blue,
    color: colors.color_white,
  };

  return (
    <Button style={liked ? likedButtonStyle : baseStyle} onClick={handleLike}>
      {liked ? "Liked" : "Like"} {likes}
    </Button>
  );
}

export default BlogLikeButton;
