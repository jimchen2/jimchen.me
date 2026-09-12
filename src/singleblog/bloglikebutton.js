import React, { useEffect, useState } from "react";

const SESSION_PREFIX = "jc:liked:";

/**
 * Like button with an optimistic update.
 *
 * The count is fetched once, a click flips the UI immediately, and the request
 * is rolled back if the API rejects it. Hidden entirely when the site is
 * running on local example content (no database).
 */
export default function BlogLikeButton({ blogid }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!blogid) return undefined;

    let active = true;
    const controller = new AbortController();

    fetch(`/api/blog/likes?blogid=${encodeURIComponent(blogid)}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
      .then((data) => {
        if (!active) return;
        if (data.demo) {
          setHidden(true);
          return;
        }
        setLikes(Number(data.likes) || 0);
        setLiked(Boolean(data.liked));
        setToken(data.token || null);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.warn("Likes unavailable:", error.message);
          if (active) setHidden(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [blogid]);

  const handleClick = async () => {
    const previousLiked = liked;
    const previousLikes = likes;
    const nextLiked = !previousLiked;

    setLiked(nextLiked);
    setLikes(Math.max(previousLikes + (nextLiked ? 1 : -1), 0));

    try {
      try {
        window.sessionStorage.setItem(`${SESSION_PREFIX}${blogid}`, nextLiked ? "1" : "0");
      } catch {
        /* ignore */
      }

      const response = await fetch(`/api/blog/likes?blogid=${encodeURIComponent(blogid)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (typeof data.likes === "number") setLikes(data.likes);
      if (typeof data.liked === "boolean") setLiked(data.liked);
    } catch (error) {
      console.warn("Could not save like:", error.message);
      setLiked(previousLiked);
      setLikes(previousLikes);
    }
  };

  if (hidden) return null;

  return (
    <button
      type="button"
      className={liked ? "blog-like-button is-liked" : "blog-like-button"}
      onClick={handleClick}
      disabled={loading}
      aria-pressed={liked}
    >
      {liked ? "Liked" : "Like"}
      <span className="blog-like-count">{likes}</span>
    </button>
  );
}
