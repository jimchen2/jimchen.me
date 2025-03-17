import React, { useState } from "react";
import { Button } from "react-bootstrap";
import CommentInputBox from "./commentsubmit/commentinputbox.js";
import { useGlobalColorScheme } from "../config/global.js";

function CommentReplyButton({ id, blog, onReplyClick }) {
  const { colors } = useGlobalColorScheme();

  const [showReply] = useState(false);

  const buttonStyle = {
    fontSize: "0.75rem",
    color: colors.color_blue_2,
    backgroundColor: colors.color_white,
    borderColor: colors.color_blue_2,
    padding: "2px 6px",
    margin: "5px",
    transition: "background-color 0.3s",
  };

  return (
    <div>
      <Button style={buttonStyle} onClick={onReplyClick}>
        Reply
      </Button>
      {showReply && <Commentinputbox id={id} blog={blog} />}
    </div>
  );
}

export default CommentReplyButton;