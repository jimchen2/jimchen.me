import React, { useState, useEffect } from "react";
import axios from "axios";

const BlogViewCounter = ({ blogid }) => {
  const [views, setViews] = useState(0);
  const [hasRecordedView, setHasRecordedView] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const recordViewSequence = async () => {
      try {
        // Step 1: GET - Fetch current views and Security Token
        const getResponse = await axios.get(`${process.env.NEXT_PUBLIC_SITE}/api/blog/views?blogid=${blogid}`);

        if (!isMounted) return;

        setViews(getResponse.data.views);
        const token = getResponse.data.token;

        // Step 2: POST - Automatically use token to record a new view
        // We check hasRecordedView to prevent double counting in React Strict Mode or re-renders
        if (token && !hasRecordedView) {
          setHasRecordedView(true); // Lock it immediately

          await axios
            .post(`${process.env.NEXT_PUBLIC_SITE}/api/blog/views?blogid=${blogid}`, { token: token })
            .then((postResponse) => {
              if (isMounted) {
                setViews(postResponse.data.views);
              }
            });
        }
      } catch (error) {
        console.error("View counter error:", error);
      }
    };

    if (blogid) {
      recordViewSequence();
    }

    return () => {
      isMounted = false;
    };
  }, [blogid]); // Dependency array ensures this runs once per blogid load

  if (views === 0) return null; // Don't show anything until loaded

  return (
    <span>
      {} • {views.toLocaleString()} views
    </span>
  );
};

export default BlogViewCounter;
