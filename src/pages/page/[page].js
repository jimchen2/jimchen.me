import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import BlogPreviewPage from "@/blogpreview/BlogPreviewPage";

export async function getServerSideProps(context) {
  const { page = 1 } = context.params || {};
  const pageNumber = parseInt(page);
  const { type, sort } = context.query; 
  
  try {
    const start = (pageNumber - 1) * 10; // 10 items per page
    let apiUrl = `${process.env.NEXT_PUBLIC_SITE}/api/blogpreview?start=${start}&count=10`;

    if (type) {
      apiUrl += `&type=${type}`;
    }

    if (sort) {
      apiUrl += `&sort=${sort}`; // Append sort parameter
    }

    // Perform both fetches in parallel using Promise.all
    const [blogResponse, typesResponse] = await Promise.all([axios.get(apiUrl), axios.get(`${process.env.NEXT_PUBLIC_SITE}/api/blogtypes`)]);

    const data = blogResponse.data.data || [];
    const pagination = blogResponse.data.pagination || {};
    const postTypeArray = typesResponse.data || []; 
    
    // If requested page is beyond total pages, redirect to last page
    if (pageNumber > pagination.totalPages) {
      let redirectUrl = pagination.totalPages > 1 ? `/page/${pagination.totalPages}` : `/`;

      // Preserve type, and sort parameters during redirection
      const queryParams = {};
      if (type) queryParams.type = type;
      if (sort) queryParams.sort = sort;

      const queryString = Object.keys(queryParams)
        .map((key) => `${key}=${queryParams[key]}`)
        .join("&");

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
        postTypeArray,
        sort: sort || null,
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
        sort: sort || null,
      },
    };
  }
}

function BlogPage({ data, pagination, type, postTypeArray, sort }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <BlogPreviewPage currentType={type} data={data} pagination={pagination} postTypeArray={postTypeArray} sort={sort} />;
}

export default BlogPage;
