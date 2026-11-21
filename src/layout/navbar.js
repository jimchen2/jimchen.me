"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sun, Moon, Square, Check } from "lucide-react";
import { useGlobalColorScheme } from "./theme.js";

const navLinkStyle = {
  fontSize: "1.2rem",
  fontWeight: "500",
  textDecoration: "none",
  color: "inherit",
  cursor: "pointer",
};

const THEME_OPTIONS = [
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
  { id: "brutalist", label: "Brutalist", Icon: Square },
];

/* Compact icon button that opens a small "pick a theme" menu. */
const ThemeSwitcher = ({ onSelect }) => {
  const { themeMode, changeThemeMode, isHydrated } = useGlobalColorScheme();
  const isDark = themeMode === "dark";

  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);

  const current =
    THEME_OPTIONS.find((t) => t.id === themeMode) || THEME_OPTIONS[0];
  const ActiveIcon = current.Icon;

  // Close on outside click / Escape, and move focus with arrow keys.
  useEffect(() => {
    if (!open) return undefined;

    const handleOutsideClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const items = Array.from(
          wrapRef.current?.querySelectorAll('[role="menuitemradio"]') || []
        );
        if (!items.length) return;
        e.preventDefault();
        const at = items.indexOf(document.activeElement);
        const step = e.key === "ArrowDown" ? 1 : -1;
        const nextAt = at === -1 ? 0 : (at + step + items.length) % items.length;
        items[nextAt]?.focus();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // Land focus on the current choice when the menu opens.
  useEffect(() => {
    if (!open) return;
    const items = wrapRef.current?.querySelectorAll('[role="menuitemradio"]');
    const checked = wrapRef.current?.querySelector('[aria-checked="true"]');
    (checked || items?.[0])?.focus();
  }, [open]);

  const choose = (id) => {
    changeThemeMode(id);
    setOpen(false);
    onSelect?.();
  };

  const panelStyle = {
    position: "absolute",
    top: "calc(100% + 6px)",
    right: 0,
    minWidth: "9.5rem",
    padding: "4px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    backgroundColor: isDark ? "#2c3035" : "#ffffff",
    border: `1px solid ${isDark ? "#41474d" : "rgba(0, 0, 0, 0.12)"}`,
    borderRadius: "8px",
    boxShadow: isDark
      ? "0 6px 18px rgba(0, 0, 0, 0.45)"
      : "0 6px 18px rgba(0, 0, 0, 0.12)",
    zIndex: 1002,
  };

  const itemStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.55rem",
    width: "100%",
    padding: "0.4rem 0.5rem",
    border: "none",
    borderRadius: "6px",
    backgroundColor: isActive
      ? isDark
        ? "rgba(255, 255, 255, 0.12)"
        : "rgba(0, 0, 0, 0.055)"
      : "transparent",
    color: isDark ? "#f1f3f5" : "#212529",
    fontSize: "0.875rem",
    fontWeight: isActive ? 600 : 400,
    lineHeight: 1.2,
    textAlign: "left",
    cursor: "pointer",
  });

  return (
    <div ref={wrapRef} className="theme-menu">
      <button
        ref={triggerRef}
        type="button"
        className="theme-switcher-btn"
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Change theme"
        disabled={!isHydrated}
        onClick={() => setOpen((prev) => !prev)}
      >
        <ActiveIcon size={17} strokeWidth={2} aria-hidden="true" />
      </button>

      {open && (
        <div className="theme-menu__panel" role="menu" aria-label="Theme" style={panelStyle}>
          {THEME_OPTIONS.map(({ id, label, Icon }) => {
            const isActive = id === current.id;
            return (
              <button
                key={id}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                className={`theme-menu__item${isActive ? " is-active" : ""}`}
                style={itemStyle(isActive)}
                onClick={() => choose(id)}
              >
                <Icon size={14} strokeWidth={2} aria-hidden="true" />
                <span style={{ flex: 1 }}>{label}</span>
                {isActive && <Check size={14} strokeWidth={2.5} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
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
      className="site-nav"
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
        <Link href="/" className="site-brand" style={navLinkStyle} onClick={handleLinkClick}>
          Jim Chen&apos;s Blog
        </Link>

        {/* ── Desktop nav ── */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <Link href="/about" className="site-nav-link" style={navLinkStyle}>
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
                className="mobile-menu"
                style={{
                  position: "absolute",
                  top: "calc(100% + 0.75rem)",
                  right: 0,
                  backgroundColor: isDark ? "#2c3035" : "#ffffff",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                  borderRadius: "0.5rem",
                  padding: "0.4rem 0",
                  minWidth: "220px",
                  zIndex: 1001,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Link
                  href="/about"
                  className="site-nav-link"
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

                <div
                  className="mobile-menu__theme-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    padding: "0.5rem 1.25rem 0.6rem",
                  }}
                >
                  <span
                    className="mobile-menu__theme-label"
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: isDark ? "#adb5bd" : "#6c757d",
                    }}
                  >
                    Theme
                  </span>
                  <ThemeSwitcher onSelect={handleLinkClick} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
