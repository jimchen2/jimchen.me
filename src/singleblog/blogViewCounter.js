import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const BlogViewCounter = ({ blogid }) => {
  const [views, setViews] = useState(0);
  const [available, setAvailable] = useState(true);
  const hasRecordedView = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const recordViewSequence = async () => {
      try {
        // Step 1: GET - Fetch current views and Security Token (relative URL,
        // so the site works behind any host / preview proxy)
        const getResponse = await axios.get(`/api/blog/views?blogid=${blogid}`);

        if (!isMounted) return;

        if (getResponse.data.available === false) {
          setAvailable(false);
          return;
        }

        setViews(getResponse.data.views);
        const token = getResponse.data.token;

        // Step 2: POST - use the token to record a new view.
        // The ref prevents double counting under React Strict Mode.
        if (token && !hasRecordedView.current) {
          hasRecordedView.current = true; // Lock it immediately

          const postResponse = await axios.post(
            `/api/blog/views?blogid=${blogid}`,
            { token }
          );
          if (isMounted) {
            setViews(postResponse.data.views);
          }
        }
      } catch (error) {
        // Views are decorative: never break the page over them.
        if (isMounted) setAvailable(false);
      }
    };

    if (blogid) {
      recordViewSequence();
    }

    return () => {
      isMounted = false;
    };
  }, [blogid]);

  if (!available || views === 0) return null; // Don't show anything until loaded

  return <span> • {views.toLocaleString()} views</span>;
};

export default BlogViewCounter;
