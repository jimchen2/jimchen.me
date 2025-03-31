import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import BlogPreviewPage from "@/blogpreview/BlogPreviewPage";

export async function getServerSideProps(context) {
  const { page } = context.params || 1;
  const pageNumber = parseInt(page);
  // Get type from query parameters if available
  const { type } = context.query;

  try {
    const start = (pageNumber - 1) * 10; // 10 items per page
    const apiUrl = `${process.env.NEXT_PUBLIC_SITE}/api/blogpreview?start=${start}&count=10${type ? `&type=${type}` : ""}`;
    const response = await axios.get(apiUrl);
    const data = response.data.data || [];
    const pagination = response.data.pagination || {};

    // If requested page is beyond total pages, redirect to last page
    if (pageNumber > pagination.totalPages) {
      return {
        redirect: {
          destination: pagination.totalPages > 1 ? `/page/${pagination.totalPages}${type ? `?type=${type}` : ""}` : `/${type ? `?type=${type}` : ""}`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        data,
        pagination,
        type: type || null, // Pass type to the component props
      },
    };
  } catch (err) {
    return {
      props: {
        data: [],
        pagination: {
          currentPage: pageNumber,
          totalPages: 1,
          pageSize: 10,
          totalItems: 0,
        },
        type: type || null,
      },
    };
  }
}

function BlogPage({ data, pagination, type }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <BlogPreviewPage data={data} pagination={pagination}/>;
}

export default BlogPage;
