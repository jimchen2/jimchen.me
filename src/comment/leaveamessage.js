import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import GetComments from "./getcomments";
import CommentInputBox from "./commentsubmit/commentinputbox";
import { paddingtop } from "../config/global";
import { CommentsProvider } from "./commentscontext";

const Msg = ({ bloguuid, blogname }) => {
  return (
    <CommentsProvider>
      {bloguuid === "0" && (
        <div>
          <br />
          <br />
          <br />
        </div>
      )}
      <Container fluid style={{ overflowX: "hidden", overflowY: "hidden" }}>
        <Row className="my-4">
          <>
            <Col md={{ span: 8, offset: 2 }} style={{ paddingLeft: "15%", paddingRight: "15%" }}>
              <CommentInputBox commentuuid="-1" bloguuid={bloguuid} blogname={blogname} />
            </Col>
            <Col md={{ span: 6, offset: 3 }}>{bloguuid === "0" ? <GetComments bloguuid={bloguuid} showName /> : <GetComments bloguuid={bloguuid} />}</Col>

            <div style={{ marginBottom: `${paddingtop}px` }}></div>
          </>
        </Row>
      </Container>
    </CommentsProvider>
  );
};

export default Msg;