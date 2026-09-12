import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

function BlogLikeButton({ blogid, initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [available, setAvailable] = useState(true);

  // Store the security token
  const [securityToken, setSecurityToken] = useState(null);

  // 1. Fetch initial status and Security Token
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`/api/blog/likes?blogid=${blogid}`);
        if (isMounted) {
          if (response.data.available === false) {
            setAvailable(false);
            setIsFetching(false);
            return;
          }
          setLikes(response.data.likes);
          setLiked(response.data.liked);
          setSecurityToken(response.data.token);
          setIsFetching(false);
        }
      } catch (error) {
        // Likes are decorative: hide the button instead of breaking the page.
        if (isMounted) {
          setAvailable(false);
          setIsFetching(false);
        }
      }
    };

    fetchStatus();
    return () => {
      isMounted = false;
    };
  }, [blogid]);

  const handleLike = () => {
    // 1. Snapshot previous state in case we need to revert
    const previousLiked = liked;
    const previousLikes = likes;

    // 2. Calculate new state
    const newLiked = !previousLiked;
    const newLikes = newLiked ? previousLikes + 1 : previousLikes - 1;

    // 3. UPDATE UI IMMEDIATELY (optimistic)
    setLiked(newLiked);
    setLikes(newLikes);

    // 4. Send the request in the background; without a token we cannot
    //    authenticate the toggle, so just keep the optimistic state.
    if (!securityToken) {
      return;
    }

    axios
      .post(`/api/blog/likes?blogid=${blogid}`, { token: securityToken })
      .catch(() => {
        // 5. REVERT UI ONLY ON ERROR
        setLiked(previousLiked);
        setLikes(previousLikes);
      });
  };

  const baseStyle = {
    fontSize: "0.75rem",
    padding: "2px 6px",
    margin: "5px",
    // Remove opacity changes during interaction to prevent "disabled" feel
    opacity: isFetching ? 0.6 : 1,
    cursor: "pointer",
  };

  const likedButtonStyle = {
    ...baseStyle,
    backgroundColor: "#007bff",
    color: "white",
    borderColor: "#007bff",
  };

  if (!available) return null;

  return (
    <Button
      variant={liked ? "primary" : "outline-primary"}
      style={liked ? likedButtonStyle : baseStyle}
      onClick={handleLike}
      // Only disable during the very first load to prevent hydration mismatches,
      // never disable while the user is clicking.
      disabled={isFetching}
      aria-pressed={liked}
    >
      {liked ? "Liked" : "Like"} {likes}
    </Button>
  );
}

export default BlogLikeButton;
