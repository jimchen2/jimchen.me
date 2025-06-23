import React, { useState, useEffect } from "react";
import { Accordion, Card, Col } from "react-bootstrap";

const scrollToElementWithOffset = (id, offset) => {
  const element = document.getElementById(id);
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: "smooth" });
    window.history.pushState(null, "", `#${id}`); // Update URL with hash
  } else {
    console.error(`No element with id '${id}' was found.`);
  }
};

function addHashLinksToHeaders() {
  const headers = document.querySelectorAll("h2, h3");
  headers.forEach((header) => {
    const id = header.getAttribute("id");
    // If no ID, or if a hash-link element already exists as a child, skip
    if (!id || header.querySelector(".hash-link")) return;

    const hashLink = document.createElement("a");
    hashLink.className = "hash-link";
    hashLink.innerHTML = "# "; // Use # with a non-breaking space
    hashLink.style.textDecoration = "none";
    hashLink.setAttribute("href", `#${id}`);

    hashLink.onclick = (e) => {
      e.preventDefault();
      scrollToElementWithOffset(id, 0);
    };

    // Prepend the hash link to the header
    header.insertBefore(hashLink, header.firstChild);
  });
}

function CustomToggle({ children, eventKey, setActiveKey, isActive }) {
  const handleClick = () => {
    const newActiveKey = isActive ? null : eventKey;
    setActiveKey(newActiveKey);
    scrollToElementWithOffset(eventKey, 0);
  };

  return (
    <Card.Header
      onClick={handleClick}
      style={{
        cursor: "pointer",
        wordWrap: "break-word",
        whiteSpace: "normal",
      }}
    >
      <span style={{ fontWeight: 500 }}>{children}</span>
    </Card.Header>
  );
}

const useAddItemToNavbar = (setActiveKey) => {
  const [tocItems, setTocItems] = useState([]);

  const formatTextWithNewLines = (text, maxLineLength = 25) => {
    const words = text.split(" ");
    let lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if (currentLine.length + word.length > maxLineLength) {
        lines.push(currentLine);
        lines.push(<br key={`br-${lines.length}`} />);
        currentLine = word;
      } else {
        currentLine += (currentLine ? " " : "") + word;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  useEffect(() => {
    const headers = Array.from(document.querySelectorAll("h2, h3"));
    let newTocItems = [];
    let lastH2Key = null;

    headers.forEach((header) => {
      const id = header.getAttribute("id");
      if (!id) return;

      let originalText = header.textContent || "";
      // Remove the prepended "# " or "# " before processing for TOC
      // Checking for common prepended patterns. The actual textContent might render   as a space.
      if (originalText.startsWith("# ")) {
        originalText = originalText.substring(2).trim();
      } else if (originalText.startsWith("#\u00A0")) {
        // \u00A0 is the non-breaking space character
        originalText = originalText.substring(2).trim();
      }

      const formattedText = formatTextWithNewLines(originalText);
      const isH2 = header.tagName === "H2";

      if (isH2) {
        lastH2Key = id;
        newTocItems.push({
          key: id,
          content: (
            <CustomToggle eventKey={id} hasChildren={false} setActiveKey={setActiveKey}>
              {formattedText}
            </CustomToggle>
          ),
          children: [],
          hasChildren: false,
        });
      } else if (lastH2Key) {
        // It's an H3 and we have a preceding H2
        const parentItem = newTocItems.find((item) => item.key === lastH2Key);
        if (parentItem) {
          parentItem.children.push(
            <div
              key={`child-${id}`}
              id={`toc-child-${id}`}
              onClick={(e) => {
                e.stopPropagation();
                scrollToElementWithOffset(id, 0);
              }}
              style={{
                paddingLeft: "1rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                cursor: "pointer",
                wordWrap: "break-word",
                whiteSpace: "normal",
              }}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              {formattedText}
            </div>
          );
          parentItem.hasChildren = true;
        } else {
          console.warn(`Found H3 with id '${id}' but its parent H2 ('${lastH2Key}') wasn't found in tocItems. This shouldn't normally happen.`);
        }
      }
    });

    setTocItems(newTocItems);

    const initialHash = window.location.hash.slice(1);
    let timeoutId = null;

    if (initialHash) {
      timeoutId = setTimeout(() => {
        const elementExists = document.getElementById(initialHash);
        if (elementExists) {
          scrollToElementWithOffset(initialHash, 0);

          let parentKeyToActivate = null;
          const headerElement = document.getElementById(initialHash);

          if (headerElement) {
            if (headerElement.tagName === "H2") {
              parentKeyToActivate = initialHash;
            } else if (headerElement.tagName === "H3") {
              let previousElement = headerElement.previousElementSibling;
              while (previousElement) {
                if (previousElement.tagName === "H2" && previousElement.id) {
                  parentKeyToActivate = previousElement.id;
                  break;
                }
                if (previousElement.tagName === "H2" && !previousElement.id) {
                  break;
                }
                previousElement = previousElement.previousElementSibling;
              }
            }
          }

          if (parentKeyToActivate) {
            setActiveKey(parentKeyToActivate);
          } else {
            console.warn(`Could not determine parent H2 for initial hash '#${initialHash}'`);
          }
        } else {
          console.warn(`Element with id '${initialHash}' not found after delay.`);
        }
      }, 150);
    }

    addHashLinksToHeaders();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [setActiveKey]);

  return tocItems;
};

const SideNav = () => {
  const [activeKey, setActiveKey] = useState(null);
  const tocItems = useAddItemToNavbar(setActiveKey);

  useEffect(() => {
    addHashLinksToHeaders();
  }, [tocItems]); 
  
  return (
    <Col
      lg={2.5}
      xl={2.5}
      style={{
        position: "fixed",
        right: "50px", // Changed from 'left' to 'right'
        height: "100vh",
        overflowY: "auto",
        padding: "10px",
        boxSizing: "border-box",
        paddingBottom: "150px",
      }}
    >
      <Accordion activeKey={activeKey}>
        {tocItems.map((item) => (
          <Card key={item.key}>
            {React.cloneElement(item.content, {
              isActive: activeKey === item.key,
              hasChildren: item.hasChildren,
              setActiveKey,
            })}
            {item.hasChildren && (
              <Accordion.Collapse eventKey={item.key}>
                <Card.Body>{item.children}</Card.Body>
              </Accordion.Collapse>
            )}
          </Card>
        ))}
      </Accordion>
    </Col>
  );
};

export { SideNav };
