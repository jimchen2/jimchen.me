"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Container, Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { useGlobalColorScheme } from "../config/global";
import { toggleTheme } from "../config/global";

function NavBar() {
  const { colors, updateColor } = useGlobalColorScheme();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef(null);

  // Sync searchTerm with URL on mount or route change
  useEffect(() => {
    if (!pathname) return; // Exit early if pathname is null or undefined

    // Extract search term from URL (e.g., /search/something)
    const pathParts = pathname.split("/"); // Split the pathname into parts
    const searchQuery = pathParts[pathParts.length - 1]; // Get the last part (search term)
    if (pathname.startsWith("/search") && searchQuery) {
      setSearchTerm(decodeURIComponent(searchQuery)); // Decode and set search term
    } else {
      setSearchTerm(""); // Clear search term if not on a search route
    }
  }, [pathname]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search/${encodeURIComponent(searchTerm)}`);
      // Do not clear searchTerm to keep it in the search bar
    }
  };

  const handleToggleTheme = () => {
    toggleTheme(colors, updateColor);
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{
        backgroundColor: colors.color_light_gray,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Container style={{ maxWidth: "1140px" }}>
        <Navbar.Brand
          as={Link}
          href="/"
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

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto" style={{ fontWeight: "300", fontFamily: "'Ubuntu', sans-serif" }}>
            <Nav.Link
              as={Link}
              href="/about"
              style={{
                color: colors.color_black,
                transition: "color 0.3s ease, transform 0.3s ease",
              }}
              className="me-lg-3 my-2 my-lg-0"
              onMouseEnter={(e) => {
                e.target.style.color = colors.color_blue;
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = colors.color_black;
                e.target.style.transform = "scale(1)";
              }}
            >
              About
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/"
              style={{
                color: colors.color_black,
                transition: "color 0.3s ease, transform 0.3s ease",
              }}
              className="me-lg-3 my-2 my-lg-0"
              onMouseEnter={(e) => {
                e.target.style.color = colors.color_blue;
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = colors.color_black;
                e.target.style.transform = "scale(1)";
              }}
            >
              Blog
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/comments"
              style={{
                color: colors.color_black,
                transition: "color 0.3s ease, transform 0.3s ease",
              }}
              className="me-lg-3 my-2 my-lg-0"
              onMouseEnter={(e) => {
                e.target.style.color = colors.color_blue;
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = colors.color_black;
                e.target.style.transform = "scale(1)";
              }}
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
              onMouseEnter={(e) => {
                e.target.style.color = colors.color_blue;
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = colors.color_black;
                e.target.style.transform = "scale(1)";
              }}
            >
              Theme
            </Nav.Link>

            {/* Search Form */}
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
  );
}

export default NavBar;