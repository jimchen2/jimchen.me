import React, { useState, useEffect } from "react";
import { Accordion, Card, Col } from "react-bootstrap";
import { paddingtop, useGlobalColorScheme } from "@/config/global";

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

function addHashLinksToHeaders(colors) {
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
    hashLink.style.color = colors.color_black; // Or a more subtle color like 'inherit' or a light gray

    hashLink.onclick = (e) => {
      e.preventDefault();
      scrollToElementWithOffset(id, -paddingtop);
    };

    // Prepend the hash link to the header
    header.insertBefore(hashLink, header.firstChild);
  });
}

function CustomToggle({ children, eventKey, setActiveKey, isActive }) {
  const { colors } = useGlobalColorScheme();

  const handleClick = () => {
    const newActiveKey = isActive ? null : eventKey;
    setActiveKey(newActiveKey);
    scrollToElementWithOffset(eventKey, -paddingtop);
  };

  const activeStyle = isActive
    ? { backgroundColor: colors.color_blue, color: colors.color_white }
    : { backgroundColor: colors.color_white, color: colors.color_blue };

  return (
    <Card.Header
      onClick={handleClick}
      style={{
        cursor: "pointer",
        ...activeStyle,
        wordWrap: "break-word",
        whiteSpace: "normal",
      }}
    >
      <span style={{ fontWeight: 500 }}>{children}</span>
    </Card.Header>
  );
}

const useAddItemToNavbar = (setActiveKey) => {
  const { colors } = useGlobalColorScheme();
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
            <CustomToggle
              eventKey={id}
              hasChildren={false}
              setActiveKey={setActiveKey}
            >
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
                scrollToElementWithOffset(id, -paddingtop);
              }}
              style={{
                paddingLeft: "1rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                cursor: "pointer",
                color: colors.color_blue,
                backgroundColor: colors.color_white,
                wordWrap: "break-word",
                whiteSpace: "normal",
                borderTop: `1px solid ${colors.color_light_gray || "#eee"}`,
              }}
              onMouseEnter={(e) =>
                (e.target.style.textDecoration = "underline")
              }
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              {formattedText}
            </div>
          );
          parentItem.hasChildren = true;
        } else {
          console.warn(
            `Found H3 with id '${id}' but its parent H2 ('${lastH2Key}') wasn't found in tocItems. This shouldn't normally happen.`
          );
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
          scrollToElementWithOffset(initialHash, -paddingtop);

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
            console.warn(
              `Could not determine parent H2 for initial hash '#${initialHash}'`
            );
          }
        } else {
          console.warn(
            `Element with id '${initialHash}' not found after delay.`
          );
        }
      }, 150);
    }

    addHashLinksToHeaders(colors);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [setActiveKey, colors]);

  return tocItems;
};

const SideNav = () => {
  const [activeKey, setActiveKey] = useState(null);
  const { colors } = useGlobalColorScheme();
  const tocItems = useAddItemToNavbar(setActiveKey);

  useEffect(() => {
    // Ensure hash links are added/updated when tocItems or colors change
    addHashLinksToHeaders(colors);
  }, [tocItems, colors]); // Added colors to dependency array

  return (
    <Col
      lg={2.5} // Consider using string values for Col props like "2.5" if that's standard for your react-bootstrap version
      xl={2.5} // Or use the object format e.g. lg={{ span: 2, offset: 0.5 }} if more control is needed
      style={{
        position: "fixed",
        top: `${paddingtop}px`,
        left: "50px",
        height: "100vh",
        overflowY: "auto",
        padding: "10px",
        boxSizing: "border-box",
        paddingBottom: "150px",
      }}
    >
      <Accordion activeKey={activeKey}>
        {tocItems.map((item) => (
          <Card key={item.key} style={{ backgroundColor: colors.color_white }}>
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
