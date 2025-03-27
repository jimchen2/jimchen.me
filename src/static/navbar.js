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

  const handleToggleTheme = () => {
    toggleTheme(colors, updateColor);
  };
  const externalLinkIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ verticalAlign: "middle", marginLeft: "0px" }}>
      <path d="M14 3h7v7h-2V6.41L10.41 15 9 13.59 17.59 5H14V3zM5 5h4v2H5v12h12v-4h2v4c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2z" />
    </svg>
  );

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
              <Nav.Link onClick={handleToggleTheme} style={{ color: colors.color_black }}>
                Theme
              </Nav.Link>
              <Nav.Link as={Link} href="https://feed.jimchen.me" style={{ color: colors.color_black }} target="_blank" rel="noopener noreferrer">
                FreshRSS{externalLinkIcon}
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
