import React from "react";
import axios from "axios";
import BlogPreviewPage from "@/blogpreview/BlogPreviewPage";

export async function getServerSideProps() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SITE}/api/blogpreview?start=0&count=10`);
    const data = response.data.data || [];
    const pagination = response.data.pagination || {};

    return {
      props: {
        data,
        pagination,
      },
    };
  } catch (err) {
    console.error("Error fetching blog preview data:", err);
    return {
      props: {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          pageSize: 10,
          totalItems: 0,
        },
      },
    };
  }
}

function BlogPreview({ data, pagination }) {
  return <BlogPreviewPage data={data} pagination={pagination} />;
}

export default BlogPreview;
