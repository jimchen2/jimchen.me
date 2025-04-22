"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container, Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { useGlobalColorScheme } from "../config/global";
import { toggleTheme } from "../config/global";

function NavBar() {
  const { colors, updateColor } = useGlobalColorScheme();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchInputRef = useRef(null);

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
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === '/' && 
        document.activeElement.tagName !== 'INPUT' && 
        document.activeElement.tagName !== 'TEXTAREA'
      ) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <>
      <Navbar
        expand="lg"
        fixed="top"
        style={{
          backgroundColor: colors.color_light_gray,
        }}
      >
        <Container>
          <Navbar.Brand style={{ color: colors.color_black, marginRight: window.innerWidth >= 768 ? "10rem" : "" }}>
            <Nav.Link as={Link} href="/" style={{ color: colors.color_black }}>
              Jim Chen's Website
            </Nav.Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} href="/" style={{ color: colors.color_black }}>
                Blog
              </Nav.Link>
              <Nav.Link as={Link} href="/comments" style={{ color: colors.color_black }}>
                Comments
              </Nav.Link>
              <Nav.Link onClick={handleToggleTheme} style={{ color: colors.color_black }}>
                Theme
              </Nav.Link>
            </Nav>
            <Form className="d-flex" onSubmit={handleSearchSubmit}>
              <FormControl
                ref={searchInputRef}
                type="search"
                placeholder="Press '/' to jump here"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  color: colors.color_black,
                  borderColor: colors.color_black,
                  backgroundColor: colors.color_white,
                  "::placeholder": { color: colors.color_black },
                }}
              />
              <Button
                variant="outline-primary"
                type="submit"
                style={{
                  backgroundColor: colors.color_white,
                  color: colors.color_blue,
                  ":hover": {
                    backgroundColor: colors.color_blue,
                    color: colors.color_white,
                    borderColor: colors.color_blue,
                  },
                }}
              >
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
