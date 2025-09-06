import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentBox from "./commentbox";
import { useComments } from "./commentscontext";
import { useTranslation } from "next-i18next"; // 1. Import the hook

const GetComments = ({ showName, blogid, paddl = 30, paddr = 30, limit }) => {
  const { t } = useTranslation("common"); // 2. Initialize the hook
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateTrigger } = useComments();

  useEffect(() => {
    const getComments = async () => {
      setIsLoading(true);
      try {
        let apiUrl = `/api/comment/?blogid=${blogid}`;
        if (limit) {
          apiUrl += `&limit=${limit}`;
        }
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    getComments();
  }, [blogid, updateTrigger, limit]);

  // 3. Translate the "Loading..." text
  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div>Error: {error.message}</div>; // Per your request, this is not translated

  const renderComments = (comments, parentId, depth, parentUser = null) => {
    let result = [];
    const currentComments = comments.filter(
      (comment) => comment.uuid === parentId
    );

    for (let comment of currentComments) {
      // 3. Translate the "Replying to" text using interpolation
      const modifiedText = parentUser
        ? `${t("comment.replyingTo", { user: parentUser })}\n${comment.text}`
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
            blogid={comment.blog}
            showName={showName}
            embed={depth}
          />
          {comment.pointer.map((childId) =>
            renderComments(comments, childId, depth + 1, comment.user)
          )}
        </div>
      );
    }

    return result;
  };

  const allPointers = data.flatMap((comment) => comment.pointer);
  const rootComments = data.filter(
    (comment) => !allPointers.includes(comment.uuid)
  );
  const renderedComments = rootComments.flatMap((comment) =>
    renderComments(data, comment.uuid, 1, null)
  );

  return (
    <div style={{ paddingLeft: paddl, paddingRight: paddr }}>
      {renderedComments}
    </div>
  );
};

export default GetComments;