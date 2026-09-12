import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import BlogPreviewPage from "@/blogpreview/BlogPreviewPage";
import { listBlogs } from "@/lib/blogStore";
import { processAndSnippetBlog } from "@/lib/blogFormat";

const PAGE_SIZE = 10;

export async function getServerSideProps(context) {
  const { page = "1", type, sort, searchterm } = context.query;
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);

  // Exactly what the URL says; no implicit fallback filters.
  const effectiveType = typeof type === "string" && type ? type : null;
  const effectiveSort = typeof sort === "string" && sort ? sort : null;
  const effectiveSearch =
    typeof searchterm === "string" && searchterm ? searchterm : null;

  try {
    const { rows, pagination, types } = await listBlogs({
      start: (pageNumber - 1) * PAGE_SIZE,
      count: PAGE_SIZE,
      type: effectiveType,
      sort: effectiveSort || "date_latest",
      searchterm: effectiveSearch,
    });

    if (pageNumber > 1 && pageNumber > (pagination.totalPages || 1)) {
      const queryParams = new URLSearchParams();
      if (effectiveType) queryParams.set("type", effectiveType);
      if (effectiveSort) queryParams.set("sort", effectiveSort);
      if (effectiveSearch) queryParams.set("searchterm", effectiveSearch);
      if ((pagination.totalPages || 1) > 1) {
        queryParams.set("page", String(pagination.totalPages));
      }
      const qs = queryParams.toString();
      return {
        redirect: { destination: qs ? `/?${qs}` : "/", permanent: false },
      };
    }

    const data = rows.map((row) =>
      processAndSnippetBlog(row, effectiveSearch)
    );

    context.res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );

    return {
      props: {
        data,
        pagination: { ...pagination, currentPage: pageNumber },
        type: effectiveType,
        postTypeArray: types,
        sort: effectiveSort,
        searchterm: effectiveSearch,
        error: null,
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
        sort: effectiveSort,
        searchterm: effectiveSearch,
        error: "Failed to fetch data.",
      },
    };
  }
}

function BlogPage({ data, pagination, type, postTypeArray, sort, searchterm, error }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const heading = searchterm
    ? `Search: ${searchterm}`
    : type
      ? `Posts tagged #${type}`
      : "Jim Chen's Blog";

  return (
    <>
      <Head>
        <title>
          {type ? `#${type} — Jim Chen's Blog` : "Jim Chen's Blog"}
        </title>
        <meta
          name="description"
          content="Daily journals, travel notes and tech writing by Jim Chen: machine learning, systems, math, cooking and slow trains."
        />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE || ""}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={heading} />
        <meta
          property="og:description"
          content="Daily journals, travel notes and tech writing by Jim Chen."
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_SITE || ""}/image.png`}
        />
      </Head>
      <BlogPreviewPage
        currentType={type}
        data={data}
        pagination={pagination}
        postTypeArray={postTypeArray}
        currentSort={sort}
        searchTerm={searchterm}
        error={error}
      />
    </>
  );
}

export default BlogPage;
