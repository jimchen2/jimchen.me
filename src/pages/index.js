import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import BlogPreviewPage from "@/blogpreview/BlogPreviewPage";

export async function getServerSideProps(context) {
  const { page = "1", type, sort, searchterm } = context.query;
  const pageNumber = parseInt(page) || 1;

  // Default to "tech" if no type is specified
  const effectiveType = type || "tech";

  try {
    const start = (pageNumber - 1) * 10;
    let apiUrl = `${process.env.NEXT_PUBLIC_SITE}/api/blog/preview?start=${start}&count=10`;

    // Always send a type — defaults to "tech"
    apiUrl += `&type=${effectiveType}`;

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

    if (pageNumber > 1 && pageNumber > pagination.totalPages) {
      let redirectUrl = "/";
      const queryParams = new URLSearchParams();
      queryParams.set("type", effectiveType); // keep effectiveType in redirect too
      if (sort) queryParams.set("sort", sort);
      if (searchterm) queryParams.set("searchterm", searchterm);
      if (pagination.totalPages > 1) queryParams.set("page", pagination.totalPages);

      return {
        redirect: {
          destination: `${redirectUrl}?${queryParams.toString()}`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        data,
        pagination: { ...pagination, currentPage: pageNumber },
        type: effectiveType, // pass effectiveType so UI reflects the active filter
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
        type: effectiveType,
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