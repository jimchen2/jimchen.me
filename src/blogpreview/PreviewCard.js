"use client";

import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { useGlobalColorScheme } from "../config/global";
import Link from "next/link";

function PreviewCard(props) {
  const { colors } = useGlobalColorScheme();
  const { searchTerm, date, blogid, previewimage, title, text, wordcount } = props;

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
        <Col>
          <Card
            className="border-1 rounded-3"
            style={{
              backgroundColor: colors.color_white,
            }}
          >
            <Row className="g-0">
              {/* --- IMAGE COLUMN --- */}
              {/* Placed first in JSX for mobile-first layout. */}
              {/* On desktop (md and up), 'order-md-2' moves it to the right. */}
              {previewimage && (
                <Col xs={12} md={4} className="order-md-2">
                  {/* Image for Desktop (right) */}
                  <Card.Img
                    src={previewimage}
                    alt={title}
                    className="d-none d-md-block"
                    style={{
                      width: "100%",
                      height: "100%",
                      maxWidth: "640px",
                      maxHeight: "320px",
                      objectFit: "cover",
                      borderRadius: "0 0.3rem 0.3rem 0", // Rounded corners for the right side
                    }}
                  />
                  {/* Image for Mobile (top) */}
                  <Card.Img
                    src={previewimage}
                    alt={title}
                    className="d-block d-md-none"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxWidth: "320px",
                      maxHeight: "180px",
                      objectFit: "cover",
                      borderRadius: "0.3rem 0.3rem 0 0", // Rounded corners for the top
                    }}
                  />
                </Col>
              )}

              <Col md={previewimage ? 8 : 12} className="order-md-1">
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
                      <div
                        className="d-flex flex-wrap justify-content-end gap-2"
                        style={{
                          fontSize: "0.8rem",
                          color: colors.color_black,
                        }}
                      >
                        {wordcount} words
                      </div>
                    </div>
                    <Link
                      href={`/a/${blogid}`}
                      style={{
                        transition: "transform 0.3s ease",
                        fontSize: "1.5rem",
                        fontFamily: "Ubuntu",
                        fontWeight: "500",
                        color: colors.color_blue,
                        display: "inline-block",
                      }}
                      className="title"
                      onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
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
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PreviewCard;
