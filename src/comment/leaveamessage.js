import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import GetComments from "./getcomments";
import CommentInputBox from "./commentsubmit";
import { CommentsProvider } from "./commentscontext";

const Msg = ({ blogid, blogname }) => {
  return (
    <CommentsProvider>
      <Container fluid style={{ overflowX: "hidden", overflowY: "hidden" }}>
        <Row className="my-4">
          <>
            <Col md={{ span: 8, offset: 2 }} style={{ paddingLeft: "15%", paddingRight: "15%" }}>
              {blogid === "0" ? <></> : <CommentInputBox commentuuid="-1" blogid={blogid} blogname={blogname} />}
            </Col>
            <Col md={{ span: 6, offset: 3 }}>{blogid === "0" ? <GetComments blogid={blogid} showName /> : <GetComments blogid={blogid} />}</Col>
          </>
        </Row>
      </Container>
    </CommentsProvider>
  );
};

export default Msg;
