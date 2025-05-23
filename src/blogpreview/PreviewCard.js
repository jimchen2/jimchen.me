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
            className="border-1 rounded-3"
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
                      color: colors.color_black,
                      fontFamily: "'Arial', sans-serif",
                    }}
                  >
                    {props.date}
                  </span>
                  <span
                    style={{
                      fontSize: "1.0rem",
                      color: colors.color_black,
                      fontFamily: "'Helvetica', Arial, sans-serif",
                    }}
                  >
                    {props.type}
                  </span>
                </div>
                <Link
                  href={`/${props.language}/${props.type}/${props.title}`}
                  style={{
                    transition: "transform 0.3s ease",
                    fontSize: "1.5rem",
                    fontFamily: "Ubuntu",
                    fontWeight: "500",
                    color: colors.color_blue,
                    display: "inline-block", // Required for transform to work
                  }}
                  className="title"
                  onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  {props.title.split("-").join(" ")}
                </Link>
              </Card.Title>
              <Card.Text
                style={{
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                  color: colors.color_black,
                  fontStyle: "italic",
                  fontFamily: "'Open Sans', 'Roboto', sans-serif",
                }}
              >
                {getHighlightedText(props.text, searchTerm)}
              </Card.Text>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: colors.color_black,
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                {props.wordcount} words
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PreviewCard;
