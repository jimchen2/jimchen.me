import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentBox from "./commentbox";
import { useComments } from "./commentscontext";

const GetComments = ({ showName, bloguuid, paddl = 30, paddr = 30 }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateTrigger } = useComments();

  useEffect(() => {
    const getComments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/comment/?bloguuid=${bloguuid}`
        );
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    getComments();
  }, [bloguuid, updateTrigger]);


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const renderComments = (comments, parentId, depth, parentUser = null) => {
    let result = [];
    const currentComments = comments.filter(
      (comment) => comment.uuid === parentId
    );

    for (let comment of currentComments) {
      // Modify the comment text if it's a reply
      const modifiedText = parentUser
        ? `Replying to @${parentUser}\n${comment.text}`
        : comment.text;

      result.push(
        <div className="GroupCommentBox" key={comment.uuid}>
          <CommentBox
            user={comment.user}
            comment={modifiedText} // Use the modified text
            date={comment.date}
            like={comment.like}
            blogname={comment.blogname}
            commentuuid={comment.uuid}
            bloguuid={comment.blog}
            showName={showName}
            embed={depth}
          />
          {/* Pass the current comment's user to child comments */}
          {comment.pointer.map((childId) =>
            renderComments(comments, childId, depth + 1, comment.user)
          )}
        </div>
      );
    }

    return result;
  };

  // Identify root comments and initiate recursive rendering
  const allPointers = data.flatMap((comment) => comment.pointer);
  const rootComments = data.filter(
    (comment) => !allPointers.includes(comment.uuid)
  );
  const renderedComments = rootComments.flatMap((comment) =>
    renderComments(data, comment.uuid, 1, null) // Pass null as parentUser for root comments
  );

  return (
    <div style={{ paddingLeft: paddl, paddingRight: paddr }}>
      {renderedComments}
    </div>
  );
};

export default GetComments;
