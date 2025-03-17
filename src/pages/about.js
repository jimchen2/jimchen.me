'use client'; 

import React from "react";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import { useGlobalColorScheme } from "@/config/global";

const Bio = () => {
  const { colors } = useGlobalColorScheme();

  return (
    <Container className="py-5" style={{ backgroundColor: colors.color_white }}>
      <br />
      <br />
      <Card className="shadow" style={{ backgroundColor: colors.color_light_gray }}>
        <Card.Header style={{ backgroundColor: colors.color_gray, color: colors.color_black }}>
          <h2 className="mb-0">Jim Chen</h2>
        </Card.Header>

        <Card.Body style={{ color: colors.color_black }}>
          <Row>
            <Col md={6}>
              <h5 style={{ color: colors.color_blue_2 }}>Cloud Computing</h5>
              <div className="mb-3">
                <Badge bg="info" className="me-2 mb-2" style={{ backgroundColor: colors.color_blue_2 }}>
                  Cloudflare
                </Badge>
                <Badge bg="info" className="me-2 mb-2" style={{ backgroundColor: colors.color_blue_2 }}>
                  Digital Ocean
                </Badge>
                <Badge bg="info" className="me-2 mb-2" style={{ backgroundColor: colors.color_blue_2 }}>
                  React-Bootstrap
                </Badge>
                <small className="d-block mt-2" style={{ color: colors.color_black }}>
                  Experienced with Cloudflare CDN and Digital Ocean cloud infrastructure
                </small>
              </div>
            </Col>

            <Col md={6}>
              <h5 style={{ color: colors.color_blue_2 }}>Language Learning</h5>
              <p>Active language learner through:</p>
              <ul>
                <li>Video content in different languages</li>
                <li>Engaging with different softwares and websites</li>
                <li>International media consumption</li>
              </ul>

              <h5 style={{ color: colors.color_blue_2 }} className="mt-4">
                Technical Skills
              </h5>
              <ul className="list-unstyled">
                <li>🔸 Cloud Infrastructure (Cloudflare & Digital Ocean)</li>
                <li>🔸 Operating Systems</li>
                <li>🔸 Python Programming</li>
              </ul>
            </Col>

            <Col xs={12}>
              <div className="border-top mt-4 pt-4" style={{ borderColor: colors.color_gray }}>
                <h5 style={{ color: colors.color_blue_2 }}>About Me</h5>
                <p>
                  A technology enthusiast specializing in Cloudflare and Digital Ocean infrastructure, 
                  with interests in language learning. I focus on building efficient, 
                  secure, and scalable systems using modern cloud technologies.
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
