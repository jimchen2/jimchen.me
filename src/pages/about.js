import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// --- Data for this page ---
const personalPhotos = [
  { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/1.jpeg", thumbnailSrc: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/146c34.jpeg", alt: "Personal photo 1" },
  { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/2.JPEG", alt: "Personal photo 2" },
  { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/3.JPEG", alt: "Personal photo 3" },
  { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/4.JPEG", alt: "Personal photo 4" },
  { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/5.JPEG", alt: "Personal photo 5" },
  { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/6.jpg", alt: "Personal photo 6" },
];
const techSetup = [
  { name: "jimchen2/dconf-dump", url: "https://github.com/jimchen2/dconf-dump" },
  { name: "jimchen2/jimchen.me", url: "https://github.com/jimchen2/jimchen.me" },
  { name: "jimchen2/userscripts", url: "https://github.com/jimchen2/userscripts" },
];
const globalInternet = [
  { name: "Русский язык, медиа и культура (2025)", url: "https://jimchen.me/a/1580c8" },
  { name: "German YouTubers (2025)", url: "https://jimchen.me/a/7d67cb" },
  { name: "My Language Learning Journey", url: "https://jimchen.me/a/9bf4b4" },
  { name: "My Guide to the Global Internet (2025)", url: "https://jimchen.me/a/19b074" },
];


function AboutPage() {

  // Helper component for simple link lists, reducing code duplication
  const SimpleLinkList = ({ items }) => (
    <ul className="list-unstyled mb-0">
      {items.map((item, index) => (
        <li key={index} className="mb-1">
          <a href={item.url} target="_blank" rel="noopener noreferrer" 
             className="text-decoration-none small"
             style={{ color: "#2980b9", transition: "color 0.2s ease" }}
             onMouseEnter={(e) => (e.currentTarget.style.color = "#e74c3c")}
             onMouseLeave={(e) => (e.currentTarget.style.color = "#2980b9")}>
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <Container style={{ 
      fontFamily: "Ubuntu, sans-serif",
      background: "linear-gradient(to bottom, #f0f4f8, #ffffff)",
      maxWidth: '800px'
    }} className="py-4">

      <h1 className="fw-bold mb-4 text-center" style={{ color: "#2c3e50" }}>
        About Me
      </h1>

      {/* Portfolio Section */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="p-3">
          <Card.Title as="h2" className="h5 mb-3 pb-2 border-bottom fw-bold" style={{ color: "#2c3e50" }}>
            Portfolio
          </Card.Title>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "0.75rem",
          }}>
            {personalPhotos.map((photo, index) => (
              <a key={index} href={photo.src} target="_blank" rel="noopener noreferrer" title={photo.alt}>
                <img
                  src={photo.thumbnailSrc || photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "150px", // Reduced height
                    objectFit: "cover",
                    borderRadius: "6px", // Slightly smaller radius
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </a>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Tech Setup & Global Internet Section */}
      <Row>
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-3">
              <Card.Title as="h3" className="h6 mb-3 fw-semibold" style={{ color: "#34495e" }}>
                Tech Setup
              </Card.Title>
              <SimpleLinkList items={techSetup} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-3">
              <Card.Title as="h3" className="h6 mb-3 fw-semibold" style={{ color: "#34495e" }}>
                Global Internet
              </Card.Title>
              <SimpleLinkList items={globalInternet} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
    </Container>
  );
}

export default AboutPage;