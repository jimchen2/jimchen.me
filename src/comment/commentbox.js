import React, { createContext, useContext, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";

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

/** 32 hex characters; the API stores these in a plain text column. */
function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
}

// --- Comment Input Box Component ---
export function CommentInputBox({ commentuuid, blogid }) {
  const { triggerUpdate } = useComments();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReply = async (event) => {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: username.trim() || "anonymous",
          text,
          blog: blogid,
          uuid: generateId(),
          parentid: commentuuid !== "-1" ? commentuuid : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Could not post the comment");
      }

      setUsername("");
      setMessage("");
      triggerUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-4">
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmitReply}>
            <Form.Group className="mb-3" controlId="comment-name">
              <Form.Label>Name (optional)</Form.Label>
              <Form.Control
                type="text"
                value={username}
                maxLength={60}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Guest"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="comment-text">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={message}
                maxLength={5000}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Input your message here"
                required
              />
            </Form.Group>

            {error && <p className="text-danger small mb-2">{error}</p>}

            <Button variant="outline-primary" type="submit" disabled={submitting}>
              {submitting ? "Posting…" : "Comment"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

// --- Comment Display Component ---
function CommentBox({ embed = 0, user, date, comment, commentuuid, blogid, replyTo }) {
  const [showReply, setShowReply] = useState(false);
  const MAX_EMBED = 2;
  const ADJUST_FACTOR = 40;

  // Limit visual nesting to MAX_EMBED levels
  const adjustedEmbed = embed > MAX_EMBED ? MAX_EMBED - 1 : embed - 1;

  return (
    <Card className="mb-3" style={{ marginLeft: `${adjustedEmbed * ADJUST_FACTOR}px` }}>
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <Card.Title as="h6" className="mb-0">
          {user}
        </Card.Title>
        <Card.Subtitle as="span" className="text-muted small">
          {date}
        </Card.Subtitle>
      </Card.Header>
      <Card.Body>
        {replyTo && <p className="text-muted small mb-1">Replying to @{replyTo}</p>}
        <Card.Text style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{comment}</Card.Text>
        <Button size="sm" variant="light" onClick={() => setShowReply((open) => !open)}>
          {showReply ? "Cancel" : "Reply"}
        </Button>
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
