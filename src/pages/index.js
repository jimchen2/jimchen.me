// index.js

import React from "react";
import axios from "axios";
// NOTE: Use 'next/router' not 'next/navigation' for `locale` property
import { useRouter } from "next/router";
import BlogPreviewPage from "@/blogpreview/BlogPreviewPage";
import LanguagePreferencePopup from "../components/LanguagePreferencePopup"; // Adjust path if needed

// --- I18N Imports ---
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

// ... (your getServerSideProps function remains the same)
export async function getServerSideProps(context) {
  // 3. Get the current language ('en', 'zh', 'ru', or 'x-default') from the URL.
  const { locale } = context;
  const { page = "1", type, sort, searchterm } = context.query;
  const pageNumber = parseInt(page) || 1;

  try {
    const start = (pageNumber - 1) * 10;
    const params = new URLSearchParams({
      start: start.toString(),
      count: "10",
    });

    if (type) params.append("type", type);
    if (sort) params.append("sort", sort);
    if (searchterm) params.append("searchterm", searchterm);

    // 4. Pass the current language to your API.
    // If locale is 'x-default', you might want to send your primary language ('en') or nothing.
    // Let's assume your API defaults to English if no language is provided.
    if (locale && locale !== "x-default") {
      params.append("language", locale);
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_SITE}/api/blogpreview?${params.toString()}`;
    const blogResponse = await axios.get(apiUrl);
    const data = blogResponse.data.data || [];
    const pagination = blogResponse.data.pagination || {};
    const postTypeArray = blogResponse.data.filters?.types || [];

    if (pageNumber > 1 && pageNumber > pagination.totalPages) {
      // 5. Build locale-aware redirects correctly. 'x-default' will have no prefix.
      const redirectPrefix = locale === "x-default" ? "" : `/${locale}`;
      let redirectUrl = redirectPrefix + "/"; // Assuming this is the root page
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
        // 6. Use the `locale` variable from context.
        ...(await serverSideTranslations(locale, ["common"])),
        data,
        pagination: {
          ...pagination,
          currentPage: pageNumber,
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
        ...(await serverSideTranslations(locale, ["common"])),
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
  const { t } = useTranslation("common");

  if (router.isFallback) {
    return <div>{t("loading")}</div>;
  }

  return (
    <>
      {/* This component will manage its own visibility */}
      <LanguagePreferencePopup />
      <BlogPreviewPage currentType={type} data={data} pagination={pagination} postTypeArray={postTypeArray} currentSort={sort} searchTerm={searchterm} />
    </>
  );
}

export default BlogPage;
