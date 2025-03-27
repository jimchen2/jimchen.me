import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useGlobalColorScheme } from "@/config/global";
import { FaUser, FaDesktop, FaServer } from "react-icons/fa";

const Bio = () => {
  const { colors } = useGlobalColorScheme();

  // Style for info items
  const infoItemStyle = {
    display: "flex",
    marginBottom: "0.25rem",
  };

  const infoLabelStyle = {
    fontWeight: "bold",
    minWidth: "120px",
    paddingRight: "0.5rem",
  };

  return (
    <Container fluid className="py-3">
      <br />
      <br />
      <br />
      <br />

      <Card
        className="mx-auto"
        style={{
          maxWidth: "800px",
          backgroundColor: colors.color_white,
          color: colors.color_black,
          border: "none",
          borderRadius: "12px",
        }}
      >
        <Card.Body className="p-3">
          <h4 className="mb-3 text-center">Jim Chen</h4>

          <Row className="g-3">
            <Col md={6} xs={12}>
              <div className="mb-3">
                <h5 className="border-bottom pb-1 mb-2 d-flex align-items-center">
                  <FaUser className="me-2" size="0.9em" /> Personal Information
                </h5>

                <div className="small">
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Birth:</div>
                    <div>March 23, 2005</div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Location:</div>
                    <div>Shanghai</div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Pronouns:</div>
                    <div>he/him</div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Languages:</div>
                    <div>Chinese, English</div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="border-bottom pb-1 mb-2 d-flex align-items-center">
                  <FaServer className="me-2" size="0.9em" /> Stack
                </h5>

                <div className="small">
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Framework:</div>
                    <div>React + Next.js</div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Frontend:</div>
                    <div>React-Boostrap</div>
                  </div>

                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Database:</div>
                    <div>MongoDB</div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Domain:</div>
                    <div>Cloudflare</div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Hosting:</div>
                    <div>Vercel</div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>VPS:</div>
                    <div>DigitalOcean</div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Object Storage:</div>
                    <div>Cloudflare R2</div>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} xs={12}>
              <h5 className="border-bottom pb-1 mb-2 d-flex align-items-center">
                <FaDesktop className="me-2" size="0.9em" /> Computer Setup
              </h5>

              <div className="small">
                <div style={infoItemStyle}>
                  <div style={infoLabelStyle}>OS:</div>
                  <div>Fedora 41 x86_64</div>
                </div>
                <div style={infoItemStyle}>
                  <div style={infoLabelStyle}>Host:</div>
                  <div>ThinkPad P16s Gen 2</div>
                </div>
                <div style={infoItemStyle}>
                  <div style={infoLabelStyle}>Kernel:</div>
                  <div>6.13.6-200.fc41.x86_64</div>
                </div>
                <div style={infoItemStyle}>
                  <div style={infoLabelStyle}>Shell:</div>
                  <div>fish 3.7.0</div>
                </div>
                <div style={infoItemStyle}>
                  <div style={infoLabelStyle}>DE:</div>
                  <div>GNOME 47.4</div>
                </div>
                <div style={infoItemStyle}>
                  <div style={infoLabelStyle}>Terminal:</div>
                  <div>mate-terminal</div>
                </div>
                <div style={infoItemStyle}>
                  <div style={infoLabelStyle}>CPU:</div>
                  <div>Ryzen 7 PRO 7840U</div>
                </div>
                <div style={infoItemStyle}>
                  <div style={infoLabelStyle}>Wallpaper:</div>
                  <div>
                    <a href="https://cdn.jimchen.me/09128349328u40982mu30948m24u23984mu2983mu4/IMG_1005.JPEG" target="_blank" rel="noopener noreferrer">
                      IMG_1005.JPEG
                    </a>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Bio;
