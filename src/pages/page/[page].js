import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import BlogPreviewPage from "@/blogpreview/BlogPreviewPage";

export async function getServerSideProps(context) {
  const { page } = context.params || 1;
  const pageNumber = parseInt(page);

  try {
    const start = (pageNumber - 1) * 10; // 10 items per page
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SITE}/api/blogpreview?start=${start}&count=10`);

    const data = response.data.data || [];
    const pagination = response.data.pagination || {};

    // If requested page is beyond total pages, redirect to last page
    if (pageNumber > pagination.totalPages) {
      return {
        redirect: {
          destination: pagination.totalPages > 1 ? `/blog/page/${pagination.totalPages}` : "/blog",
          permanent: false,
        },
      };
    }

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
          currentPage: pageNumber,
          totalPages: 1,
          pageSize: 10,
          totalItems: 0,
        },
      },
    };
  }
}

function BlogPage({ data, pagination }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <BlogPreviewPage data={data} pagination={pagination} />;
}

export default BlogPage;
