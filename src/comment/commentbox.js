import React, { useState, useEffect } from "react";
import { Button, Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { useComments } from "./commentscontext";
import { getIpAddress } from "@/lib/config.js";

// --- Helper Function (No Translation Needed) ---
async function SubmitComment({ parentid, username, message, blogid, blogname }) {
  const name = username || "anonymous";
  const uuid = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");

  try {
    const commentResponse = await axios.post("/api/comment", {
      user: name,
      text: message,
      blog: blogid,
      uuid: uuid,
      blogname: blogname,
      parentid: parentid !== "-1" ? parentid : null,
    });

    console.log("Comment created:", commentResponse.data);
    return commentResponse.data;
  } catch (error) {
    console.error("Error submitting comment:", error);
    return null;
  }
}

// --- Translated Child Component: Like Button ---
function CommentLikeButton({ commentuuid, like }) {
  const { t } = useTranslation("common");
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

    const intervalId = setInterval(async () => {
      if ((await checkIP()) || totalElapsedTime >= maxElapsedTime) {
        clearInterval(intervalId);
      } else {
        totalElapsedTime += delay;
        delay = 1000;
      }
    }, delay);

    checkIP();

    return () => clearInterval(intervalId);
  }, [like]);

  const handleLike = async () => {
    if (userIP === "unknown") return;

    const isLiked = !liked;
    const newLikes = isLiked ? likes + 1 : likes - 1;
    setLiked(isLiked);
    setLikes(newLikes);

    try {
      await axios.patch(`/api/commenttogglelike?commentuuid=${commentuuid}`, { userIP, isLiked });
    } catch (error) {
      console.error("Error updating comment like:", error);
      setLiked(!isLiked);
      setLikes(isLiked ? newLikes - 1 : newLikes + 1);
    }
  };

  const baseStyle = { fontSize: "0.75rem", padding: "2px 6px", margin: "5px", transition: "background-color 0.3s, color 0.3s" };
  const likedButtonStyle = { ...baseStyle };

  return (
    <Button style={liked ? likedButtonStyle : baseStyle} onClick={handleLike}>
      {t(liked ? "comment.liked" : "comment.like")} {likes}
    </Button>
  );
}

// --- Translated Child Component: Reply Button ---
function CommentReplyButton({ onReplyClick }) {
  const { t } = useTranslation("common");
  const buttonStyle = { fontSize: "0.75rem", padding: "2px 6px", margin: "5px", transition: "background-color 0.3s" };

  return (
    <Button style={buttonStyle} onClick={onReplyClick}>
      {t("comment.reply")}
    </Button>
  );
}

// --- Translated Child Component: Input Box ---
function CommentInputBox({ commentuuid, blogid, blogname }) {
  const { t } = useTranslation('common');
  const { triggerUpdate } = useComments();

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [focusStyleUsername, setFocusStyleUsername] = useState({});
  const [focusStyleMessage, setFocusStyleMessage] = useState({});

  const handleBlur = (setFocusStyle) => setFocusStyle({});

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    try {
      await SubmitComment({ parentid: commentuuid, username, message, blogid, blogname });
      setUsername("");
      setMessage("");
      triggerUpdate();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const submitButtonStyle = { fontSize: "1rem", padding: "3px 9px", transition: "background-color 0.3s" };
  const usernameInputStyle = { ...focusStyleUsername };
  const messageInputStyle = { ...focusStyleMessage };

  return (
    <div style={{ marginTop: "1rem" }}>
      <Card>
        <Card.Body>
          <div style={{ fontFamily: "'Roboto', sans-serif" }}>
            <Form onSubmit={handleSubmitReply}>
              <Form.Group className="mb-3">
                <Form.Label>{t('commentBox.nameLabel')}</Form.Label>
                <Form.Control
                  className="custom-placeholder"
                  style={usernameInputStyle}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('commentBox.namePlaceholder')}
                  onBlur={() => handleBlur(setFocusStyleUsername)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t('commentBox.messageLabel')}</Form.Label>
                <Form.Control
                  className="custom-placeholder"
                  style={messageInputStyle}
                  as="textarea"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('commentBox.messagePlaceholder')}
                  required
                  onBlur={() => handleBlur(setFocusStyleMessage)}
                />
              </Form.Group>
              <Button variant="outline-primary" style={submitButtonStyle} type="submit">
                {t('commentBox.submitButton')}
              </Button>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

// --- Main Exported Component ---
function CommentBox({ embed = 0, user, date, blogname, comment, like, commentuuid, blogid, showName }) {
  const [showReply, setShowReply] = useState(false);

  const MAX_EMBED = 2;
  const ADJUST_FACTOR = 40;
  const BASE_FONT_SIZE = 16;
  const TITLE_FONT_SIZE = 14;
  const SUBTITLE_FONT_SIZE = 14;

  const adjustedEmbed = embed > MAX_EMBED ? MAX_EMBED - 1 : embed - 1;
  const cardStyle = { marginLeft: `${adjustedEmbed * ADJUST_FACTOR}px`, fontSize: `${BASE_FONT_SIZE}px` };
  const headerStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" };
  const titleStyle = { marginBottom: 0, fontSize: `${TITLE_FONT_SIZE}px` };
  const subtitleStyle = { fontSize: `${SUBTITLE_FONT_SIZE}px` };
  const cardTextStyle = { whiteSpace: "pre-wrap" };
  const buttonContainerStyle = { display: "flex", alignItems: "center" };

  const toggleReply = () => setShowReply(!showReply);

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
          <CommentReplyButton onReplyClick={toggleReply} />
        </div>
        {showReply && <CommentInputBox commentuuid={commentuuid} blogid={blogid} blogname={blogname} />}
      </Card.Body>
    </Card>
  );
}

export default CommentBox;