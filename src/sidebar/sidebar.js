import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { 
  Form, 
  InputGroup, 
  Button, 
  Nav, 
  Container,
  Row,
  Col 
} from "react-bootstrap";
import { 
  FaSearch, FaTags, FaComments, FaUser, 
  FaTelegram, FaYoutube, FaArchive, 
  FaEnvelope, FaLinkedin, FaGithub 
} from "react-icons/fa";

// ============= Constants =============
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

// ============= Styles =============
const styles = {
  sidebar: {
    background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
    borderRadius: "24px",
    height: "100%",
    padding: "2rem",
    transition: "box-shadow 0.3s ease",
  },
  sidebarHover: {
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
  },
  searchForm: {
    marginBottom: "1.5rem",
  },
  searchInputGroup: {
    borderRadius: "12px",
    overflow: "hidden",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  searchInputGroupFocused: {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 20px rgba(13, 110, 253, 0.15)",
  },
  searchInput: {
    border: "2px solid #e9ecef",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    transition: "all 0.2s ease",
  },
  searchInputFocused: {
    borderColor: "#0d6efd",
    boxShadow: "none",
    outline: "none",
  },
  searchButton: {
    padding: "0 1.5rem",
    background: "#0d6efd",
    border: "none",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },
  searchButtonHover: {
    background: "#0b5ed7",
    transform: "translateX(2px)",
  },
  navItem: {
    textDecoration: "none",
    color: "inherit",
    marginBottom: "0.75rem",
  },
  navItemContent: {
    display: "flex",
    alignItems: "center",
    padding: "1rem 1.25rem",
    borderRadius: "12px",
    background: "transparent",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
  },
  navItemContentHover: {
    background: "rgba(13, 110, 253, 0.08)",
    transform: "translateX(8px)",
  },
  navItemIcon: {
    fontSize: "1.25rem",
    marginRight: "1rem",
    color: "#6c757d",
    transition: "all 0.3s ease",
  },
  navItemIconHover: {
    color: "#0d6efd",
    transform: "scale(1.1)",
  },
  navItemLabel: {
    fontWeight: 500,
    color: "#495057",
    transition: "all 0.3s ease",
    margin: 0,
  },
  navItemLabelHover: {
    color: "#0d6efd",
  },
  connectSection: {
    marginTop: "1.5rem",
  },
  sectionTitle: {
    fontWeight: 600,
    color: "#6c757d",
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "1rem",
    paddingLeft: "0.5rem",
  },
  connectLinksContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
  connectLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    backgroundColor: "#f1f3f5",
    color: "#495057",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    textDecoration: "none",
  },
  connectLinkHover: (color) => ({
    transform: "translateY(-3px) scale(1.05)",
    color: "#fff",
    backgroundColor: color,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  }),
};

// ============= Sub-components =============

// Memoized search component
const SearchComponent = memo(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const query = searchParams.get("searchterm");
    setSearchTerm(query ? decodeURIComponent(query) : "");
  }, [searchParams]);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSearchSubmit = useCallback((event) => {
    event.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    
    if (!trimmedSearchTerm && !searchParams.has("searchterm")) {
      return;
    }

    const newParams = new URLSearchParams(searchParams.toString());

    if (trimmedSearchTerm) {
      newParams.set("searchterm", trimmedSearchTerm);
    } else {
      newParams.delete("searchterm");
    }
    
    router.push(`${pathname}?${newParams.toString()}`);
  }, [searchTerm, searchParams, pathname, router]);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  return (
    <Form onSubmit={handleSearchSubmit} style={styles.searchForm}>
      <InputGroup 
        style={{
          ...styles.searchInputGroup,
          ...(isFocused ? styles.searchInputGroupFocused : {})
        }}
      >
        <Form.Control
          ref={searchInputRef}
          type="search"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            ...styles.searchInput,
            ...(isFocused ? styles.searchInputFocused : {})
          }}
          aria-label="Search"
        />
        <Button 
          variant="primary" 
          type="submit"
          style={{
            ...styles.searchButton,
            ...(isHovered ? styles.searchButtonHover : {})
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Submit search"
        >
          <FaSearch />
        </Button>
      </InputGroup>
    </Form>
  );
});

