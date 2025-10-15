import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Form, InputGroup, Button, Nav, Container } from "react-bootstrap";
import { FaSearch, FaTags, FaComments, FaUser } from "react-icons/fa";

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const query = searchParams.get("searchterm");
    setSearchTerm(query ? decodeURIComponent(query) : "");
  }, [searchParams]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    const newParams = new URLSearchParams(searchParams.toString());

    if (trimmedSearchTerm) {
      newParams.set("searchterm", trimmedSearchTerm);
    } else {
      newParams.delete("searchterm");
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <Form onSubmit={handleSearchSubmit} className="search-form">
      <InputGroup className={`search-input-group ${isFocused ? 'focused' : ''}`}>
        <Form.Control
          ref={searchInputRef}
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="search-input"
        />
        <Button variant="primary" type="submit" className="search-button">
          <FaSearch />
        </Button>
      </InputGroup>
    </Form>
  );
}

const Sidebar = () => {
  const navItems = [
    { href: "/tags", label: "All Tags", icon: <FaTags /> },
    { href: "/comments", label: "Comments", icon: <FaComments /> },
    { href: "/about", label: "About Me", icon: <FaUser /> },
  ];

  return (
    <aside className="sidebar">
      <Container fluid className="sidebar-container">
        <SearchComponent />
        
        <Nav className="sidebar-nav">
          {navItems.map((item, index) => (
            <Link 
              href={item.href} 
              key={index} 
              className="nav-link sidebar-nav-item"
              passHref
            >
              <div className="nav-item-content">
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
              </div>
            </Link>
          ))}
        </Nav>
      </Container>

      <style jsx>{`
        .sidebar {
          background: linear-gradient(145deg, #ffffff, #f8f9fa);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border-radius: 24px;
          height: 100%;
          padding: 2rem;
        }

        .sidebar-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        :global(.search-form) {
          margin-bottom: 1.5rem;
        }

        :global(.search-input-group) {
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        :global(.search-input-group.focused) {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(13, 110, 253, 0.15);
        }

        :global(.search-input) {
          border: 2px solid #e9ecef;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        :global(.search-input:focus) {
          border-color: #0d6efd;
          box-shadow: none;
        }

        :global(.search-button) {
          padding: 0 1.5rem;
          background: #0d6efd;
          border: none;
          transition: all 0.2s ease;
        }

        :global(.search-button:hover) {
          background: #0b5ed7;
          transform: translateX(2px);
        }

        :global(.nav-item-content) {
          display: flex;
          align-items: center;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          background: transparent;
          transition: all 0.3s ease;
        }

        :global(.nav-item-icon) {
          font-size: 1.25rem;
          margin-right: 1rem;
          color: #6c757d;
          transition: all 0.3s ease;
        }

        :global(.nav-item-label) {
          font-weight: 500;
          color: #495057;
          transition: all 0.3s ease;
        }

        :global(.sidebar-nav-item:hover .nav-item-content) {
          background: rgba(13, 110, 253, 0.08);
          transform: translateX(8px);
        }

        :global(.sidebar-nav-item:hover .nav-item-icon) {
          color: #0d6efd;
          transform: scale(1.1);
        }

        :global(.sidebar-nav-item:hover .nav-item-label) {
          color: #0d6efd;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;