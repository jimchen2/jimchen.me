import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useGlobalColorScheme } from "@/config/global";
import { FaUser, FaLaptop, FaServer, FaMobileAlt, FaChrome, FaGlobe, FaDatabase } from "react-icons/fa";

const Bio = () => {
  const { colors } = useGlobalColorScheme();

  const infoItemStyle = {
    display: "flex",
    marginBottom: "0.25rem",
  };

  const infoLabelStyle = {
    minWidth: "120px",
    paddingRight: "0.5rem",
  };

  const iconStyle = {
    marginRight: "0.5rem",
  };

  const contentStyle = {
    fontSize: "0.9rem",
  };

  return (
    <Container fluid className="py-3">
      <br />
      <br />

      <Card
        className="mx-auto"
        style={{
          maxWidth: "900px",
          backgroundColor: colors.color_white,
          color: colors.color_black,
          border: "none",
          borderRadius: "12px",
        }}
      >
        <Card.Body className="p-3">
          <h4 className="mb-3 text-center" style={{ fontSize: "1.6rem" }}>
            Jim Chen
          </h4>
          <Row>
            <Col md={6} xs={12}>
              <Row>
                <div className="mb-3">
                  <h5 className="border-bottom pb-1 mb-2 d-flex align-items-center" style={{ fontSize: "1.25rem" }}>
                    <FaUser style={iconStyle} /> Personal Information
                  </h5>
                  <div style={contentStyle}>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Born:</div>
                      <div>March 23, 2005 (Shanghai)</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Languages:</div>
                      <div>Chinese, English, Russian</div>
                    </div>
                  </div>
                </div>
              </Row>

              <Row>
                <div>
                  <h5 className="border-bottom pb-1 mb-2 d-flex align-items-center" style={{ fontSize: "1.25rem" }}>
                    <FaGlobe style={iconStyle} /> Blog History
                  </h5>

                  <div style={contentStyle}>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>201803:</div>
                      <div>WeChat public account.</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>202209:</div>
                      <div>
                        <a href="https://jimchen.me/en/web/How-to-Build-a-Personal-Website" target="_blank" rel="noopener noreferrer">
                          Wix, Github Page.
                        </a>
                      </div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>202306:</div>
                      <div>
                        <a href="https://jimchen.me/en/web/MERN-Stack-Conclusion" target="_blank" rel="noopener noreferrer">
                          MERN stack and React Bootstrap.
                        </a>
                      </div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>202503:</div>
                      <div>
                        <a href="https://www.jimchen.me/en/web/Moving-My-Website-to-Next.js" target="_blank" rel="noopener noreferrer">
                          Next.js, add SSR.
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Row>

              <Row>
                <div>
                  <h5 className="border-bottom pb-1 mb-2 d-flex align-items-center" style={{ fontSize: "1.25rem" }}>
                    <FaDatabase style={iconStyle} /> Backup
                  </h5>
                  <div style={contentStyle}>
                    <p>Backup monthly to Cloudflare R2 and Google Drive. Keep last 3 months and once a year.</p>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Services:</div>
                      <div>
                        CDN Bucket,{" "}
                        <a href="https://github.com/settings/admin" target="_blank" rel="noopener noreferrer">
                          Github
                        </a>
                      </div>
                    </div>

                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Communication:</div>
                      <div>
                        <a href="https://takeout.google.com/" target="_blank" rel="noopener noreferrer">
                          Mail
                        </a>
                        ,{" "}
                        <a href="https://github.com/LC044/WeChatMsg" target="_blank" rel="noopener noreferrer">
                          WeChat
                        </a>
                        , QQ,{" "}
                        <a href="https://telegram.org/blog/export-and-more" target="_blank" rel="noopener noreferrer">
                          Telegram
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
            </Col>

            <Col md={6} xs={12}>
              <Row>
                <div>
                  <h5 className="border-bottom pb-1 mb-2 d-flex align-items-center" style={{ fontSize: "1.25rem" }}>
                    <FaServer style={iconStyle} /> Stack
                  </h5>
                  <div style={contentStyle}>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Hosting:</div>
                      <div>Vercel</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Database:</div>
                      <div>MongoDB, Redis</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Object Storage:</div>
                      <div>Cloudflare R2</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Proxy:</div>
                      <div>Nexitally</div>
                    </div>
                  </div>
                </div>
              </Row>

              <Row>
                <div>
                  <h5 className="border-bottom pb-1 mb-2 d-flex align-items-center" style={{ fontSize: "1.25rem" }}>
                    <FaLaptop style={iconStyle} /> Computer
                  </h5>
                  <div style={contentStyle}>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Device:</div>
                      <div>ThinkPad P16s (Fedora), Redmi Book</div>
                    </div>

                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>DE:</div>
                      <div>Gnome</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Theme:</div>
                      <div>
                        <a href="https://cdn.jimchen.me/1f248d63b06665c084a5119a350e94bc/img.png" target="_blank" rel="noopener noreferrer">
                          Apps
                        </a>
                        {", "}
                        <a href="https://cdn.jimchen.me/96c5f4bc0a3766eff967cb508b1d0cab/dconf-settings.txt" target="_blank" rel="noopener noreferrer">
                          Dconf
                        </a>
                        {", "}
                        <a href="https://cdn.jimchen.me/09128349328u40982mu30948m24u23984mu2983mu4/IMG_1005.JPEG" target="_blank" rel="noopener noreferrer">
                          Wallpaper
                        </a>
                      </div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Browser:</div>
                      <div>
                        <a href="https://github.com/jimchen2/userscripts" target="_blank" rel="noopener noreferrer">
                          <span>My Userscripts</span>
                        </a>
                        {", "}
                        <a href="https://cdn.jimchen.me/11ca71442a9b87d3a51828bddaa44087.txt" target="_blank" rel="noopener noreferrer">
                          <span>Site Settings</span>
                        </a>
                        {", "}
                        <a href="https://cdn.jimchen.me/d2e18f4893ef9a61fe5944720259e119/policies.json" target="_blank" rel="noopener noreferrer">
                          <span>Policies</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Row>

              <Row>
                <div>
                  <h5 className="border-bottom pb-1 mb-2 d-flex align-items-center" style={{ fontSize: "1.25rem" }}>
                    <FaMobileAlt style={iconStyle} /> Smartphone
                  </h5>
                  <div style={contentStyle}>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Device:</div>
                      <div>Redmi Note 13, Pixel Pro 8</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Launcher:</div>
                      <div>Lawnchair</div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>Theme:</div>
                      <div>
                        <a href="https://cdn.jimchen.me/8d64d9cc7264d75bab96cd0222866f93/img.jpg" target="_blank" rel="noopener noreferrer">
                          Apps
                        </a>
                        {", "}
                        <a href="https://cdn.jimchen.me/3e0cd3b5edb6aae256abf6d46c9fbdfb/file..lawnchairbackup" target="_blank" rel="noopener noreferrer">
                          Config and Wallpaper
                        </a>
                      </div>
                    </div>
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
