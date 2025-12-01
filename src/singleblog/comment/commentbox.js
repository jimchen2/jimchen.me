import React, { useState, useEffect } from "react";
import Commentinputbox from "./commentsubmit.js";
import { getIpAddress } from "@/layout/theme.js";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link.js";
import { Button } from "react-bootstrap";
import axios from "axios"; // Added missing import for the API call

function CommentLikeButton({ commentuuid, like }) {
  const [likes, setLikes] = useState(like.length);
  const [liked, setLiked] = useState(false);
  const [userIP, setUserIP] = useState("unknown");

  useEffect(() => {
    let totalElapsedTime = 0;
    const maxElapsedTime = 5000;
    let delay = 500;

    const checkIP = async () => {
      const ip = await getIpAddress();
      if (ip && ip !== "unknown") {
        setUserIP(ip);
        setLiked(like.includes(ip));
        return true;
      }
      return false;
    };

    checkIP(); // Immediately attempt to check IP

    const intervalId = setInterval(async () => {
      if ((await checkIP()) || totalElapsedTime >= maxElapsedTime) {
        clearInterval(intervalId);
      } else {
        totalElapsedTime += delay;
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

    const isLiked = liked; // Current state before toggle
    const newLikes = isLiked ? likes - 1 : likes + 1;

    // Optimistic update - update UI immediately
    setLiked(!isLiked);
    setLikes(newLikes);

    try {
      await axios.patch(`/api/commenttogglelike?commentuuid=${commentuuid}`, {
        userIP,
        isLiked,
      });
    } catch (error) {
      console.error("Error updating comment like:", error);
      // Revert the optimistic update on error
      setLiked(isLiked);
      setLikes(likes);
    }
  };

  const baseStyle = {
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
function CommentReplyButton({ onReplyClick }) {
  const buttonStyle = {
    fontSize: "0.75rem",
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
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  };

  const titleStyle = {
    marginBottom: 0,
    fontSize: `${TITLE_FONT_SIZE}px`,
  };

  const subtitleStyle = {
    fontSize: `${SUBTITLE_FONT_SIZE}px`,
  };

  const cardTextStyle = {
    whiteSpace: "pre-wrap",
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
        {showName && <Link href={`/a/${blogid}`}>{blogname}</Link>}
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
