import React, { useState, useEffect } from "react";
import { Accordion, Card, Col } from "react-bootstrap";

const scrollToElement = (id, offset = -70) => {
  const element = document.getElementById(id);
  if (element) {
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.pageYOffset + offset,
      behavior: "smooth",
    });
    window.history.pushState(null, "", `#${id}`);
  }
};
const addHashLinks = () => {
  document.querySelectorAll("h2").forEach((header) => {
    const id = header.id;
    if (id && !header.querySelector(".hash-link")) {
      const link = document.createElement("a");
      link.className = "hash-link";
      link.href = `#${id}`;
      link.innerHTML = "#";
      link.style.marginRight = "5px";
      link.onclick = (e) => {
        e.preventDefault();
        scrollToElement(id);
      };
      header.prepend(link);
    }
  });
  document.querySelectorAll("h3").forEach((header) => {
    const id = header.id;
    if (id && !header.querySelector(".hash-link")) {
      const link = document.createElement("a");
      link.className = "hash-link";
      link.href = `#${id}`;
      link.innerHTML = "#";
      link.style.marginRight = "5px";
      link.onclick = (e) => {
        e.preventDefault();
        scrollToElement(id);
      };
      header.prepend(link);
    }
  });
};

const CustomToggle = ({ children, eventKey, setActiveKey, isActive }) => {
  const handleClick = () => {
    const newKey = isActive ? null : eventKey;
    setActiveKey(newKey);
    scrollToElement(eventKey);
  };

  return (
    <Card.Header
      onClick={handleClick}
      style={{
        cursor: "pointer",
        backgroundColor: isActive ? "black" : "white",
        color: isActive ? "white" : "black",
        maxWidth: "300px", // Adjust this value as needed
        wordWrap: "break-word",
        whiteSpace: "normal",
        lineHeight: "1.3",
      }}
    >
      <span
        style={{
          fontWeight: 500,
          display: "block",
          wordBreak: "break-word",
        }}
      >
        {children}
      </span>
    </Card.Header>
  );
};
const useTableOfContents = (setActiveKey) => {
  const [tocItems, setTocItems] = useState([]);

  useEffect(() => {
    const headers = Array.from(document.querySelectorAll("h2, h3"));
    const items = [];
    let lastH2Key = null;

    headers.forEach((header) => {
      const id = header.id;
      if (!id) return;

      const text = header.textContent.replace(/^#\s+/, "").trim();
      const isH2 = header.tagName === "H2";

      if (isH2) {
        lastH2Key = id;
        items.push({
          key: id,
          content: (
            <CustomToggle eventKey={id} setActiveKey={setActiveKey}>
              {text}
            </CustomToggle>
          ),
          children: [],
          hasChildren: false,
        });
      } else if (lastH2Key) {
        const parent = items.find((item) => item.key === lastH2Key);
        if (parent) {
          parent.children.push(
            <div
              key={`child-${id}`}
              onClick={() => scrollToElement(id)}
              style={{
                padding: "0.5rem 0.5rem 0.5rem 1rem",
                cursor: "pointer",
                maxWidth: "300px",
                wordWrap: "break-word",
                whiteSpace: "normal",
                lineHeight: "1.3",
                wordBreak: "break-word",
                overflow: "hidden",
              }}
              className="hover:bg-gray-100 hover:underline"
            >
              {text}
            </div>
          );
          parent.hasChildren = true;
        }
      }
    });

    setTocItems(items);

    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        scrollToElement(hash);
        const header = document.getElementById(hash);
        if (header?.tagName === "H3") {
          let prev = header.previousElementSibling;
          while (prev && prev.tagName !== "H2") prev = prev.previousElementSibling;
          if (prev?.id) setActiveKey(prev.id);
        } else if (header?.tagName === "H2") {
          setActiveKey(hash);
        }
      }, 150);
    }

    addHashLinks();
  }, [setActiveKey]);

  return tocItems;
};

const BlogToc = () => {
  const [activeKey, setActiveKey] = useState(null);
  const tocItems = useTableOfContents(setActiveKey);

  return (
    <Col
      lg={2.5}
      xl={2.5}
      style={{
        position: "fixed",
        top: "70px",
        right: "20px",
        height: "calc(100vh - 70px)",
        overflowY: "auto",
        padding: "10px",
      }}
    >
      <Accordion activeKey={activeKey}>
        {tocItems.map((item) => (
          <Card key={item.key}>
            {React.cloneElement(item.content, {
              isActive: activeKey === item.key,
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

export { BlogToc };
