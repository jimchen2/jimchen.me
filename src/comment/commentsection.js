import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import CommentBox, {
  CommentInputBox,
  CommentsProvider,
  useComments,
} from "./commentbox";

const GetComments = ({ blogid, paddl = 30, paddr = 30, limit }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [available, setAvailable] = useState(true);
  const { updateTrigger } = useComments();

  useEffect(() => {
    let isMounted = true;
    const getComments = async () => {
      setIsLoading(true);
      try {
        let apiUrl = `/api/comment?blogid=${blogid}`;
        if (limit) {
          apiUrl += `&limit=${limit}`;
        }
        const response = await axios.get(apiUrl);
        if (!isMounted) return;
        const payload = response.data;
        if (Array.isArray(payload)) {
          setData(payload);
        } else {
          setAvailable(payload.available !== false);
          setData(payload.comments || []);
        }
        setError(null);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    getComments();
    return () => {
      isMounted = false;
    };
  }, [blogid, updateTrigger, limit]);

  if (isLoading) return <div>Loading comments...</div>;
  if (error)
    return (
      <div className="text-muted small" style={{ padding: "0.5rem 0" }}>
        Comments could not be loaded right now.
      </div>
    );
  if (!available)
    return (
      <div className="text-muted small" style={{ padding: "0.5rem 0" }}>
        Comments are turned off in this environment.
      </div>
    );

  // Recursive function to render nested comments
  const renderComments = (allComments, parentId, depth, parentUser = null) => {
    const commentToRender = allComments.find((c) => c.uuid === parentId);
    if (!commentToRender) return null;

    // Prepend "Replying to @user" if it's a reply
    const modifiedText = parentUser
      ? `Replying to @${parentUser}\n${commentToRender.text}`
      : commentToRender.text;

    return (
      <div className="GroupCommentBox" key={commentToRender.uuid}>
        <CommentBox
          user={commentToRender.user}
          comment={modifiedText}
          date={commentToRender.date}
          commentuuid={commentToRender.uuid}
          blogid={commentToRender.blog}
          embed={depth}
        />
        {/* Recursively render children */}
        {commentToRender.pointer.map((childId) =>
          renderComments(allComments, childId, depth + 1, commentToRender.user)
        )}
      </div>
    );
  };

  const allChildIds = data.flatMap((comment) => comment.pointer);
  const rootComments = data.filter(
    (comment) => !allChildIds.includes(comment.uuid)
  );

  return (
    <div style={{ paddingLeft: paddl, paddingRight: paddr }}>
      {rootComments.length === 0 ? (
        <div className="text-muted small" style={{ padding: "0.5rem 0" }}>
          No comments yet. Be the first to leave one.
        </div>
      ) : (
        rootComments.map((comment) =>
          renderComments(data, comment.uuid, 1, null)
        )
      )}
    </div>
  );
};

// Main export component
const CommentSection = ({ blogid }) => {
  return (
    <CommentsProvider>
      <Container fluid style={{ overflowX: "hidden", overflowY: "hidden" }}>
        <Row className="my-4">
          <Col md={{ span: 8, offset: 2 }} style={{ padding: "0 15%" }}>
            {blogid !== "0" && <CommentInputBox commentuuid="-1" blogid={blogid} />}
          </Col>
          <Col md={{ span: 6, offset: 3 }}>
            <GetComments blogid={blogid} />
          </Col>
        </Row>
      </Container>
    </CommentsProvider>
  );
};

export default CommentSection;
