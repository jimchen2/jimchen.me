import React, { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  FaSearch,
  FaTags,
  FaUser,
  FaTelegram,
  FaYoutube,
  FaArchive,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaBlog,
  FaWeixin,
  FaQq,
  FaRProject,
  FaTiktok, // Import the TikTok icon
} from "react-icons/fa";
import { SiOpenstreetmap, SiGoodreads, SiHuggingface, SiGreasyfork } from "react-icons/si";
import styles from "./sidebar.module.css";

const EXTERNAL_LINKS = [
  { name: "Email", url: "mailto:jimchen4214@gmail.com", icon: FaEnvelope, color: "#EA4335" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/jim-chen-588002255/", icon: FaLinkedin, color: "#0077B5" },
  { name: "GitHub", url: "https://github.com/jimchen2", icon: FaGithub, color: "#333333" },
];

const SOCIAL_MEDIA_LINKS = [
  { name: "Telegram", url: "https://t.me/Jimchen4214", icon: FaTelegram, color: "#0088cc" },
  { name: "TikTok", url: "https://www.tiktok.com/@jimchen.me", icon: FaTiktok, color: "#000000" }, 
  { name: "Instagram", url: "https://www.instagram.com/jimchen.me", icon: FaInstagram, color: "#E4405F" },
  { name: "YouTube", url: "https://www.youtube.com/@jimchen4214", icon: FaYoutube, color: "#FF0000" },
  { name: "WeChat", url: "https://jimchen.me/weixin.jpg", icon: FaWeixin, color: "#07C160" },
];


const NAV_ITEMS = [
  { href: "/about", label: "About Me", icon: <FaUser /> },
  { href: "/", label: "My Blog", icon: <FaBlog /> },
  { href: "/tags", label: "All Tags", icon: <FaTags /> },
  { href: "/projects", label: "Projects", icon: <FaRProject /> },
];

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
          style={{ "--hover-bg": color }}
          title={name}
          aria-label={`Visit ${name}`}
        >
          <Icon size={15} />
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

  useEffect(() => {
    const query = searchParams.get("searchterm");
    setSearchTerm(query ? decodeURIComponent(query) : "");
  }, [searchParams]);

  const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);

 const handleSearchSubmit = useCallback(
  (event) => {
    event.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    const newParams = new URLSearchParams();

    if (trimmedSearchTerm) {
      newParams.set("searchterm", trimmedSearchTerm);
    }

    router.push(`/?${newParams.toString()}`);
  },
  [searchTerm, router]
);

  return (
    <aside className={styles.sidebar} role="complementary">
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <div className={styles.searchInputGroup}>
          <input
            type="search"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
            aria-label="Search"
            style={{ fontSize: "15px", padding: "6px 10px" }}
          />
          <button
            type="submit"
            className={styles.searchButton}
            aria-label="Submit search"
            style={{ padding: "6px 12px" }}
          >
            <FaSearch size={12} />
          </button>
        </div>
      </form>

      <nav className={styles.mainNav}>
        {NAV_ITEMS.map(({ href, label, icon }) => (
          <Link href={href} key={href} passHref legacyBehavior>
            <a className={styles.navItem} style={{ fontSize: "15px", padding: "6px 12px" }}>
              <span className={styles.navItemIcon} style={{ fontSize: "13px" }}>
                {icon}
              </span>
              <span className={styles.navItemLabel}>{label}</span>
            </a>
          </Link>
        ))}
      </nav>

      <ConnectLinks title="Profile" links={EXTERNAL_LINKS} />
      <ConnectLinks title="Social Media" links={SOCIAL_MEDIA_LINKS} />
    </aside>
  );
};

export default memo(Sidebar);
