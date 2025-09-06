import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import BlogPreviewPage from "@/blogpreview/BlogPreviewPage";

// --- I18N Imports ---
// 1. Import the function to load translations on the server.
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// 2. Import the hook to use translations in your component.
import { useTranslation } from 'next-i18next';

export async function getServerSideProps(context) {
  // 3. Get the current language ('en', 'zh', 'ru') from the URL.
  const { locale } = context;
  const { page = "1", type, sort, searchterm } = context.query;
  const pageNumber = parseInt(page) || 1;

  try {
    const start = (pageNumber - 1) * 10;

    // We no longer need the cookie. `locale` from Next.js is the source of truth.
    // const lang = context.req.cookies.language; // <-- This line is removed.

    const params = new URLSearchParams({
      start: start.toString(),
      count: "10",
    });

    if (type) params.append("type", type);
    if (sort) params.append("sort", sort);
    if (searchterm) params.append("searchterm", searchterm);

    // 4. Pass the current language to your backend API if it's not the default.
    // Assuming 'en' is your default/original language.
    if (locale && locale !== "en") {
      params.append("language", locale);
    }

    // Simplified URL construction. URLSearchParams handles this automatically.
    const apiUrl = `${process.env.NEXT_PUBLIC_SITE}/api/blogpreview?${params.toString()}`;

    const blogResponse = await axios.get(apiUrl);

    const data = blogResponse.data.data || [];
    const pagination = blogResponse.data.pagination || {};
    const postTypeArray = blogResponse.data.filters?.types || [];
    
    // If requested page is beyond total pages, redirect to last page
    if (pageNumber > 1 && pageNumber > pagination.totalPages) {
      // 5. Make sure redirects are also locale-aware.
      let redirectUrl = `/${locale}`; 
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
        // 6. THIS IS THE KEY: Load the 'common' namespace translations.
        // This makes the translations available to your entire app for this page.
        ...(await serverSideTranslations(locale, ['common'])),
        
        // Your original props
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
        // Also load translations on an error page so the layout doesn't break
        ...(await serverSideTranslations(locale, ['common'])),
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
  // 7. Use the translation hook to get the `t` function.
  const { t } = useTranslation('common');

  if (router.isFallback) {
    // 8. Use the `t` function to display translated text.
    return <div>{t('loading')}</div>;
  }

  return <BlogPreviewPage currentType={type} data={data} pagination={pagination} postTypeArray={postTypeArray} currentSort={sort} searchTerm={searchterm} />;
}

export default BlogPage;