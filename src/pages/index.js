import React from "react";
import Head from "next/head";
import BlogPreviewPage from "@/blogpreview/BlogPreviewPage";
// Only referenced inside getServerSideProps, so Next keeps this (and `pg`) out
// of the client bundle.
import { listBlogPreviews, POSTS_PER_PAGE, SORT_OPTIONS } from "@/lib/blogRepo";

const MAX_POSTS_PER_PAGE = 50;

export async function getServerSideProps(context) {
  const { page, count, type, sort, searchterm } = context.query;

  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const requestedCount = parseInt(count, 10);
  const pageSize = Number.isFinite(requestedCount)
    ? Math.min(Math.max(requestedCount, 1), MAX_POSTS_PER_PAGE)
    : POSTS_PER_PAGE;

  // `type` can arrive as an array when the URL repeats the param; take the first.
  const effectiveType = Array.isArray(type) ? type[0] || null : type || null;
  const effectiveSort = SORT_OPTIONS.includes(sort) ? sort : null;
  const effectiveSearch = Array.isArray(searchterm)
    ? searchterm[0]?.trim() || null
    : searchterm?.trim() || null;

  // The listing is identical for everyone, so let the CDN cache it briefly.
  context.res?.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300",
  );

  try {
    const { posts, pagination, types } = await listBlogPreviews({
      start: (pageNumber - 1) * pageSize,
      count: pageSize,
      type: effectiveType,
      sort: effectiveSort || "date_latest",
      searchterm: effectiveSearch,
    });

    // Asking for a page past the end lands you on the last real page.
    if (pageNumber > pagination.totalPages) {
      const query = new URLSearchParams();
      if (effectiveType) query.set("type", effectiveType);
      if (effectiveSort) query.set("sort", effectiveSort);
      if (effectiveSearch) query.set("searchterm", effectiveSearch);
      if (effectiveSearch || pagination.totalPages > 1) {
        query.set("page", String(pagination.totalPages));
      }
      const qs = query.toString();
      return { redirect: { destination: qs ? `/?${qs}` : "/", permanent: false } };
    }

    return {
      props: {
        data: posts,
        pagination,
        type: effectiveType,
        postTypeArray: types,
        sort: effectiveSort,
        searchterm: effectiveSearch,
      },
    };
  } catch (err) {
    console.error("Error loading the post list:", err);
    return {
      props: {
        data: [],
        pagination: {},
        type: effectiveType,
        postTypeArray: [],
        sort: effectiveSort,
        searchterm: effectiveSearch,
        error: "Failed to load posts.",
      },
    };
  }
}

export default function BlogPage({
  data,
  pagination,
  type,
  postTypeArray,
  sort,
  searchterm,
  error,
}) {
  const totalItems = pagination?.totalItems ?? data?.length ?? 0;
  const description = searchterm
    ? `Search results for "${searchterm}" on Jim Chen's blog.`
    : `Journals, travel notes and technical writing by Jim Chen — ${totalItems} posts.`;

  return (
    <>
      <Head>
        <title>
          {searchterm
            ? `Search: ${searchterm} — Jim Chen's Blog`
            : type
              ? `#${type} — Jim Chen's Blog`
              : "Jim Chen's Blog"}
        </title>
        <meta name="description" content={description} />
        <meta property="og:title" content="Jim Chen's Blog" />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
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
