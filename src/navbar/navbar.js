// components/NavBar.js

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useGlobalColorScheme } from "../config/global";
// Removed toggleTheme import
import { FaComments } from "react-icons/fa"; // Removed FaPalette import

function NavBar() {
  const { colors } = useGlobalColorScheme(); // Removed updateColor as it's no longer used here
  const pathname = usePathname();

  // Removed handleToggleTheme function

  const isActive = (href) => {
    if (!pathname) return false;
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Top Navbar */}
      <Navbar
        fixed="top"
        style={{
          backgroundColor: colors.color_light_gray,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        <Container style={{ maxWidth: "1140px" }}>
          <Navbar.Brand
            as={Link}
            href="/"
            className="d-lg-block"
            style={{
              color: colors.color_black,
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: "300",
              marginLeft: "15%",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = colors.color_blue)}
            onMouseLeave={(e) => (e.target.style.color = colors.color_black)}
          >
            Jim Chen's Blog
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler d-lg-none" />
          <Navbar.Collapse id="basic-navbar-nav" className="d-lg-flex">
            <Nav className="ms-auto d-none d-lg-flex" style={{ fontWeight: "300", fontFamily: "'Ubuntu', sans-serif" }}>
              <Nav.Link as={Link} href="/comments" style={{ color: isActive("/comments") ? colors.color_blue : colors.color_black }} className="me-lg-3 my-2 my-lg-0">
                Comments
              </Nav.Link>
              {/* Theme Nav.Link has been removed */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Bottom Bar */}
      <div
        className="d-lg-none"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.color_light_gray,
          boxShadow: "0 -2px 4px rgba(0,0,0,0.1)",
          zIndex: 1000,
          padding: "0.5rem 0",
        }}
      >
        <Container>
          <Nav className="d-flex" style={{ fontWeight: "300", fontFamily: "'Ubuntu', sans-serif", fontSize: "0.8rem" }}>
            <Nav.Link
              as={Link}
              href="/comments"
              style={{
                color: isActive("/comments") ? colors.color_blue : colors.color_black,
                backgroundColor: isActive("/comments") ? colors.color_white : "transparent",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                width: "100%", // Adjusted for 1 item
              }}
            >
              <FaComments size={24} style={{ marginBottom: "0.2rem" }} />
              Comments
            </Nav.Link>
            {/* Theme Nav.Link has been removed */}
          </Nav>
        </Container>
      </div>
      <style jsx>{`
        @media (max-width: 991px) {
          .custom-toggler {
            margin-right: 15px;
          }
        }
      `}</style>
    </>
  );
}

export default NavBar;