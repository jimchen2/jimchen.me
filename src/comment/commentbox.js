import React, { useState, createContext, useContext } from "react";
import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";

// --- Context for triggering comment list updates ---
const CommentsContext = createContext();
export const useComments = () => useContext(CommentsContext);

export const CommentsProvider = ({ children }) => {
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const triggerUpdate = () => setUpdateTrigger(Date.now());
  return (
    <CommentsContext.Provider value={{ updateTrigger, triggerUpdate }}>
      {children}
    </CommentsContext.Provider>
  );
};

// --- Comment Input Box Component ---
/** 32-hex-char client-side id, matching the server's uuid format check. */
function makeUuid() {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function CommentInputBox({ commentuuid, blogid }) {
  const { triggerUpdate } = useComments();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!message.trim() || submitting) return; // Prevent empty comments

    setSubmitting(true);
    setSubmitError(null);

    try {
      await axios.post("/api/comment", {
        user: username || "anonymous",
        text: message,
        blog: blogid,
        uuid: makeUuid(),
        parentid: commentuuid !== "-1" ? commentuuid : null,
      });

      // Clear form and trigger a refresh of the comment list
      setUsername("");
      setMessage("");
      triggerUpdate();
    } catch (error) {
      console.error("Error submitting comment:", error);
      const serverMessage = error.response?.data?.error;
      setSubmitError(
        serverMessage || "Could not post your comment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: "0" }}>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmitReply}>
            <Form.Group className="mb-3">
              <Form.Label>Name (Optional)</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Guest"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Input your message here"
                required
              />
            </Form.Group>
            <Button variant="outline-primary" type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Comment"}
            </Button>
            {submitError && (
              <div
                className="mt-2 small"
                role="alert"
                style={{ color: "#b02a37" }}
              >
                {submitError}
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>
      <br />
      <br />
    </div>
  );
}

// --- Reply Button Component ---
function CommentReplyButton({ onReplyClick }) {
  return (
    <Button size="sm" variant="light" onClick={onReplyClick}>
      Reply
    </Button>
  );
}

// --- Comment Display Component ---
function CommentBox({ embed = 0, user, date, comment, commentuuid, blogid }) {
  const [showReply, setShowReply] = useState(false);
  const MAX_EMBED = 2;
  const ADJUST_FACTOR = 40;

  // Limit visual nesting to MAX_EMBED levels
  const adjustedEmbed = embed > MAX_EMBED ? MAX_EMBED - 1 : embed - 1;

  const cardStyle = {
    marginLeft: `${adjustedEmbed * ADJUST_FACTOR}px`,
  };

  const toggleReply = () => setShowReply(!showReply);

  return (
    <Card className="mb-3" style={cardStyle}>
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap">
        <Card.Title as="h6" className="mb-0">{user}</Card.Title>
        <Card.Subtitle as="span" className="text-muted small">
          {date}
        </Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <Card.Text style={{ whiteSpace: "pre-wrap" }}>{comment}</Card.Text>
        <CommentReplyButton onReplyClick={toggleReply} />
        {showReply && (
          <div className="mt-3">
            <CommentInputBox commentuuid={commentuuid} blogid={blogid} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default CommentBox;