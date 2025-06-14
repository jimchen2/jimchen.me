import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import BlogPreviewPage from "@/blogpreview/BlogPreviewPage";

export async function getServerSideProps(context) {
  const { page = 1 } = context.params || {};
  const pageNumber = parseInt(page);
  const { type, sort, searchterm } = context.query;

  try {
    const start = (pageNumber - 1) * 10; // 10 items per page
    let apiUrl = `${process.env.NEXT_PUBLIC_SITE}/api/blogpreview?start=${start}&count=10`;

    if (type) {
      apiUrl += `&type=${type}`;
    }

    if (sort) {
      apiUrl += `&sort=${sort}`;
    }

    if (searchterm) {
      // FIX: Encode the searchterm to handle spaces and other special characters.
      apiUrl += `&searchterm=${encodeURIComponent(searchterm)}`;
    }

    // OPTIMIZATION: The /api/blogpreview endpoint already returns the types.
    // The separate call to /api/blogtypes is not needed.
    const blogResponse = await axios.get(apiUrl);

    const data = blogResponse.data.data || [];
    const pagination = blogResponse.data.pagination || {};
    // Get types from the main API response's 'filters' object
    const postTypeArray = blogResponse.data.filters?.types || [];

    // If requested page is beyond total pages, redirect to last page
    if (pageNumber > 1 && pageNumber > pagination.totalPages) {
      let redirectUrl = pagination.totalPages > 1 ? `/page/${pagination.totalPages}` : `/`;
      const queryParams = new URLSearchParams();
      if (type) queryParams.set("type", type);
      if (sort) queryParams.set("sort", sort);
      if (searchterm) queryParams.set("searchterm", searchterm);

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
        pagination,
        type: type || null,
        postTypeArray, // Sourced from the single API call
        sort: sort || null,
        searchterm: searchterm || null,
      },
    };
  } catch (err) {
    console.error("Error in getServerSideProps:", err);
    // Return empty props to prevent page from crashing
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

  return <BlogPreviewPage currentType={type} data={data} pagination={pagination} postTypeArray={postTypeArray} sort={sort} searchTerm={searchterm} />;
}

export default BlogPage;
