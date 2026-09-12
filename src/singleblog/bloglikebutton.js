import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

const likesUrl = (blogid) => `/api/blog/likes?blogid=${encodeURIComponent(blogid)}`;

function BlogLikeButton({ blogid, initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [securityToken, setSecurityToken] = useState(null);

  // Fetch the current state plus a signed token for this client's IP.
  useEffect(() => {
    if (!blogid) return undefined;

    const controller = new AbortController();

    const fetchStatus = async () => {
      try {
        const response = await axios.get(likesUrl(blogid), {
          signal: controller.signal,
        });
        setLikes(response.data.likes ?? 0);
        setLiked(Boolean(response.data.liked));
        setSecurityToken(response.data.token ?? null);
      } catch (error) {
        if (error?.name !== "CanceledError") {
          console.error("Failed to fetch like status", error);
        }
      } finally {
        if (!controller.signal.aborted) setIsFetching(false);
      }
    };

    fetchStatus();
    return () => controller.abort();
  }, [blogid]);

  const handleLike = () => {
    const previousLiked = liked;
    const previousLikes = likes;
    const newLiked = !previousLiked;

    // Optimistic update: the UI moves immediately.
    setLiked(newLiked);
    setLikes(newLiked ? previousLikes + 1 : Math.max(0, previousLikes - 1));

    if (!securityToken) return; // token not loaded yet; nothing to send

    axios
      .post(likesUrl(blogid), { token: securityToken })
      .catch((error) => {
        console.error("Error toggling like:", error);
        // Revert only when the request actually failed.
        setLiked(previousLiked);
        setLikes(previousLikes);
      });
  };

  const baseStyle = {
    fontSize: "0.75rem",
    padding: "2px 6px",
    margin: "5px",
    opacity: isFetching ? 0.6 : 1,
    cursor: "pointer",
  };

  return (
    <Button
      variant={liked ? "primary" : "outline-primary"}
      style={baseStyle}
      onClick={handleLike}
      disabled={isFetching}
      aria-pressed={liked}
      aria-label={liked ? `Unlike this post (${likes} likes)` : `Like this post (${likes} likes)`}
    >
      {liked ? "Liked" : "Like"} {likes}
    </Button>
  );
}

export default BlogLikeButton;
