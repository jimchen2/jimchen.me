import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

// Relative URLs: works on localhost, previews and production without needing
// NEXT_PUBLIC_SITE to be present in the client bundle.
const viewsUrl = (blogid) => `/api/blog/views?blogid=${encodeURIComponent(blogid)}`;

const BlogViewCounter = ({ blogid }) => {
  const [views, setViews] = useState(null);
  // Refs survive Strict Mode's double-invoked effects and re-renders.
  const recordedRef = useRef(false);

  useEffect(() => {
    if (!blogid) return undefined;

    const controller = new AbortController();
    recordedRef.current = false;

    const run = async () => {
      try {
        // 1. Current count + a token proving this client really loaded the page.
        const getResponse = await axios.get(viewsUrl(blogid), {
          signal: controller.signal,
        });
        setViews(getResponse.data.views ?? 0);

        const token = getResponse.data.token;
        if (!token || recordedRef.current) return;
        recordedRef.current = true;

        // 2. Record this view (the API dedupes to one per IP per day).
        const postResponse = await axios.post(
          viewsUrl(blogid),
          { token },
          { signal: controller.signal },
        );
        setViews(postResponse.data.views ?? getResponse.data.views ?? 0);
      } catch (error) {
        if (axios.isCancel?.(error) || error?.name === "CanceledError") return;
        console.error("View counter error:", error);
      }
    };

    run();
    return () => controller.abort();
  }, [blogid]);

  // Nothing is rendered until the count is known, so the header never jumps.
  if (views === null || views === 0) return null;

  return <span> • {views.toLocaleString()} views</span>;
};

export default BlogViewCounter;
