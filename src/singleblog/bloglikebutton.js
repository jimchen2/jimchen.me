import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

function BlogLikeButton({ blogid, initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Store the security token
  const [securityToken, setSecurityToken] = useState(null);

  // 1. Fetch initial status and Security Token
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SITE}/api/blog/likes?blogid=${blogid}`);
        if (isMounted) {
          setLikes(response.data.likes);
          setLiked(response.data.liked);
          setSecurityToken(response.data.token);
          setIsFetching(false);
        }
      } catch (error) {
        console.error("Failed to fetch like status", error);
        // Even if initial fetch fails, allow interaction based on default props
        if (isMounted) setIsFetching(false);
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

    // 3. UPDATE UI IMMEDIATELY (Do not wait for token or backend)
    setLiked(newLiked);
    setLikes(newLikes);

    // 4. Send Request in Background
    // If the token hasn't loaded yet, we update UI but skip the API call to prevent errors
    if (!securityToken) {
      console.log("TOKEN NOT LOADED");
      return;
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_SITE}/api/blog/likes?blogid=${blogid}`, {
        token: securityToken,
      })
      .then((response) => {
        // Optional: You can sync with server response here, but usually,
        // trusting the optimistic update feels smoother to the user.
        // We do NOTHING here to prevent "jumping" numbers if the user clicks fast.
      })
      .catch((error) => {
        console.error("Error toggling like:", error);
        // 5. REVERT UI ONLY ON ERROR
        setLiked(previousLiked);
        setLikes(previousLikes);
      });
  };

  const baseStyle = {
    fontSize: "0.75rem",
    padding: "2px 6px",
    margin: "5px",
    transition: "background-color 0.2s, transform 0.1s",
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

  return (
    <Button
      variant={liked ? "primary" : "outline-primary"}
      style={liked ? likedButtonStyle : baseStyle}
      onClick={handleLike}
      // Only disable during the very first load to prevent hydration mismatches,
      // never disable while the user is clicking.
      disabled={isFetching}
    >
      {liked ? "Liked" : "Like"} {likes}
    </Button>
  );
}

export default BlogLikeButton;
