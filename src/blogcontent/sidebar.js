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

function CustomToggle({ children, eventKey, hasChildren, setActiveKey, isActive }) {
  const { colors } = useGlobalColorScheme();

  const handleClick = () => {
    const newActiveKey = isActive ? null : eventKey;
    setActiveKey(newActiveKey);
    scrollToElementWithOffset(eventKey, -paddingtop + 10);
  };

  const activeStyle = isActive ? { backgroundColor: colors.color_blue, color: colors.color_white } : { backgroundColor: colors.color_white, color: colors.color_blue };

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
    let isFirstH2 = true;

    headers.forEach((header) => {
      const id = header.getAttribute("id");
      if (!id) return;

      const formattedText = formatTextWithNewLines(header.textContent);
      const isH2 = header.tagName === "H2";

      if (isH2) {
        if (isFirstH2) {
          isFirstH2 = false;
          return;
        }
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
        const parentItem = newTocItems.find((item) => item.key === lastH2Key);
        parentItem.children.push(
          <div
            key={`child-${id}`}
            onClick={() => scrollToElementWithOffset(id, -paddingtop + 10)}
            style={{
              paddingLeft: "1rem",
              cursor: "pointer",
              color: colors.color_blue,
              backgroundColor: colors.color_white,
              wordWrap: "break-word",
              whiteSpace: "normal",
            }}
          >
            {formattedText}
          </div>
        );
        parentItem.hasChildren = true;
      }
    });

    setTocItems(newTocItems);

    // Handle initial URL hash
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
      scrollToElementWithOffset(initialHash, -paddingtop + 10);
      const parentItem = newTocItems.find((item) => item.key === initialHash || item.children.some((child) => child.key === `child-${initialHash}`));
      if (parentItem) setActiveKey(parentItem.key);
    }
  }, [setActiveKey, colors]);

  return tocItems;
};

const SideNav = () => {
  const [activeKey, setActiveKey] = useState(null);
  const { colors } = useGlobalColorScheme();
  const tocItems = useAddItemToNavbar(setActiveKey);

  return (
    <Col
      lg={2.5}
      xl={2.5}
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
