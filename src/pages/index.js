import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import BlogPreviewPage from "@/blogpreview/BlogPreviewPage";

export async function getServerSideProps(context) {
  const { page = "1", type, sort, searchterm } = context.query;
  const pageNumber = parseInt(page) || 1;

  // Set effectiveType to URL's 'type' if present. 
  // If no type AND no searchterm are present (standard homepage), default to "tech".
  let effectiveType = type;
  if (!type && !searchterm) {
    effectiveType = "tech";
  }

  try {
    const start = (pageNumber - 1) * 10;
    let apiUrl = `${process.env.NEXT_PUBLIC_SITE}/api/blog/preview?start=${start}&count=10`;

    // Only append type to the API URL if we have an effectiveType
    if (effectiveType) {
      apiUrl += `&type=${effectiveType}`;
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

    if (pageNumber > 1 && pageNumber > pagination.totalPages) {
      let redirectUrl = "/";
      const queryParams = new URLSearchParams();
      
      // Conditionally append query parameters
      if (effectiveType) queryParams.set("type", effectiveType); 
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
        type: effectiveType || null, // Pass null if undefined so Next.js doesn't error on serializing
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
        type: effectiveType || null,
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

  return (
    <BlogPreviewPage 
      currentType={type} 
      data={data} 
      pagination={pagination} 
      postTypeArray={postTypeArray} 
      currentSort={sort} 
      searchTerm={searchterm} 
    />
  );
}

export default BlogPage;