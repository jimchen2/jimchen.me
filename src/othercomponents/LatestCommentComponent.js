import React from "react";
import Link from 'next/link'; // 1. Import the Link component
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

      {/* 2. Add the "Read more" link after the comments */}
      <div style={{ marginTop: '1rem', textAlign: 'right' }}>
        <Link href="/comments" style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}>
          See all comments...
        </Link>
      </div>
    </div>
  );
};

export default Msg;
