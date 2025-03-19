import React from "react";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import { useGlobalColorScheme } from "@/config/global";

const Bio = () => {
  const { colors } = useGlobalColorScheme();

  return (
    <Container
      fluid
      className="py-5"
      style={{
        backgroundColor: colors.color_white,
        minHeight: "100vh",
      }}
    >
      <Card
        className="shadow-lg mx-auto"
        style={{
          maxWidth: "900px",
          backgroundColor: colors.color_light_gray,
          border: "none",
          borderRadius: "15px",
        }}
      >
        <Card.Header
          className="text-center py-4"
          style={{
            backgroundColor: colors.color_gray,
            color: colors.color_black,
            borderRadius: "15px 15px 0 0",
          }}
        >
          <h2 className="mb-0 fw-bold">Jim Chen</h2>
        </Card.Header>

        <Card.Body className="p-4" style={{ color: colors.color_black }}>
          <Row className="g-4">
            <Col md={6} xs={12}>
              <h5 className="fw-semibold mb-3" style={{ color: colors.color_blue_2 }}>
                Cloud Computing
              </h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {["Cloudflare", "Digital Ocean", "React-Bootstrap", "Next.js"].map((skill) => (
                  <Badge
                    key={skill}
                    className="px-3 py-2"
                    style={{
                      backgroundColor: colors.color_blue_2,
                      color: colors.color_white,
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              <small className="d-block" style={{ color: colors.color_black, opacity: 0.8 }}>
                Experienced with Cloudflare CDN and Digital Ocean cloud infrastructure
              </small>
            </Col>

            <Col md={6} xs={12}>
              <h5 className="fw-semibold mb-3" style={{ color: colors.color_blue_2 }}>
                Language Learning
              </h5>
              <p className="mb-2">Active language learner through:</p>
              <ul className="list-unstyled">
                {["Video content in different languages", "Engaging with various software and websites", "International media consumption"].map((item) => (
                  <li key={item} className="mb-1">
                    <span className="me-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>

              <h5 className="fw-semibold mt-4 mb-3" style={{ color: colors.color_blue_2 }}>
                Technical Skills
              </h5>
              <ul className="list-unstyled">
                {["Cloud Infrastructure (Cloudflare & Digital Ocean)", "Operating Systems", "Python Programming"].map((skill) => (
                  <li key={skill} className="mb-1">
                    <span className="me-2">🔸</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </Col>

            <Col xs={12}>
              <div
                className="mt-4 pt-4"
                style={{
                  borderTop: `1px solid ${colors.color_gray}`,
                }}
              >
                <h5 className="fw-semibold mb-3" style={{ color: colors.color_blue_2 }}>
                  About Me
                </h5>
                <p className="lh-lg" style={{ opacity: 0.9 }}>
                  A technology enthusiast specializing in Cloudflare and Digital Ocean infrastructure, with a passion for language learning. I focus on building efficient, secure, and scalable systems
                  using modern cloud technologies.
                </p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Bio;
