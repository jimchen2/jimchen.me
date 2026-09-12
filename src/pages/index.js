import Head from "next/head";
import React from "react";

import BlogPreviewPage from "@/blogpreview/BlogPreviewPage";
import { isDemoMode, listPostPreviews, resolveSiteUrl, VALID_SORTS } from "@/lib/blogData";

const PAGE_SIZE = 10;

export async function getServerSideProps(context) {
  const { page = "1", type, sort, searchterm } = context.query;
  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const effectiveType = typeof type === "string" && type ? type : null;
  const effectiveSort = VALID_SORTS.includes(sort) ? sort : null;
  const effectiveTerm =
    typeof searchterm === "string" && searchterm.trim() ? searchterm.trim().slice(0, 120) : null;

  // The data layer is called directly: no HTTP request back into this same
  // server, and no dependency on NEXT_PUBLIC_SITE being set at runtime.
  try {
    const { rows, total, types } = await listPostPreviews({
      start: (pageNumber - 1) * PAGE_SIZE,
      count: PAGE_SIZE,
      type: effectiveType,
      sort: effectiveSort || "date_latest",
      searchterm: effectiveTerm,
    });

    const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

    if (pageNumber > totalPages) {
      const params = new URLSearchParams();
      if (effectiveType) params.set("type", effectiveType);
      if (effectiveSort) params.set("sort", effectiveSort);
      if (effectiveTerm) params.set("searchterm", effectiveTerm);
      if (totalPages > 1) params.set("page", String(totalPages));

      const queryString = params.toString();
      return {
        redirect: {
          destination: queryString ? `/?${queryString}` : "/",
          permanent: false,
        },
      };
    }

    if (context.res) {
      context.res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    }

    return {
      props: {
        data: rows,
        pagination: { totalPages, currentPage: pageNumber, totalItems: total, pageSize: PAGE_SIZE },
        type: effectiveType,
        postTypeArray: types,
        sort: effectiveSort,
        searchterm: effectiveTerm,
        demo: isDemoMode(),
        siteUrl: resolveSiteUrl(context.req),
      },
    };
  } catch (err) {
    console.error("Error in getServerSideProps:", err);
    return {
      props: {
        data: [],
        pagination: { totalPages: 1, currentPage: 1, totalItems: 0, pageSize: PAGE_SIZE },
        type: effectiveType,
        postTypeArray: [],
        sort: effectiveSort,
        searchterm: effectiveTerm,
        demo: isDemoMode(),
        siteUrl: resolveSiteUrl(context.req),
      },
    };
  }
}

export default function HomePage({ data, pagination, type, postTypeArray, sort, searchterm, demo, siteUrl }) {
  const title = searchterm
    ? `Search: ${searchterm}`
    : type
      ? `#${type}`
      : null;

  return (
    <>
      <Head>
        <title>{title ? `${title} — Jim Chen's Blog` : "Jim Chen's Blog"}</title>
        <meta
          name="description"
          content="Journals, notes and technical writing on software, systems and mathematics."
        />
        <meta name="robots" content={searchterm ? "noindex, follow" : "index, follow"} />
        <link rel="canonical" href={`${siteUrl}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Jim Chen's Blog" />
        <meta property="og:url" content={`${siteUrl}/`} />
        <link rel="alternate" type="application/rss+xml" title="Jim Chen's Blog" href="/api/rss" />
      </Head>

      <BlogPreviewPage
        currentType={type}
        data={data}
        pagination={pagination}
        postTypeArray={postTypeArray}
        currentSort={sort}
        searchTerm={searchterm}
        demo={demo}
      />
    </>
  );
}
