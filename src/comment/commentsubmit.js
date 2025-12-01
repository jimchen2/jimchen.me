import React, { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { useComments } from "./commentscontext";
import axios from "axios";

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
      parentid: parentid !== "-1" ? parentid : null, // Include parentid in the initial POST
    });

    console.log("Comment created:", commentResponse.data);
    return commentResponse.data;
  } catch (error) {
    console.error("Error submitting comment:", error);
    return null;
  }
}

function CommentInputBox({ commentuuid, blogid, blogname }) {
  console.log("OIDJFPOIDJF", blogname);
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

  // Separate styles for each input
  const usernameInputStyle = {
    ...focusStyleUsername,
  };

  const messageInputStyle = {
    ...focusStyleMessage,
  };

  return (
    <div style={{ marginTop: "0" }}>
      <Card>
        <Card.Body>
          <div style={{ fontFamily: "'Roboto', sans-serif" }}>
            <Form onSubmit={handleSubmitReply}>
              <Form.Group className="mb-3">
                <Form.Label>Name (Optional)</Form.Label>
                <Form.Control
                  className="custom-placeholder"
                  style={usernameInputStyle}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Guest"
                  onBlur={() => handleBlur(setFocusStyleUsername)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  className="custom-placeholder"
                  style={messageInputStyle}
                  as="textarea"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Input your message here"
                  required
                  onBlur={() => handleBlur(setFocusStyleMessage)}
                />
              </Form.Group>
              <Button variant="outline-primary" style={submitButtonStyle} type="submit">
                Comment
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
