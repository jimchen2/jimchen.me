"use client";

import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { useGlobalColorScheme } from "../config/global";
import Link from "next/link";

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
            className="shadow border-1 rounded-3"
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
                <Link
                  href={`/${props.language}/${props.type}/${props.title}`}
                  style={{
                    textDecoration: "none",
                    color: colors.color_black,
                  }}
                >
                  <h3
                    className="mt-2"
                    style={{
                      fontWeight: "bold",
                      transition: "text-decoration 0.3s ease",
                    }}
                    onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                    onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                  >
                    {props.title.split("-").join(" ")}
                  </h3>
                </Link>
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