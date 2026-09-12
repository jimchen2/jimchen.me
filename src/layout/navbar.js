import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import styles from "./navbar.module.css";
import { useGlobalColorScheme } from "./theme";

function ThemeSwitcher({ className = "" }) {
  const { themeMode, toggleThemeMode, isHydrated } = useGlobalColorScheme();

  if (!isHydrated) {
    return <span className={`${className} ${styles.themePlaceholder}`} aria-hidden="true" />;
  }

  const isDark = themeMode === "dark";

  return (
    <button
      type="button"
      className={`${styles.themeToggle} ${className}`}
      onClick={toggleThemeMode}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

export default function NavigationBar() {
  const router = useRouter();
  const { themeMode } = useGlobalColorScheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the dropdown when navigating, and when clicking outside it.
  useEffect(() => {
    setMenuOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <nav
      className={styles.nav}
      style={{ "--nav-bg": themeMode === "dark" ? "#212529" : "#f8f9fa", "--nav-fg": themeMode === "dark" ? "#f8f9fa" : "#212529" }}
      aria-label="Main"
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          Jim Chen&apos;s Blog
        </Link>

        {/* Desktop */}
        <div className={styles.desktopLinks}>
          <Link href="/about" className={router.pathname === "/about" ? `${styles.link} ${styles.active}` : styles.link}>
            About
          </Link>
          <ThemeSwitcher className={styles.link} />
        </div>

        {/* Mobile */}
        <div className={styles.mobileMenu} ref={menuRef}>
          <button
            type="button"
            className={styles.hamburger}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>

          {menuOpen && (
            <div className={styles.dropdown}>
              <Link href="/about" className={styles.dropdownLink}>
                About
              </Link>
              <Link href="/api/rss" className={styles.dropdownLink}>
                RSS
              </Link>
              <div className={styles.dropdownDivider} />
              <ThemeSwitcher className={styles.dropdownLink} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
