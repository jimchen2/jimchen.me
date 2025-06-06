"use client";

import React from "react";
// Import Badge from react-bootstrap
import { Container, Card, Row, Col, Badge } from "react-bootstrap";
import { useGlobalColorScheme } from "../config/global";
import Link from "next/link";

function PreviewCard(props) {
  const { colors } = useGlobalColorScheme();
  // Destructure the new 'types' prop along with others
  const { searchTerm, date, types, blogid, title, text, wordcount } = props;

  const getHighlightedText = (text, highlight) => {
    if (!highlight || !text) {
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
                    {date}
                  </span>
                  {/* START: NEW BADGE SECTION FOR MULTIPLE TYPES */}
                  <div className="d-flex flex-wrap justify-content-end gap-2">
                    {/* Ensure 'types' is an array before mapping */}
                    {Array.isArray(types) &&
                      types.map((type, index) => (
                        <Badge
                          key={index}
                          pill // Makes the badge have rounded ends
                          className="p-2"
                          style={{
                            backgroundColor: colors.color_gray,
                            color: colors.color_black,
                            fontSize: "0.8rem",
                            fontWeight: "500",
                          }}
                        >
                          {type}
                        </Badge>
                      ))}
                  </div>
                  {/* END: NEW BADGE SECTION */}
                </div>
                <Link
                  href={`/a/${blogid}`}
                  style={{
                    transition: "transform 0.3s ease",
                    fontSize: "1.5rem",
                    fontFamily: "Ubuntu",
                    fontWeight: "500",
                    color: colors.color_blue,
                    display: "inline-block", // Required for transform to work
                  }}
                  className="title"
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  {title.split("-").join(" ")}
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
                {getHighlightedText(text, searchTerm)}
              </Card.Text>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: colors.color_black,
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                {wordcount} words
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PreviewCard;