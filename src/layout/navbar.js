"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useGlobalColorScheme } from "./theme.js";

const navLinkStyle = {
  fontSize: "1.2rem",
  fontWeight: "500",
  textDecoration: "none",
  color: "inherit",
  cursor: "pointer",
};

const ThemeSwitcher = () => {
  const { themeMode, toggleThemeMode, isHydrated } = useGlobalColorScheme();

  if (!isHydrated) return <div style={{ width: "95px" }} />;

  return (
    <span onClick={toggleThemeMode} style={navLinkStyle}>
      {themeMode === "dark" ? "Light Mode" : "Dark Mode"}
    </span>
  );
};

// Simple 3-bar hamburger icon
const HamburgerIcon = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          display: "block",
          width: "24px",
          height: "2px",
          backgroundColor: "currentColor",
          borderRadius: "2px",
        }}
      />
    ))}
  </div>
);

export default function NavigationBar() {
  const { themeMode } = useGlobalColorScheme();
  const isDark = themeMode === "dark";

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Track viewport width
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 500);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Close dropdown on route change (link click)
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: isDark ? "#212529" : "#f8f9fa",
        color: isDark ? "#f8f9fa" : "#212529",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0.85rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Always-visible brand */}
        <Link href="/" style={navLinkStyle} onClick={handleLinkClick}>
          Jim Chen&apos;s Blog
        </Link>

        {/* ── Desktop nav ── */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <Link href="/about" style={navLinkStyle}>
              About
            </Link>
            <ThemeSwitcher />
          </div>
        )}

        {/* ── Mobile hamburger + dropdown ── */}
        {isMobile && (
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "inherit",
                padding: "0.25rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <HamburgerIcon />
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 0.75rem)",
                  right: 0,
                  backgroundColor: isDark ? "#2c3035" : "#ffffff",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                  borderRadius: "0.5rem",
                  padding: "0.4rem 0",
                  minWidth: "170px",
                  zIndex: 1001,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Link
                  href="/about"
                  style={{
                    ...navLinkStyle,
                    padding: "0.65rem 1.25rem",
                    display: "block",
                  }}
                  onClick={handleLinkClick}
                >
                  About
                </Link>

                {/* Divider */}
                <hr
                  style={{
                    margin: "0.25rem 1rem",
                    border: "none",
                    borderTop: `1px solid ${isDark ? "#444" : "#ddd"}`,
                  }}
                />

                <div style={{ padding: "0.65rem 1.25rem" }}>
                  <ThemeSwitcher />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
