import React, { createContext, useContext, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";

// --- Context for triggering comment list updates ---
const CommentsContext = createContext({ updateTrigger: 0, triggerUpdate: () => {} });
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

function makeUuid() {
  // 32 hex characters, matching the format the API validates.
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
}

// --- Comment Input Box Component ---
export function CommentInputBox({ commentuuid, blogid }) {
  const { triggerUpdate } = useComments();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const isReply = commentuuid && commentuuid !== "-1";
  const submitting = status.state === "submitting";

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!message.trim() || submitting) return;

    setStatus({ state: "submitting", message: "" });

    try {
      await axios.post("/api/comment", {
        user: username.trim() || "anonymous",
        text: message,
        blog: blogid,
        uuid: makeUuid(),
        parentid: isReply ? commentuuid : null,
      });

      setUsername("");
      setMessage("");
      setStatus({ state: "done", message: "Posted." });
      triggerUpdate();
    } catch (error) {
      const message =
        error?.response?.data?.error || "Something went wrong. Please try again.";
      console.error("Error submitting comment:", error);
      setStatus({ state: "error", message });
    }
  };

  return (
    <div style={{ marginTop: "0" }}>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmitReply}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor={`name-${commentuuid}`}>Name (Optional)</Form.Label>
              <Form.Control
                id={`name-${commentuuid}`}
                type="text"
                value={username}
                maxLength={60}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Guest"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor={`message-${commentuuid}`}>Message</Form.Label>
              <Form.Control
                id={`message-${commentuuid}`}
                as="textarea"
                rows={3}
                maxLength={5000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Input your message here"
                required
              />
            </Form.Group>
            <Button variant="outline-primary" type="submit" disabled={submitting}>
              {submitting ? "Posting..." : isReply ? "Reply" : "Comment"}
            </Button>
            {status.message && (
              <span
                role={status.state === "error" ? "alert" : "status"}
                className="ms-2 small"
                style={{ color: status.state === "error" ? "#b02a37" : "#198754" }}
              >
                {status.message}
              </span>
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
function CommentReplyButton({ onReplyClick, open }) {
  return (
    <Button
      size="sm"
      variant="light"
      onClick={onReplyClick}
      aria-expanded={open}
      aria-label={open ? "Hide reply box" : "Reply to this comment"}
    >
      Reply
    </Button>
  );
}

// --- Comment Display Component ---
function CommentBox({ embed = 1, user, date, comment, commentuuid, blogid }) {
  const [showReply, setShowReply] = useState(false);
  const MAX_EMBED = 2;
  const ADJUST_FACTOR = 40;

  // Limit visual nesting to MAX_EMBED levels
  const adjustedEmbed = Math.max(0, embed > MAX_EMBED ? MAX_EMBED - 1 : embed - 1);

  const cardStyle = {
    marginLeft: `${adjustedEmbed * ADJUST_FACTOR}px`,
  };

  return (
    <Card className="mb-3" style={cardStyle}>
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap">
        <Card.Title as="h6" className="mb-0">
          {user}
        </Card.Title>
        <Card.Subtitle as="span" className="text-muted small">
          {date}
        </Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <Card.Text style={{ whiteSpace: "pre-wrap" }}>{comment}</Card.Text>
        <CommentReplyButton open={showReply} onReplyClick={() => setShowReply((v) => !v)} />
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
