'use client'; 

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container, Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import NavbarHelper from "./navbarhelper";
import { useGlobalColorScheme } from "../config/global";

function NavBar() {
  const { colors, updateColor } = useGlobalColorScheme();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    router.push(`/search/${searchTerm}`);
  };

  const toggleTheme = () => {
    if (colors.dark === false && colors.color_light_gray === "#fffcfc") {
      updateColor("color_white", "#1a1a1a");
      updateColor("color_black", "#ffffff");
      updateColor("color_blue", "#00ff00");
      updateColor("color_light_gray", "#333333");
      updateColor("color_gray", "#282828");
      updateColor("grayscale", false);
      updateColor("dark", true);
    } else if (colors.dark === true) {
      updateColor("color_white", "#FFF0F5"); // Lavender Blush (light background)
      updateColor("color_black", "#8A2BE2"); // Indigo (text color)
      updateColor("color_blue", "#FF1493"); // Hot Pink
      updateColor("color_light_gray", "#FFD1DC"); // Pastel Pink
      updateColor("color_gray", "#FFC0CB"); // Pink (lighter gray)
      updateColor("grayscale", false);
      updateColor("dark", false);
    } else {
      updateColor("color_white", "#ffffff");
      updateColor("color_black", "#000000");
      updateColor("color_blue", "#000000");
      updateColor("color_light_gray", "#fffcfc");
      updateColor("color_gray", "#d0d4dc");
      updateColor("grayscale", false);
      updateColor("dark", false);
    }
  };

  return (
    <>
      <style type="text/css">
        {`
    .navbar-toggler-icon {
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='gray' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E") !important;
    }
    .navbar-toggler {
      border-color: lightgray !important;
    }
  `}
      </style>

      <NavbarHelper />
      <Navbar
        expand="lg"
        fixed="top"
        style={{
          backgroundColor: colors.color_light_gray,
        }}
      >
        <Container>
          <Navbar.Brand className="navbar-brand-spacing black-text">
            <Nav.Link as={Link} href="/" style={{ color: colors.color_black }}>
              Jim Chen's Website
            </Nav.Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} href="/about" style={{ color: colors.color_black }}>
                About
              </Nav.Link>

              <Nav.Link as={Link} href="/" style={{ color: colors.color_black }}>
                Blog
              </Nav.Link>
              <Nav.Link as={Link} href="/comments" style={{ color: colors.color_black }}>
                Comments
              </Nav.Link>
              <Nav.Link onClick={toggleTheme} style={{ color: colors.color_black }}>
                Theme
              </Nav.Link>
            </Nav>
            <Form className="d-flex" onSubmit={handleSearchSubmit}>
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2 custom-placeholder"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  color: colors.color_black,
                  borderColor: colors.color_black,
                  backgroundColor: colors.color_white,
                }}
              />
              <Button variant="outline-primary" type="submit" className="custom-search-button">
                Search
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;