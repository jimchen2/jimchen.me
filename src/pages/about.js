import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useGlobalColorScheme } from "@/config/global";
import { FaUser, FaLaptop, FaServer, FaMobileAlt, FaChrome } from "react-icons/fa";

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

  // Common icon style
  const iconStyle = {
    marginRight: "0.5rem",
    fontSize: "1.1rem",
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
          <Row>
            <Col md={6} xs={12}>
              <Row>
                <div className="mb-3">
                  <h5 className="border-bottom pb-1 mb-2 d-flex align-items-center">
                    <FaUser style={iconStyle} /> Personal Information
                  </h5>
                  <div className="small">
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Birth:</div>
                      <div>March 23, 2005</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Hometown:</div>
                      <div>Shanghai</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Pronouns:</div>
                      <div>He/Him</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Languages:</div>
                      <div>Chinese, English</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Nationality:</div>
                      <div>Chinese</div>
                    </div>
                  </div>
                </div>
              </Row>

              <Row>
                <div>
                  <h5 className="border-bottom pb-1 mb-2 d-flex align-items-center">
                    <FaServer style={iconStyle} /> Stack
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
                      <a href="https://www.mongodb.com/" target="_blank" rel="noopener noreferrer">
                        MongoDB
                      </a>
                      <span style={{ width: 5 }}>, </span>
                      <a href="https://redis.io/" target="_blank" rel="noopener noreferrer">
                        Redis
                      </a>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Domain:</div>
                      <div>Cloudflare</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Blog Hosting:</div>
                      <div>Vercel</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>VPS:</div>
                      <div>DigitalOcean (paid)</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Object Storage:</div>
                      <div>Cloudflare R2 (paid)</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Proxy:</div>
                      <div>Nexitally (paid)</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>GPU:</div>
                      <div>Vast.ai (paid)</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>LLM:</div>
                      <div>OpenRouter (paid)</div>
                    </div>
                  </div>
                </div>
              </Row>

              <Row>
                <div>
                  <h5 className="border-bottom pb-1 mb-2 d-flex align-items-center">
                    <FaChrome style={iconStyle} /> Browser
                  </h5>

                  <div className="small">
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Extensions:</div>
                      <div>Ublock Origin, Violentmonkey</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Policies:</div>
                      <div>
                        <a href="https://cdn.jimchen.me/d2e18f4893ef9a61fe5944720259e119/policies.json" target="_blank" rel="noopener noreferrer">
                          <div>policies.json</div>
                        </a>
                      </div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Userscripts:</div>
                      <a href="https://github.com/ilyhalight/voice-over-translation" target="_blank" rel="noopener noreferrer">
                        <div>VoT</div>
                      </a>
                      <span style={{ width: 5 }}>, </span>
                      <a href="https://github.com/jimchen2/userscripts" target="_blank" rel="noopener noreferrer">
                        <div>my userscripts</div>
                      </a>
                      <span style={{ width: 5 }}>, </span>
                    </div>
                  </div>
                </div>
              </Row>
            </Col>
            <Col md={6} xs={12}>
              <Row>
                <h5 className="border-bottom pb-1 mb-2 d-flex align-items-center">
                  <FaLaptop style={iconStyle} /> Computer
                </h5>

                <div className="small">
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Device:</div>
                    <div>ThinkPad P16s Gen 2</div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>OS:</div>
                    <div>Fedora 41 x86_64</div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>CPU:</div>
                    <div>Ryzen 7 PRO 7840U</div>
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
                    <div style={infoLabelStyle}>Theme:</div>
                    <a href="https://cdn.jimchen.me/09128349328u40982mu30948m24u23984mu2983mu4/IMG_1005.JPEG" target="_blank" rel="noopener noreferrer">
                      <div>Wallpaper</div>
                    </a>
                    <span style={{ width: 5 }}>, </span>
                    <a href="https://cdn.jimchen.me/96c5f4bc0a3766eff967cb508b1d0cab/dconf-settings.txt" target="_blank" rel="noopener noreferrer">
                      <div>dconf-settings</div>
                    </a>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Input:</div>
                    <div>
                      en, ru, zh
                      <span style={{ width: 5 }}>, </span>
                      <a href="https://github.com/jimchen2/german-keyboard" target="_blank" rel="noopener noreferrer">
                        de
                      </a>
                    </div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Apps:</div>
                    <div>Settings, Nautilus, Mate Terminal, VSCode, Chrome, Clash </div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Folder Structure:</div>
                    <div>
                      <code> Code/ Downloads/ Pictures/ </code>
                      <br /> in <code>Code/</code>:<code> blog/ mlenv/</code>
                    </div>
                  </div>
                </div>
              </Row>

              <Row>
                <h5 className="border-bottom pb-1 mb-2 d-flex align-items-center">
                  <FaMobileAlt style={iconStyle} /> Smartphone
                </h5>
                <div className="small">
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Device:</div>
                    Redmi Note 13
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Apps:</div>
                    <div>Hiddify(per-app proxy), Lawnchair , Gboard, Yandex Browser(extensions), LibreOffice Viewer, VLC</div>
                  </div>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>Lawnchair:</div>
                    <a href="https://cdn.jimchen.me/3e0cd3b5edb6aae256abf6d46c9fbdfb/file..lawnchairbackup" target="_blank" rel="noopener noreferrer">
                      config and wallpaper
                    </a>
                  </div>
                </div>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Bio;
