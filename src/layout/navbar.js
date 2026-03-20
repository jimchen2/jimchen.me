"use client";

import React from "react";
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

export default function NavigationBar() {
  const { themeMode } = useGlobalColorScheme();
  const isDark = themeMode === "dark";

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
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0.85rem 1.5rem", // slightly more padding
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <Link href="/" style={navLinkStyle}>
            Jim Chen's Blog
          </Link>
          <Link href="/about" style={navLinkStyle}>
            About
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}