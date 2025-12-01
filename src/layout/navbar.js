"use client";

import React from "react";
import Link from "next/link";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useGlobalColorScheme } from "./theme.js";

// --- ThemeSwitcher Component ---
const ThemeSwitcher = () => {
  const { themeMode, toggleThemeMode, isHydrated } = useGlobalColorScheme();

  // Render a placeholder to avoid layout shift while waiting for hydration
  if (!isHydrated) {
    return <div style={{ width: "125px", height: "28px" }} />; // Matches container size
  }

  return (
    <>
      <div className="switch-container">
        <input
          type="checkbox"
          id="mode-switch"
          className="switch-checkbox"
          onChange={toggleThemeMode}
          checked={themeMode === "dark"}
          aria-label="Toggle dark mode"
        />
        <label htmlFor="mode-switch" className="switch-label">
          Toggle
        </label>
        <span className="theme-icon">{themeMode === "dark" ? "🌙" : "☀️"}</span>
      </div>

      <style jsx>{`
        /* The switch container */
        .switch-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Theme icon styling */
        .theme-icon {
          font-size: 20px;
        }

        /* Hide the default checkbox */
        .switch-checkbox {
          height: 0;
          width: 0;
          visibility: hidden;
        }

        /* The switch label, which is the track of the switch */
        .switch-label {
          cursor: pointer;
          text-indent: -9999px; /* Hide the label text */
          width: 50px;
          height: 28px;
          background: grey;
          display: block;
          border-radius: 100px;
          position: relative;
          transition: background-color 0.3s;
          margin-bottom: 0; /* Override default bootstrap label margin */
        }

        /* The knob of the switch */
        .switch-label:after {
          content: "";
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          background: #fff;
          border-radius: 90px;
          transition: 0.3s;
        }

        /* When the checkbox is checked, change the background of the label */
        .switch-checkbox:checked + .switch-label {
          background: #4caf50; /* A nice green for 'on' state */
        }

        /* When the checkbox is checked, move the knob to the right */
        .switch-checkbox:checked + .switch-label:after {
          /* (width of track - width of knob - 2 * left offset) */
          /* 50px - 22px - (2 * 3px) = 22px */
          transform: translateX(22px);
        }
      `}</style>
    </>
  );
};

// --- NavigationBar Component ---
function NavigationBar() {
  const { themeMode } = useGlobalColorScheme();

  return (
    <>
      <Navbar
        fixed="top"
        variant={themeMode === "dark" ? "dark" : "light"}
        bg={themeMode === "dark" ? "dark" : "light"}
        expand="lg"
        style={{
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
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: "300",
              marginLeft: "15%",
            }}
          >
            Jim Chen's Blog
          </Navbar.Brand>

          {/* Add the ThemeSwitcher to the right side of the navbar */}
          <Nav className="ms-auto d-flex align-items-center">
            <ThemeSwitcher />
          </Nav>
        </Container>
      </Navbar>

      <style jsx>{`
        @media (max-width: 991px) {
          .custom-toggler {
            margin-right: 15px;
          }
          .navbar-brand {
            margin-left: 10px !important;
          }
          .navbar-collapse {
            margin-top: 10px;
          }
        }
      `}</style>
    </>
  );
}

export default NavigationBar;
