import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// --- Data for this page ---
const personalPhotos = [
  {
    src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/1.jpeg",
    thumbnailSrc: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/146c34.jpeg",
    alt: "Personal photo 1",
  },
  { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/2.JPEG", alt: "Personal photo 2" },
  { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/3.JPEG", alt: "Personal photo 3" },
  { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/4.JPEG", alt: "Personal photo 4" },
  { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/5.JPEG", alt: "Personal photo 5" },
  { src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/6.jpg", alt: "Personal photo 6" },
];

const techSetup = [
  { name: "jimchen2/computer-config", url: "https://github.com/jimchen2/computer-config" },
  { name: "jimchen2/jimchen.me", url: "https://github.com/jimchen2/jimchen.me" },
];

const globalInternet = [
  { name: "Русский язык, медиа и культура (2025)", url: "https://jimchen.me/a/1580c8" },
  { name: "My Guide to the Global Internet (2025)", url: "https://jimchen.me/a/19b074" },
];

const devices = {
  phones: ["Pixel 8 Pro", "Redmi Note 13"],
  computers: ["ThinkPad P16s (Fedora)", "Redmi Note (Windows)"],
};

function AboutPage() {
  const SimpleLinkList = ({ items }) => (
    <ul className="list-unstyled mb-0">
      {items.map((item, index) => (
        <li key={index} className="mb-2">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none d-inline-flex align-items-center"
            style={{
              color: "#667eea",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "all 0.3s ease",
              position: "relative",
              paddingLeft: "1.5rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#764ba2";
              e.currentTarget.style.paddingLeft = "2rem";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#667eea";
              e.currentTarget.style.paddingLeft = "1.5rem";
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "0",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "1.2rem",
              }}
            >
              →
            </span>
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  );

  const DeviceTag = ({ text }) => (
    <span
      style={{
        display: "inline-block",
        padding: "0.4rem 0.9rem",
        margin: "0.3rem",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        borderRadius: "20px",
        fontSize: "0.9rem",
        fontWeight: "500",
        boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
      }}
    >
      {text}
    </span>
  );

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        paddingTop: "2rem",
        paddingBottom: "3rem",
      }}
    >
      <Container className="py-4" style={{ fontFamily: "'Inter', 'Ubuntu', sans-serif" }}>
        {/* Introduction Section */}
        <Card
          className="mb-5 border-0"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              height: "6px",
            }}
          />
          <Card.Body className="p-5 text-center">
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "50%",
                margin: "0 auto 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
              }}
            >
              👋
            </div>
            <h1
              className="fw-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "2.5rem",
                letterSpacing: "-0.5px",
              }}
            >
              Hello there, I'm Jim.
            </h1>
            <p
              className="lead"
              style={{
                fontSize: "1.15rem",
                maxWidth: "750px",
                margin: "0 auto",
                color: "#4a5568",
                lineHeight: "1.8",
              }}
            >
              I'm a student at the{" "}
              <strong style={{ color: "#667eea" }}>
                University of Science and Technology of China (USTC)
              </strong>
              , currently diving deep into the world of{" "}
              <strong style={{ color: "#764ba2" }}>Computer Science</strong>. This little corner of the
              web is my digital garden—a place to share my projects, thoughts, and a few snapshots from my
              life.
            </p>
          </Card.Body>
        </Card>

        {/* Portfolio Section */}
        <Card
          className="mb-5 border-0"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              height: "6px",
            }}
          />
          <Card.Body className="p-4 p-md-5">
            <div className="d-flex align-items-center mb-4">
              <span
                style={{
                  fontSize: "2rem",
                  marginRight: "1rem",
                }}
              >
                📸
              </span>
              <Card.Title
                as="h2"
                className="h3 mb-0 fw-bold"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                A Glimpse Into My Life
              </Card.Title>
            </div>
            <Card.Text className="mb-4" style={{ color: "#718096", fontSize: "1.05rem" }}>
              Beyond the screen and the code, here are a few moments from my journey.
            </Card.Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "1rem",
              }}
            >
              {personalPhotos.map((photo, index) => (
                <a
                  key={index}
                  href={photo.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={photo.alt}
                  style={{
                    position: "relative",
                    display: "block",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(102, 126, 234, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <img
                    src={photo.thumbnailSrc || photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  />
                </a>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Tech Setup & Devices + Global Internet Section */}
        <Row className="g-4">
          <Col md={6}>
            <Card
              className="h-100 border-0"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  height: "6px",
                }}
              />
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <span style={{ fontSize: "1.8rem", marginRight: "0.8rem" }}>⚙️</span>
                  <Card.Title
                    as="h3"
                    className="h5 mb-0 fw-bold"
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    My Digital Toolkit
                  </Card.Title>
                </div>
                <Card.Text className="mb-4" style={{ color: "#718096", fontSize: "0.98rem" }}>
                  As a tech enthusiast, I believe the right tools can make all the difference. Here's a peek
                  at my day-to-day setup.
                </Card.Text>

                <div className="mb-4">
                  <SimpleLinkList items={techSetup} />
                </div>

                <div
                  style={{
                    padding: "1.5rem",
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))",
                    borderRadius: "12px",
                    marginTop: "1.5rem",
                  }}
                >
                  <div className="mb-3">
                    <p className="mb-2 fw-semibold" style={{ color: "#4a5568", fontSize: "0.95rem" }}>
                      📱 Phones
                    </p>
                    <div>
                      {devices.phones.map((phone, i) => (
                        <DeviceTag key={i} text={phone} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 fw-semibold" style={{ color: "#4a5568", fontSize: "0.95rem" }}>
                      💻 Computers
                    </p>
                    <div>
                      {devices.computers.map((computer, i) => (
                        <DeviceTag key={i} text={computer} />
                      ))}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card
              className="h-100 border-0"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  height: "6px",
                }}
              />
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <span style={{ fontSize: "1.8rem", marginRight: "0.8rem" }}>🌍</span>
                  <Card.Title
                    as="h3"
                    className="h5 mb-0 fw-bold"
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Exploring the Digital World
                  </Card.Title>
                </div>
                <Card.Text className="mb-4" style={{ color: "#718096", fontSize: "0.98rem" }}>
                  The internet is a vast, interconnected world. I'm passionate about navigating it effectively
                  and sharing what I learn.
                </Card.Text>
                <SimpleLinkList items={globalInternet} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AboutPage;