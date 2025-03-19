import React, { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import SubmitComment from "./submitcomment";
import { useGlobalColorScheme } from "@/config/global";
import { useComments } from "../commentscontext";

function CommentInputBox({ commentuuid, bloguuid, blogname }) {
  const { triggerUpdate } = useComments();

  const { colors } = useGlobalColorScheme();

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const [focusStyleUsername, setFocusStyleUsername] = useState({});
  const [focusStyleMessage, setFocusStyleMessage] = useState({});

  const handleFocus = (setFocusStyle) => {
    setFocusStyle({
      borderColor: colors.color_blue,
      boxShadow: `0 0 0 0.2rem rgba(${parseInt(colors.color_blue.slice(1, 3), 16)}, ${parseInt(colors.color_blue.slice(3, 5), 16)}, ${parseInt(colors.color_blue.slice(5, 7), 16)}, 0.25)`,
    });
  };

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
        bloguuid: bloguuid,
        blogname: blogname,
      });
      // Reset the values after submit
      setUsername("");
      setMessage("");
      triggerUpdate();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const submitButtonStyle = {
    fontSize: "1rem",
    color: colors.color_blue,
    backgroundColor: colors.color_white,
    borderColor: colors.color_blue,
    padding: "3px 9px",
    transition: "background-color 0.3s",
  };

  // Separate styles for each input
  const usernameInputStyle = {
    ...focusStyleUsername,
    backgroundColor: colors.color_white,
    color: colors.color_black,
  };

  const messageInputStyle = {
    ...focusStyleMessage,
    backgroundColor: colors.color_white,
    color: colors.color_black,
  };

  const cardStyle = {
    backgroundColor: colors.color_white, // If your card background needs to be white
    borderColor: colors.color_black, // If you need a blue border for the card
    color: colors.color_black, // Text color for content in the card
  };

  return (
    <div style={{ marginTop: "0" }}>
      <style type="text/css">
        {`
          .custom-placeholder::placeholder {
            color: ${colors.color_black}; // Placeholder color
          }
          .btn-outline-primary {
            color: ${colors.color_blue};
            border-color: ${colors.color_blue};
          }
          .btn-outline-primary:hover {
            background-color: ${colors.color_blue};
            color: ${colors.color_white};
          }
        `}
      </style>
      <Card style={cardStyle}>
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
                  onFocus={() => handleFocus(setFocusStyleUsername)}
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
                  autoFocus={bloguuid === "00000000"}
                  onFocus={() => handleFocus(setFocusStyleMessage)}
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
