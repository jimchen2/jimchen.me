import React from "react";
import GetComments from "@/comment/getcomments";
import { CommentsProvider } from "@/comment/commentscontext";

const Msg = () => {
  return (
    <div style={{ marginLeft: "5%", marginBottom: "5%", marginTop: "5%" }}>
      <div style={{ fontSize: "1rem", fontWeight: "bold" }}> Latest Comments:</div>
      <br />
      <CommentsProvider>
        <GetComments blogid="0" showName paddl="0" paddr="0" limit="3" />
      </CommentsProvider>
    </div>
  );
};

export default Msg;
