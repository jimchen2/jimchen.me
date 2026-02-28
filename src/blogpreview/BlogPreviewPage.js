import React from "react";
import Pagination from "@/blogpreview/Pagination.js";
import { Container, Card, Row, Col } from "react-bootstrap";
import Link from "next/link";

function PreviewCard(props) {
  const { searchTerm, date, blogid, previewimage, title, text, wordcount } = props;

  const getHighlightedText = (text, highlight) => {
    if (!highlight || !text) {
      return text;
    }
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? <span key={i}>{part}</span> : part
    );
  };

  // --- CHANGE IS HERE ---
  // Create a variable to hold the date text.
  // If the date is "Dec 31, 9999", display "Current", otherwise display the original date.
  const displayDate = date === "Dec 31, 9999" ? "Current" : date;

  return (
    <Container fluid className="my-4" style={{ maxWidth: "100%" }}>
      <Row className="justify-content-center">
        <Col>
          <Card className="border-1 rounded-3">
            <Row className="g-0">
              {/* --- IMAGE COLUMN --- */}
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
                      borderRadius: "0 0.3rem 0.3rem 0",
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
                      objectFit: "cover",
                      borderRadius: "0.3rem 0.3rem 0 0",
                    }}
                  />
                </Col>
              )}

              {/* --- TEXT COLUMN --- */}
              <Col md={previewimage ? 8 : 12} className="order-md-1" style={{ minWidth: 0 }}>
                <Card.Body>
                  <Card.Title className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontFamily: "'Arial', sans-serif",
                        }}
                      >
                        {/* --- AND HERE --- */}
                        {/* Use the new variable to display the date */}
                        {displayDate}
                      </span>
                      <div
                        className="d-flex flex-wrap justify-content-end gap-2"
                        style={{
                          fontSize: "0.8rem",
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
                      fontStyle: "italic",
                      fontFamily: "'Open Sans', 'Roboto', sans-serif",
                      whiteSpace: "normal",
                      overflowWrap: "anywhere", // More aggressive word-breaking
                      wordBreak: "break-all", // Fallback for older browsers
                      overflow: "hidden", // Prevent overflow
                      textOverflow: "ellipsis", // Optional: truncate with ellipsis if needed
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
function BlogPreviewPage({ data, pagination, searchTerm }) {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      {data && data.length > 0 ? (
        data.map((post, index) => (
          <div key={index} style={{ marginBottom: "2rem" }}>
            <PreviewCard
              blogid={post.blogid}
              title={post.title}
              text={post.preview_text}
              date={post.date}
              tags={post.type}
              wordcount={post.word_count}
              previewimage={post.preview_image}
              searchTerm={searchTerm} // Pass searchTerm for highlighting
            />
          </div>
        ))
      ) : (
        <div style={{ textAlign: "center", margin: "5rem 0" }}>No results found.</div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </div>
  );
}

export default BlogPreviewPage;
