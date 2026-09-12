import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import CommentBox, { CommentInputBox, CommentsProvider, useComments } from "./commentbox";

const GetComments = ({ blogid, paddl = 30, paddr = 30, limit }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateTrigger } = useComments();

  useEffect(() => {
    const controller = new AbortController();

    const getComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ blogid: String(blogid) });
        if (limit) params.set("limit", String(limit));

        const response = await fetch(`/api/comment/?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);

        const comments = await response.json();
        setData(Array.isArray(comments) ? comments : []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getComments();
    return () => controller.abort();
  }, [blogid, updateTrigger, limit]);

  // Recursive renderer for nested comments (a comment's `pointer` holds reply ids).
  const renderComments = (allComments, parentId, depth, parentUser = null) => {
    const comment = allComments.find((entry) => entry.uuid === parentId);
    if (!comment) return null;

    const children = Array.isArray(comment.pointer) ? comment.pointer : [];

    return (
      <div className="GroupCommentBox" key={comment.uuid}>
        <CommentBox
          user={comment.user}
          comment={comment.text}
          date={comment.date}
          commentuuid={comment.uuid}
          blogid={comment.blog}
          embed={depth}
          replyTo={parentUser}
        />
        {children.map((childId) =>
          renderComments(allComments, childId, depth + 1, comment.user),
        )}
      </div>
    );
  };

  if (isLoading) return <p className="text-muted">Loading comments…</p>;
  if (error) return <p className="text-muted">Comments are unavailable right now.</p>;

  const allChildIds = data.flatMap((comment) =>
    Array.isArray(comment.pointer) ? comment.pointer : [],
  );
  const rootComments = data.filter((comment) => !allChildIds.includes(comment.uuid));

  if (rootComments.length === 0) {
    return <p className="text-muted">No comments yet — say something.</p>;
  }

  return (
    <div style={{ paddingLeft: paddl, paddingRight: paddr }}>
      {rootComments.map((comment) => renderComments(data, comment.uuid, 1, null))}
    </div>
  );
};

/** Comment thread for a single post: input box plus the nested list. */
const CommentSection = ({ blogid }) => (
  <CommentsProvider>
    <Container fluid style={{ overflowX: "hidden" }}>
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

export default CommentSection;
