import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import BlogPreviewPage from "@/blogpreview/BlogPreviewPage";

export async function getServerSideProps(context) {
  // Extract page from query parameters instead of params
  const { page = "1", type, sort, searchterm } = context.query;
  const pageNumber = parseInt(page) || 1; // Default to 1 if page is invalid

  try {
    const start = (pageNumber - 1) * 10; // 10 items per page
    let apiUrl = `${process.env.NEXT_PUBLIC_SITE}/api/blog/preview?start=${start}&count=10`;

    if (type) {
      apiUrl += `&type=${type}`;
    }

    if (sort) {
      apiUrl += `&sort=${sort}`;
    }

    if (searchterm) {
      apiUrl += `&searchterm=${encodeURIComponent(searchterm)}`;
    }

    const blogResponse = await axios.get(apiUrl);

    const data = blogResponse.data.data || [];
    const pagination = blogResponse.data.pagination || {};
    const postTypeArray = blogResponse.data.filters?.types || [];

    // If requested page is beyond total pages, redirect to last page
    if (pageNumber > 1 && pageNumber > pagination.totalPages) {
      let redirectUrl = "/"; // Base path
      const queryParams = new URLSearchParams();
      if (type) queryParams.set("type", type);
      if (sort) queryParams.set("sort", sort);
      if (searchterm) queryParams.set("searchterm", searchterm);
      if (pagination.totalPages > 1) queryParams.set("page", pagination.totalPages);

      const queryString = queryParams.toString();
      if (queryString) {
        redirectUrl += `?${queryString}`;
      }

      return {
        redirect: {
          destination: redirectUrl,
          permanent: false,
        },
      };
    }

    return {
      props: {
        data,
        pagination: {
          ...pagination,
          currentPage: pageNumber, // Ensure currentPage is passed correctly
        },
        type: type || null,
        postTypeArray,
        sort: sort || null,
        searchterm: searchterm || null,
      },
    };
  } catch (err) {
    console.error("Error in getServerSideProps:", err);
    return {
      props: {
        data: [],
        pagination: {},
        type: type || null,
        postTypeArray: [],
        sort: sort || null,
        searchterm: searchterm || null,
        error: "Failed to fetch data.",
      },
    };
  }
}

function BlogPage({ data, pagination, type, postTypeArray, sort, searchterm }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <BlogPreviewPage currentType={type} data={data} pagination={pagination} postTypeArray={postTypeArray} currentSort={sort} searchTerm={searchterm} />;
}

export default BlogPage;