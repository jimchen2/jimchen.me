import React, { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { 
  FaSearch, FaTags, FaComments, FaUser, 
  FaTelegram, FaYoutube, FaArchive, 
  FaEnvelope, FaLinkedin, FaGithub 
} from "react-icons/fa";
import styles from "./sidebar.module.css"; // Import CSS module

// Constants remain the same, as they are well-organized data
const SOCIAL_MEDIA_LINKS = [
  { name: "Telegram", url: "https://t.me/Jimchen4214", icon: FaTelegram, color: "#0088cc" },
  { name: "YouTube", url: "https://www.youtube.com/@jimchen4214", icon: FaYoutube, color: "#FF0000" },
  { name: "Archive.org", url: "https://archive.org/details/@j_c561", icon: FaArchive, color: "#333333" },
];

const EXTERNAL_LINKS = [
  { name: "Email", url: "mailto:jimchen4214@gmail.com", icon: FaEnvelope, color: "#EA4335" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/jim-chen-588002255/", icon: FaLinkedin, color: "#0077B5" },
  { name: "GitHub", url: "https://github.com/jimchen2", icon: FaGithub, color: "#333333" },
];

const NAV_ITEMS = [
  { href: "/tags", label: "All Tags", icon: <FaTags /> },
  { href: "/comments", label: "Comments", icon: <FaComments /> },
  { href: "/about", label: "About Me", icon: <FaUser /> },
];

// Helper component for link sections to avoid repetition
const ConnectLinks = ({ title, links }) => (
  <div className={styles.connectSection}>
    <h6 className={styles.sectionTitle}>{title}</h6>
    <div className={styles.connectLinksContainer}>
      {links.map(({ name, url, icon: Icon, color }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.connectLink}
          style={{ '--hover-bg': color }} // CSS Custom Property for dynamic hover color
          title={name}
          aria-label={`Visit ${name}`}
        >
          <Icon size={20} />
        </a>
      ))}
    </div>
  </div>
);

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Effect to sync search input with URL query parameter
  useEffect(() => {
    const query = searchParams.get("searchterm");
    setSearchTerm(query ? decodeURIComponent(query) : "");
  }, [searchParams]);

  const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);

  const handleSearchSubmit = useCallback((event) => {
    event.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    const newParams = new URLSearchParams(searchParams.toString());

    if (trimmedSearchTerm) {
      newParams.set("searchterm", trimmedSearchTerm);
    } else {
      newParams.delete("searchterm");
    }

    // Only push router if the search term has actually changed
    if (newParams.get("searchterm") !== searchParams.get("searchterm")) {
        router.push(`${pathname}?${newParams.toString()}`);
    }
  }, [searchTerm, searchParams, pathname, router]);

  return (
    <aside className={styles.sidebar} role="complementary">
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <div className={styles.searchInputGroup}>
          <input
            type="search"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
            aria-label="Search"
          />
          <button type="submit" className={styles.searchButton} aria-label="Submit search">
            <FaSearch />
          </button>
        </div>
      </form>

      {/* Navigation Links */}
      <nav className={styles.mainNav}>
        {NAV_ITEMS.map(({ href, label, icon }) => (
          <Link href={href} key={href} passHref legacyBehavior>
            <a className={styles.navItem}>
              <span className={styles.navItemIcon}>{icon}</span>
              <span className={styles.navItemLabel}>{label}</span>
            </a>
          </Link>
        ))}
      </nav>
      
      {/* Connect & Social Links */}
      <ConnectLinks title="Profile" links={EXTERNAL_LINKS} />
      <ConnectLinks title="Social Media" links={SOCIAL_MEDIA_LINKS} />
      
      {/* Global styles can be moved to a global CSS file like _app.js or globals.css */}
    </aside>
  );
};

export default memo(Sidebar);