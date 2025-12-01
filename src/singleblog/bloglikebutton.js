import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

// Optional: Pass initialLikes if you fetch count via getStaticProps/getServerSideProps
function BlogLikeButton({ blogid, initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // Use a ref to prevent spam-clicking sending too many requests
  const isRequesting = useRef(false);

  // 1. Fetch initial status (Does this user like this blog?)
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SITE}/api/blog/likes?blogid=${blogid}`);
        if (isMounted) {
          setLikes(response.data.likes);
          setLiked(response.data.liked);
          setIsFetching(false);
        }
      } catch (error) {
        console.error("Failed to fetch like status", error);
      }
    };

    fetchStatus();

    return () => { isMounted = false; };
  }, [blogid]);

  const handleLike = async () => {
    // Prevent spam clicking
    if (isRequesting.current) return;
    
    // 2. Optimistic Update: Update UI immediately
    const previousLiked = liked;
    const previousLikes = likes;

    setLiked(!previousLiked);
    setLikes((prev) => (previousLiked ? prev - 1 : prev + 1));
    
    isRequesting.current = true;

    try {
      // 3. Send request to server
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SITE}/api/blog/likes?blogid=${blogid}`);
      
      // Sync with actual server data to ensure accuracy
      setLikes(response.data.likes);
      setLiked(response.data.liked);
    } catch (error) {
      console.error("Error toggling like:", error);
      // 4. Revert UI on error
      setLiked(previousLiked);
      setLikes(previousLikes);
    } finally {
      isRequesting.current = false;
    }
  };

  const baseStyle = {
    fontSize: "0.75rem",
    padding: "2px 6px",
    margin: "5px",
    transition: "background-color 0.2s, transform 0.1s",
    // Make it look clickable immediately, even if fetching background status
    opacity: isFetching ? 0.8 : 1, 
    cursor: isRequesting.current ? "wait" : "pointer"
  };

  const likedButtonStyle = {
    ...baseStyle,
    backgroundColor: "#007bff", // Bootstrap primary color example
    color: "white",
    borderColor: "#007bff"
  };

  return (
    <Button 
      variant={liked ? "primary" : "outline-primary"}
      style={liked ? likedButtonStyle : baseStyle} 
      onClick={handleLike}
      disabled={isRequesting.current} // Optional: strictly disable button while request is flying
    >
      {liked ? "Liked" : "Like"} {likes}
    </Button>
  );
}

export default BlogLikeButton;