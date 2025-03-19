"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container, Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import NavbarHelper from "./navbarhelper";
import { useGlobalColorScheme } from "../config/global";
import { toggleTheme } from "../config/global";

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

  // Create a handler that passes colors and updateColor to toggleTheme
  const handleToggleTheme = () => {
    toggleTheme(colors, updateColor);
  };

  return (
    <>
      <style type="text/css">{/* your styles */}</style>

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
              {/* Updated to use the handler */}
              <Nav.Link onClick={handleToggleTheme} style={{ color: colors.color_black }}>
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
