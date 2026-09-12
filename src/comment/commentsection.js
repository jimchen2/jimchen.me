import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import CommentBox, { CommentInputBox, CommentsProvider, useComments } from "./commentbox";

const GetComments = ({ blogid, limit }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateTrigger } = useComments();

  useEffect(() => {
    if (!blogid || blogid === "0") {
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    const getComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let apiUrl = `/api/comment?blogid=${encodeURIComponent(blogid)}`;
        if (limit) apiUrl += `&limit=${limit}`;

        const response = await axios.get(apiUrl, { signal: controller.signal });
        setData(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        if (err?.name !== "CanceledError") {
          console.error("Error loading comments:", err);
          setError("Could not load comments.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    getComments();
    return () => controller.abort();
  }, [blogid, updateTrigger, limit]);

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div role="alert">{error}</div>;
  if (data.length === 0) {
    return <div className="text-muted small">No comments yet. Be the first.</div>;
  }

  // Renders a comment and, recursively, everything that replies to it.
  const renderComments = (allComments, parentId, depth, parentUser = null) => {
    const comment = allComments.find((c) => c.uuid === parentId);
    if (!comment) return null;

    const text = parentUser
      ? `Replying to @${parentUser}\n${comment.text}`
      : comment.text;

    return (
      <div className="GroupCommentBox" key={comment.uuid}>
        <CommentBox
          user={comment.user}
          comment={text}
          date={comment.date}
          commentuuid={comment.uuid}
          blogid={comment.blog}
          embed={depth}
        />
        {(comment.pointer || []).map((childId) =>
          renderComments(allComments, childId, depth + 1, comment.user),
        )}
      </div>
    );
  };

  const allChildIds = data.flatMap((comment) => comment.pointer || []);
  const rootComments = data.filter((comment) => !allChildIds.includes(comment.uuid));

  return <div>{rootComments.map((comment) => renderComments(data, comment.uuid, 1, null))}</div>;
};

const CommentSection = ({ blogid }) => {
  return (
    <CommentsProvider>
      <Container fluid style={{ overflow: "hidden" }}>
        <Row className="my-4 justify-content-center">
          <Col md={{ span: 8, offset: 2 }} xs={12}>
            <h2 className="h5 mb-3">Comments</h2>
            {blogid !== "0" && <CommentInputBox commentuuid="-1" blogid={blogid} />}
            <GetComments blogid={blogid} />
          </Col>
        </Row>
      </Container>
    </CommentsProvider>
  );
};

export default CommentSection;
