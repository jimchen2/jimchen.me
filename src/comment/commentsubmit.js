import React, { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { useComments } from "./commentscontext";
import axios from "axios";
import { useTranslation } from 'next-i18next'; // 1. Import the hook

// This function doesn't need translation as it's pure logic
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


function CommentInputBox({ commentuuid, blogid, blogname }) {
  const { t } = useTranslation('common'); // 2. Initialize the hook
  const { triggerUpdate } = useComments();

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const [focusStyleUsername, setFocusStyleUsername] = useState({});
  const [focusStyleMessage, setFocusStyleMessage] = useState({});

  const handleBlur = (setFocusStyle) => {
    setFocusStyle({});
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    try {
      await SubmitComment({
        parentid: commentuuid,
        username: username,
        message: message,
        blogid: blogid,
        blogname: blogname,
      });

      setUsername("");
      setMessage("");
      triggerUpdate();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const submitButtonStyle = {
    fontSize: "1rem",
    padding: "3px 9px",
    transition: "background-color 0.3s",
  };

  const usernameInputStyle = { ...focusStyleUsername };
  const messageInputStyle = { ...focusStyleMessage };

  return (
    <div style={{ marginTop: "0" }}>
      <Card>
        <Card.Body>
          <div style={{ fontFamily: "'Roboto', sans-serif" }}>
            <Form onSubmit={handleSubmitReply}>
              <Form.Group className="mb-3">
                {/* 3. Replace hardcoded text with t() function */}
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
                {/* 3. Replace hardcoded text with t() function */}
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
                {/* 3. Replace hardcoded text with t() function */}
                {t('commentBox.submitButton')}
              </Button>
            </Form>
          </div>
        </Card.Body>
      </Card>
      <br />
      <br />
    </div>
  );
}

export default CommentInputBox;