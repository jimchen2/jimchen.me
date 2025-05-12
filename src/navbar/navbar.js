"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Container, Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { useGlobalColorScheme } from "../config/global";
import { toggleTheme } from "../config/global";
import { FaSearch, FaInfoCircle, FaBlog, FaComments, FaPalette } from "react-icons/fa"; // Added icons for nav items

function NavBar() {
  const { colors, updateColor } = useGlobalColorScheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef(null);

  // Sync searchTerm with URL on mount or route change
  useEffect(() => {
    if (!pathname) return;

    const pathParts = pathname.split("/");
    const searchQuery = pathParts[pathParts.length - 1];
    if (pathname.startsWith("/search") && searchQuery) {
      setSearchTerm(decodeURIComponent(searchQuery));
    } else {
      setSearchTerm("");
    }
  }, [pathname]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search/${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
    }
  };

  const handleToggleTheme = () => {
    toggleTheme(colors, updateColor);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 0);
    }
  };

  // Determine if a nav link is active based on pathname
  const isActive = (href) => {
    if (!pathname) return false; // Add this check to prevent the error
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Top Navbar for both desktop and mobile */}
      <Navbar
        fixed="top"
        style={{
          backgroundColor: colors.color_light_gray,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        <Container style={{ maxWidth: "1140px" }}>
          {!isSearchOpen && (
            <>
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
                Jim Chen's Website
              </Navbar.Brand>

              {/* Mobile Search Icon */}
              <div className="d-lg-none">
                <Button
                  variant="link"
                  onClick={toggleSearch}
                  style={{
                    color: colors.color_black,
                    padding: "0.5rem",
                  }}
                  aria-label="Search"
                >
                  <FaSearch size={20} />
                </Button>
              </div>
            </>
          )}

          {/* Mobile Search Bar (takes over top bar when open) */}
          {isSearchOpen && (
            <Container className="d-lg-none py-2" style={{ backgroundColor: colors.color_light_gray }}>
              <Form onSubmit={handleSearchSubmit} className="d-flex align-items-center">
                <FormControl
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search..."
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    color: colors.color_black,
                    borderColor: colors.color_black,
                    backgroundColor: colors.color_white,
                    fontFamily: "'Ubuntu', sans-serif",
                    flex: 1,
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.color_blue;
                    e.target.style.boxShadow = `0 0 5px ${colors.color_blue}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.color_black;
                    e.target.style.boxShadow = "none";
                  }}
                />
                <Button
                  variant="link"
                  onClick={toggleSearch}
                  style={{
                    color: colors.color_black,
                    marginLeft: "0.5rem",
                  }}
                  aria-label="Cancel search"
                >
                  Cancel
                </Button>
              </Form>
            </Container>
          )}

          {/* Desktop Navbar Toggle and Collapse */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler d-lg-none" />
          <Navbar.Collapse id="basic-navbar-nav" className="d-lg-flex">
            <Nav className="ms-auto d-none d-lg-flex" style={{ fontWeight: "300", fontFamily: "'Ubuntu', sans-serif" }}>
              <Nav.Link
                as={Link}
                href="/about"
                style={{
                  color: isActive("/about") ? colors.color_blue : colors.color_black,
                  transition: "color 0.3s ease, transform 0.3s ease",
                }}
                className="me-lg-3 my-2 my-lg-0"
              >
                About
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/"
                style={{
                  color: isActive("/") ? colors.color_blue : colors.color_black,
                  transition: "color 0.3s ease, transform 0.3s ease",
                }}
                className="me-lg-3 my-2 my-lg-0"
              >
                Blog
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/comments"
                style={{
                  color: isActive("/comments") ? colors.color_blue : colors.color_black,
                  transition: "color 0.3s ease, transform 0.3s ease",
                }}
                className="me-lg-3 my-2 my-lg-0"
              >
                Comments
              </Nav.Link>
              <Nav.Link
                onClick={handleToggleTheme}
                style={{
                  color: colors.color_black,
                  transition: "color 0.3s ease, transform 0.3s ease",
                }}
                className="me-lg-3 my-2 my-lg-0"
              >
                Theme
              </Nav.Link>

              {/* Desktop Search Form */}
              <Form className="d-flex mt-2 mt-lg-0" onSubmit={handleSearchSubmit}>
                <FormControl
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search..."
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    color: colors.color_black,
                    borderColor: colors.color_black,
                    backgroundColor: colors.color_white,
                    fontFamily: "'Ubuntu', sans-serif",
                    maxWidth: "200px",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  className="me-2"
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.color_blue;
                    e.target.style.boxShadow = `0 0 5px ${colors.color_blue}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.color_black;
                    e.target.style.boxShadow = "none";
                  }}
                />
                <Button
                  variant="outline-primary"
                  type="submit"
                  style={{
                    backgroundColor: colors.color_white,
                    color: colors.color_blue,
                    borderColor: colors.color_blue,
                    fontFamily: "'Ubuntu', sans-serif",
                    transition: "background-color 0.3s ease, color 0.3s ease, transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.color_blue;
                    e.target.style.color = colors.color_white;
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.color_white;
                    e.target.style.color = colors.color_blue;
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  Search
                </Button>
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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
          <Nav
            className="d-flex"
            style={{
              fontWeight: "300",
              fontFamily: "'Ubuntu', sans-serif",
              fontSize: "0.8rem",
            }}
          >
            <Nav.Link
              as={Link}
              href="/about"
              style={{
                color: isActive("/about") ? colors.color_blue : colors.color_black,
                backgroundColor: isActive("/about") ? colors.color_white : "transparent",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                width: "25%",
              }}
            >
              <FaInfoCircle size={24} style={{ marginBottom: "0.2rem" }} />
              About
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/"
              style={{
                color: isActive("/") ? colors.color_blue : colors.color_black,
                backgroundColor: isActive("/") ? colors.color_white : "transparent",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                width: "25%",
              }}
            >
              <FaBlog size={24} style={{ marginBottom: "0.2rem" }} />
              Blog
            </Nav.Link>
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
                width: "25%",
              }}
            >
              <FaComments size={24} style={{ marginBottom: "0.2rem" }} />
              Comments
            </Nav.Link>
            <Nav.Link
              onClick={handleToggleTheme}
              style={{
                color: colors.color_black,
                backgroundColor: "transparent",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                width: "25%",
              }}
            >
              <FaPalette size={24} style={{ marginBottom: "0.2rem" }} />
              Theme
            </Nav.Link>
          </Nav>
        </Container>
      </div>
      {/* CSS for Responsive Behavior */}
      <style jsx>{`
        @media (max-width: 991px) {
          .custom-toggler {
            margin-right: 15px;
          }
          .navbar-brand {
            display: ${isSearchOpen ? "none" : "block"};
          }
        }
      `}</style>
    </>
  );
}

export default NavBar;
