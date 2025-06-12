import React, { useState, useEffect } from "react";
import Commentinputbox from "./commentsubmit.js";
import { useGlobalColorScheme, getIpAddress } from "../config/global.js";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link.js";
import { Button } from "react-bootstrap";
import axios from "axios"; // Added missing import for the API call

function CommentLikeButton({ commentuuid, like }) {
  const { colors } = useGlobalColorScheme();
  const [likes, setLikes] = useState(like.length);
  const [liked, setLiked] = useState(false);
  const [userIP, setUserIP] = useState("unknown");

  useEffect(() => {
    // This effect to get the user's IP address and check if they've already liked the comment
    // remains the same, as its logic is self-contained.
    let totalElapsedTime = 0;
    const maxElapsedTime = 5000; // Give up after 5000ms (5 seconds)
    let delay = 500; // Start with a 500ms delay

    const checkIP = async () => {
      const ip = await getIpAddress(); // Assuming getIpAddress is async
      if (ip && ip !== "unknown") {
        setUserIP(ip);
        setLiked(like.includes(ip));
        return true; // IP found, stop polling
      }
      return false; // IP not found, continue polling
    };

    const intervalId = setInterval(async () => {
      if ((await checkIP()) || totalElapsedTime >= maxElapsedTime) {
        clearInterval(intervalId); // Stop polling if IP found or max time reached
      } else {
        totalElapsedTime += delay;
        delay = 1000; // After first check, check every second
      }
    }, delay);

    // Immediately attempt to check IP without waiting
    checkIP();

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [like]);

  const handleLike = async () => {
    if (userIP === "unknown") return; // Prevent action if IP is unknown

    // Optimistically update the UI
    const isLiked = !liked;
    const newLikes = isLiked ? likes + 1 : likes - 1;
    setLiked(isLiked);
    setLikes(newLikes);

    try {
      // Send the update to the server
      await axios.patch(`/api/commenttogglelike?commentuuid=${commentuuid}`, {
        userIP,
        isLiked,
      });
    } catch (error) {
      console.error("Error updating comment like:", error);
      // Revert UI on error
      setLiked(!isLiked);
      setLikes(isLiked ? newLikes - 1 : newLikes + 1);
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

// --- CHANGE 1: SIMPLIFIED THIS COMPONENT ---
// This component's only job is to be a button.
// The logic to show/hide the reply box is handled by its parent (`CommentBox`).
// This removes redundant state and logic.
function CommentReplyButton({ onReplyClick }) {
  const { colors } = useGlobalColorScheme();

  const buttonStyle = {
    fontSize: "0.75rem",
    color: colors.color_blue,
    backgroundColor: colors.color_white,
    borderColor: colors.color_blue,
    padding: "2px 6px",
    margin: "5px",
    transition: "background-color 0.3s",
  };

  return (
    <Button style={buttonStyle} onClick={onReplyClick}>
      Reply
    </Button>
  );
}

function CommentBox({ embed = 0, user, date, blogname, comment, like, commentuuid, blogid, showName }) {
  const { colors } = useGlobalColorScheme();
  const [showReply, setShowReply] = useState(false);

  const MAX_EMBED = 2;
  const ADJUST_FACTOR = 40;
  const BASE_FONT_SIZE = 16;
  const TITLE_FONT_SIZE = 14;
  const SUBTITLE_FONT_SIZE = 14;

  // Adjusted embed calculation remains the same
  const adjustedEmbed = embed > MAX_EMBED ? MAX_EMBED - 1 : embed - 1;

  const cardStyle = {
    marginLeft: `${adjustedEmbed * ADJUST_FACTOR}px`,
    fontSize: `${BASE_FONT_SIZE}px`,
    backgroundColor: colors.color_white,
    color: colors.color_black,
    borderColor: colors.color_black,
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    backgroundColor: colors.color_white,
    color: colors.color_black,
  };

  const titleStyle = {
    marginBottom: 0,
    fontSize: `${TITLE_FONT_SIZE}px`,
  };

  const subtitleStyle = {
    fontSize: `${SUBTITLE_FONT_SIZE}px`,
    color: colors.color_black,
  };

  const cardTextStyle = {
    whiteSpace: "pre-wrap",
    color: colors.color_black,
  };

  const buttonContainerStyle = {
    display: "flex",
    alignItems: "center",
  };

  const toggleReply = () => {
    setShowReply(!showReply);
  };

  return (
    <Card className="mb-3" style={cardStyle}>
      <Card.Header style={headerStyle}>
        <Card.Title style={titleStyle}>{user}</Card.Title>
        {showName && (
          <Link style={{ color: colors.color_blue }} href={`/a/${blogid}`}>
            {blogname}
          </Link>
        )}
        <Card.Subtitle style={subtitleStyle}>
          <span>{date}</span>
        </Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <Card.Text style={cardTextStyle}>{comment}</Card.Text>
        <div style={buttonContainerStyle}>
          <CommentLikeButton like={like} commentuuid={commentuuid} />
          {/* --- CHANGE 2: UPDATED COMPONENT USAGE --- */}
          {/* Now calling the simplified button. It only needs the click handler. */}
          <CommentReplyButton onReplyClick={toggleReply} />
        </div>
        {/* This logic is correct. It shows the input box only when a user clicks reply. */}
        {/* It correctly passes the `commentuuid` of this comment to the input box. */}
        {showReply && <Commentinputbox commentuuid={commentuuid} blogid={blogid} />}
      </Card.Body>
    </Card>
  );
}

export default CommentBox;