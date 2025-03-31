import React, { useState, useEffect } from "react";
import axios from "axios";
import Blog from "../blogpreview/BlogPreviewPage";
import { useRouter } from "next/router";

export async function getServerSideProps({ query }) {
  try {
    const page = parseInt(query.page) || 1;
    const start = (page - 1) * 10; // 10 items per page
    const count = 10;

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SITE}/api/blogpreview?start=${start}&count=${count}`
    );
    const previews = response.data || [];
    
    return {
      props: {
        initialData: previews,
        initialPage: page,
        initialTotal: previews.length === count ? count * page : null // Rough estimate
      },
    };
  } catch (err) {
    console.error("Error fetching blog preview data:", err);
    return {
      props: {
        initialData: [],
        initialPage: 1,
        initialTotal: 0
      },
    };
  }
}

function BlogPreview({ initialData, initialPage, initialTotal }) {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPosts, setTotalPosts] = useState(initialTotal);
  const router = useRouter();
  const postsPerPage = 10;

  // Handle page changes
  const handlePageChange = async (newPage) => {
    try {
      const start = (newPage - 1) * postsPerPage;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SITE}/api/blogpreview?start=${start}&count=${postsPerPage}`
      );
      setData(response.data);
      setCurrentPage(newPage);
      router.push(`/page/${newPage}`, undefined, { shallow: true });
    } catch (err) {
      console.error("Error fetching page data:", err);
    }
  };

  return (
    <Blog 
      data={data}
      currentPage={currentPage}
      postsPerPage={postsPerPage}
      totalPosts={totalPosts}
      onPageChange={handlePageChange}
    />
  );
}

export default BlogPreview;