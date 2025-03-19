"use client"; 

import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { useGlobalColorScheme } from "../config/global";
import Link from "next/link";
import styled from "styled-components";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ colors }) => colors.color_black};

  h3 {
    transition: text-decoration 0.3s ease;
  }

  &:hover h3 {
    text-decoration: underline;
  }
`;

function PreviewCard(props) {
  const { colors } = useGlobalColorScheme();
  const { searchTerm } = props;

  const getHighlightedText = (text, highlight) => {
    if (!highlight) {
      return text;
    }
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} style={{ backgroundColor: colors.color_gray }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Container fluid className="my-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card
            className="shadow border-0 rounded"
            style={{
              backgroundColor: colors.color_white,
            }}
          >
            <Card.Body>
              <Card.Title className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      color: colors.color_blue,
                    }}
                  >
                    {props.date}
                  </span>
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: colors.color_blue,
                      textTransform: "uppercase",
                    }}
                  >
                    {props.type}
                  </span>
                </div>
                <StyledLink
                  href={`/${props.language}/${props.type}/${props.title}`}
                  colors={colors}
                >
                  <h3
                    className="mt-2"
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {props.title.split("-").join(" ")}
                  </h3>
                </StyledLink>
              </Card.Title>
              <Card.Text
                style={{
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                  color: colors.color_black,
                  fontStyle: "italic",
                }}
              >
                {getHighlightedText(props.text, searchTerm)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PreviewCard;