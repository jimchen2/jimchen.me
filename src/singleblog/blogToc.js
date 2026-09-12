import React, { useEffect, useMemo, useState } from "react";

/** Groups a flat heading list into `h2 -> [h3]` for rendering. */
function buildTree(headings) {
  const tree = [];
  let currentParent = null;

  for (const heading of headings) {
    if (heading.level === 2 || !currentParent) {
      currentParent = { ...heading, children: [] };
      tree.push(currentParent);
    } else {
      currentParent.children.push(heading);
    }
  }

  return tree;
}

/**
 * Sticky "on this page" navigation. Heading ids are assigned while the post HTML
 * is parsed, so this works without DOM scanning and matches the server output.
 */
export default function BlogToc({ headings = [] }) {
  const tree = useMemo(() => buildTree(headings), [headings]);
  const [activeId, setActiveId] = useState(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return undefined;

    let frame = 0;

    const updateActive = () => {
      frame = 0;
      let current = headings[0].id;
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= 120) {
          current = heading.id;
        } else {
          break;
        }
      }
      setActiveId((previous) => (previous === current ? previous : current));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  if (tree.length === 0) return null;

  return (
    <nav className="blog-toc" aria-label="Table of contents">
      <p className="blog-toc-title">On this page</p>
      <ul className="blog-toc-list">
        {tree.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={activeId === item.id ? "blog-toc-link is-active" : "blog-toc-link"}
              onClick={() => setActiveId(item.id)}
            >
              {item.text}
            </a>
            {item.children.length > 0 && (
              <ul className="blog-toc-sublist">
                {item.children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      className={activeId === child.id ? "blog-toc-link is-active" : "blog-toc-link"}
                      onClick={() => setActiveId(child.id)}
                    >
                      {child.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <a className="blog-toc-top" href="#top">
        Back to top
      </a>
    </nav>
  );
}
