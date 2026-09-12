import React, { useEffect, useState } from "react";

const SESSION_PREFIX = "jc:viewed:";

/**
 * Post view counter.
 *
 * Reads the current count (and a short-lived token) from `/api/blog/views`, then
 * records at most one view per browser session per post. The counter is
 * best-effort: if the API is unavailable the page simply does not show it.
 */
export default function BlogViewCounter({ blogid }) {
  const [views, setViews] = useState(null);

  useEffect(() => {
    if (!blogid) return undefined;

    let active = true;
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(`/api/blog/views?blogid=${encodeURIComponent(blogid)}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;

        const data = await response.json();
        if (!active) return;
        if (typeof data.views === "number") setViews(data.views);

        if (data.demo || !data.token) return;

        let recorded = false;
        try {
          recorded = window.sessionStorage.getItem(`${SESSION_PREFIX}${blogid}`) === "1";
        } catch {
          recorded = false;
        }
        if (recorded) return;

        const postResponse = await fetch(`/api/blog/views?blogid=${encodeURIComponent(blogid)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: data.token }),
          signal: controller.signal,
        });
        if (!postResponse.ok) return;

        const after = await postResponse.json();
        if (active && typeof after.views === "number") setViews(after.views);

        try {
          window.sessionStorage.setItem(`${SESSION_PREFIX}${blogid}`, "1");
        } catch {
          /* private mode — not worth failing over */
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.warn("View counter unavailable:", error.message);
        }
      }
    };

    load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [blogid]);

  if (!views) return null;

  return (
    <>
      <span className="blog-meta-sep" aria-hidden="true">
        •
      </span>
      <span>{views.toLocaleString()} views</span>
    </>
  );
}
