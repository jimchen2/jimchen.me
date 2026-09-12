import React, { useCallback, useEffect, useState } from "react";

const HEADER_OFFSET = 70;

function scrollToId(id) {
  const element = document.getElementById(id);
  if (!element) return;
  window.scrollTo({
    top: element.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET,
    behavior: "smooth",
  });
  window.history.pushState(null, "", `#${id}`);
}

/** Adds a "#" anchor in front of every h2/h3 inside the post body. */
function addHashLinks() {
  document.querySelectorAll(".blog-content h2, .blog-content h3").forEach((header) => {
    const id = header.id;
    if (!id || header.querySelector(".hash-link")) return;

    const link = document.createElement("a");
    link.className = "hash-link";
    link.href = `#${id}`;
    link.textContent = "#";
    link.setAttribute("aria-label", `Link to section ${header.textContent.trim()}`);
    link.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToId(id);
    });
    header.prepend(link);
  });
}

/** Collects h2/h3 pairs from the rendered post into a two-level tree. */
export function collectHeadingsFromDom() {
  const headers = Array.from(document.querySelectorAll(".blog-content h2, .blog-content h3"));
  const items = [];

  for (const header of headers) {
    if (!header.id) continue;

    const text = header.textContent.replace(/^#\s+/, "").trim();
    if (!text) continue;

    if (header.tagName === "H2") {
      items.push({ id: header.id, text, children: [] });
    } else if (items.length > 0) {
      items[items.length - 1].children.push({ id: header.id, text });
    }
  }

  return items;
}

const headerStyle = (isActive) => ({
  cursor: "pointer",
  backgroundColor: isActive ? "black" : "white",
  color: isActive ? "white" : "black",
  border: "none",
  width: "100%",
  textAlign: "left",
  padding: "0.5rem 0.75rem",
  fontWeight: 500,
  lineHeight: "1.3",
  wordBreak: "break-word",
});

const childStyle = {
  display: "block",
  width: "100%",
  textAlign: "left",
  background: "none",
  border: "none",
  padding: "0.5rem 0.5rem 0.5rem 1rem",
  cursor: "pointer",
  lineHeight: "1.3",
  wordBreak: "break-word",
};

export function BlogToc({ blogid, headings }) {
  // Headings are extracted on the server, so the outline is in the initial HTML
  // and does not pop in after hydration.
  const [items, setItems] = useState(() => headings || []);
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    if (headings && headings.length > 0) {
      setItems(headings);
    } else {
      setItems(collectHeadingsFromDom());
    }
    addHashLinks();

    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const timer = setTimeout(() => {
      const header = document.getElementById(hash);
      if (!header) return;
      scrollToId(hash);
      if (header.tagName === "H2") {
        setActiveKey(hash);
      } else {
        // Walk back to the nearest preceding h2 so its section opens.
        let previous = header.previousElementSibling;
        while (previous && previous.tagName !== "H2") {
          previous = previous.previousElementSibling;
        }
        if (previous?.id) setActiveKey(previous.id);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [blogid, headings]);

  const toggle = useCallback(
    (id) => {
      setActiveKey((current) => (current === id ? null : id));
      scrollToId(id);
    },
    [],
  );

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      style={{
        position: "fixed",
        top: "70px",
        right: "20px",
        width: "240px",
        maxHeight: "calc(100vh - 90px)",
        overflowY: "auto",
        padding: "10px",
      }}
    >
      {items.map((item) => {
        const isActive = activeKey === item.id;
        return (
          <div className="card mb-1" key={item.id}>
            <button
              type="button"
              className="card-header"
              style={headerStyle(isActive)}
              aria-expanded={isActive}
              onClick={() => toggle(item.id)}
            >
              {item.text}
            </button>

            {item.children.length > 0 && isActive && (
              <div className="card-body p-0">
                {item.children.map((child) => (
                  <button
                    type="button"
                    key={child.id}
                    style={childStyle}
                    onClick={() => scrollToId(child.id)}
                  >
                    {child.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
