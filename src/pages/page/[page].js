import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import BlogPreviewPage from "@/blogpreview/BlogPreviewPage";

export async function getServerSideProps(context) {
  const { page } = context.params || 1;
  const pageNumber = parseInt(page);
  const { type } = context.query;

  try {
    const start = (pageNumber - 1) * 10; // 10 items per page
    const apiUrl = `${process.env.NEXT_PUBLIC_SITE}/api/blogpreview?start=${start}&count=10${type ? `&type=${type}` : ""}`;

    // Perform both fetches in parallel using Promise.all
    const [blogResponse, typesResponse] = await Promise.all([axios.get(apiUrl), axios.get(`${process.env.NEXT_PUBLIC_SITE}/api/blogtypes`)]);

    const data = blogResponse.data.data || [];
    const pagination = blogResponse.data.pagination || {};
    const postTypeArray = typesResponse.data || [];

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
        type: type || null,
        postTypeArray,
      },
    };
  } catch (err) {
    console.error("Error fetching data:", err);
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
        postTypeArray: [],
      },
    };
  }
}

function BlogPage({ data, pagination, type, postTypeArray }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <BlogPreviewPage currentType={type} data={data} pagination={pagination} postTypeArray={postTypeArray} />;
}

export default BlogPage;