SearchComponent.displayName = "SearchComponent";

// Navigation links component with hover states
const NavigationLinks = memo(({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <Nav className="flex-column">
      {items.map((item, index) => (
        <Link 
          href={item.href} 
          key={item.href}
          style={styles.navItem}
          passHref
          legacyBehavior
        >
          <a 
            style={{ textDecoration: 'none' }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              style={{
                ...styles.navItemContent,
                ...(hoveredIndex === index ? styles.navItemContentHover : {})
              }}
            >
              <span 
                style={{
                  ...styles.navItemIcon,
                  ...(hoveredIndex === index ? styles.navItemIconHover : {})
                }}
              >
                {item.icon}
              </span>
              <span 
                style={{
                  ...styles.navItemLabel,
                  ...(hoveredIndex === index ? styles.navItemLabelHover : {})
                }}
              >
                {item.label}
              </span>
            </div>
          </a>
        </Link>
      ))}
    </Nav>
  );
});

NavigationLinks.displayName = "NavigationLinks";

// Social/External links component with individual hover states
const ConnectLinks = memo(({ title, links }) => {
  const [hoveredLink, setHoveredLink] = useState(null);

  return (
    <div style={styles.connectSection}>
      <h6 style={styles.sectionTitle}>{title}</h6>
      <div style={styles.connectLinksContainer}>
        {links.map((link) => {
          const Icon = link.icon;
          const isHovered = hoveredLink === link.name;
          
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles.connectLink,
                ...(isHovered ? styles.connectLinkHover(link.color) : {})
              }}
              onMouseEnter={() => setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
              title={link.name}
              aria-label={`Visit ${link.name}`}
            >
              <Icon size={20} />
            </a>
          );
        })}
      </div>
    </div>
  );
});

ConnectLinks.displayName = "ConnectLinks";

// ============= Main Component =============
const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside 
      style={{
        ...styles.sidebar,
        ...(isHovered ? styles.sidebarHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="complementary"
    >
      <Container fluid className="p-0">
        <SearchComponent />
        <NavigationLinks items={NAV_ITEMS} />
        <ConnectLinks title="Profile" links={EXTERNAL_LINKS} />
        <ConnectLinks title="Social Media" links={SOCIAL_MEDIA_LINKS} />
      </Container>

      {/* Global styles for responsive design */}
      <style jsx global>{`
        @media (max-width: 768px) {
          aside {
            padding: 1.5rem !important;
          }
          
          .connect-links-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (max-width: 480px) {
          aside {
            padding: 1rem !important;
            border-radius: 16px !important;
          }
        }

        /* Focus styles for accessibility */
        a:focus-visible,
        button:focus-visible,
        input:focus-visible {
          outline: 2px solid #0d6efd !important;
          outline-offset: 2px !important;
        }

        /* Smooth transitions for all interactive elements */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Custom scrollbar for sidebar */
        aside::-webkit-scrollbar {
          width: 6px;
        }

        aside::-webkit-scrollbar-track {
          background: transparent;
        }

        aside::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }

        aside::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          aside {
            background: linear-gradient(145deg, #1a1a1a, #2d2d2d) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
          }
          
          input[type="search"] {
            background-color: #2d2d2d !important;
            border-color: #444 !important;
            color: #fff !important;
          }
          
          input[type="search"]::placeholder {
            color: #888 !important;
          }
          
          .btn-primary {
            background-color: #0d6efd !important;
            border-color: #0d6efd !important;
          }
        }

        /* Animation for page load */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        aside {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </aside>
  );
};

export default memo(Sidebar);