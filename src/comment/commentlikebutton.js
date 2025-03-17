import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { getIpAddress } from "../config/global.js";
import { useGlobalColorScheme } from "../config/global.js";

function CommentLikeButton({ commentuuid, like }) {
  const { colors } = useGlobalColorScheme();
  const [likes, setLikes] = useState(like.length);
  const [liked, setLiked] = useState(false);
  const [userIP, setUserIP] = useState('unknown');

  useEffect(() => {
    let totalElapsedTime = 0;
    const maxElapsedTime = 5000; // Give up after 5000ms (5 seconds)
    let delay = 500; // Start with a 500ms delay

    const checkIP = async () => {
      const ip = getIpAddress();
      if (ip !== 'unknown') {
        setUserIP(ip);
        setLiked(like.includes(ip));
        return true; // IP found, stop polling
      }
      return false; // IP not found, continue polling
    };

    // Immediately attempt to check IP without waiting
    checkIP();

    const intervalId = setInterval(async () => {
      if (await checkIP() || totalElapsedTime >= maxElapsedTime) {
        clearInterval(intervalId); // Stop polling if IP found or max time reached
      } else {
        totalElapsedTime += delay;
        delay = 1000; // After first check, check every second
      }
    }, delay);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [like]);

  const handleLike = async () => {
    if (userIP === "unknown") return; // Prevent action if IP is unknown

    const isLiked = !liked;
    const newLikes = isLiked ? likes + 1 : likes - 1;

    setLiked(isLiked);
    setLikes(newLikes);


    try {
      await axios.patch(`/api/commenttogglelike?commentuuid=${commentuuid}`, {
        userIP,
        isLiked,
      });
    } catch (error) {
      console.error("Error updating comment like:", error);
    }
  };

  const baseStyle = {
    fontSize: "0.75rem",
    color: colors.color_blue_2,
    backgroundColor: colors.color_white,
    borderColor: colors.color_blue_2,
    padding: "2px 6px",
    margin: "5px",
    transition: "background-color 0.3s, color 0.3s",
  };

  const likedButtonStyle = {
    ...baseStyle,
    backgroundColor: colors.color_blue_2,
    color: colors.color_white,
  };

  return (
    <Button style={liked ? likedButtonStyle : baseStyle} onClick={handleLike}>
      {liked ? "Liked" : "Like"} {likes}
    </Button>
  );
}

export default CommentLikeButton;