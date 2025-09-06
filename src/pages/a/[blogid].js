import dbConnect from "@/lib/db/dbConnect";
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router"; // Use next/router for locale info
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import SingleBlog from "@/blogcontent/singleBlog";
import Msg from "@/comment/leaveamessage";

export default function Blog({ blog, tags, error }) {
  const { i18n } = useTranslation("common"); // For accessing current language
  const router = useRouter();

  if (error) {
    // You could use the 't' function here for a translated error message
    // const { t } = useTranslation('common');
    // return <div>{t('error.blog-load-failed')}</div>;
    return <div>Error: {error}</div>;
  }

  if (!blog || router.isFallback) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  // --- SEO and Metadata ---
  const description = blog.body.substring(0, 160).trim() + (blog.body.length > 160 ? "..." : "");
  const tagsString = Array.isArray(tags) && tags.length > 0 ? tags.join(", ") : "blog";
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE}/a/${blog.blogid}`;

  const formattingLocale = i18n.language === "x-default" ? "en" : i18n.language;

  const displayDate = new Date(blog.date).toLocaleString(formattingLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${tagsString}, ${blog.title}, blog`} />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={blog.preview_image || `${process.env.NEXT_PUBLIC_SITE}/default-blog-image.jpg`} />
        {/* Set OG locale based on current language for better social sharing */}
        <meta property="og:locale" content={i18n.language} />

        {/* --- SEO: i18n Links --- */}
        {/* Canonical link should point to the non-prefixed URL if that's your standard */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Hreflang tags to tell Google about other language versions */}
        <link rel="alternate" hrefLang="x-default" href={`${process.env.NEXT_PUBLIC_SITE}/a/${blog.blogid}`} />
        <link rel="alternate" hrefLang="en" href={`${process.env.NEXT_PUBLIC_SITE}/en/a/${blog.blogid}`} />
        <link rel="alternate" hrefLang="zh" href={`${process.env.NEXT_PUBLIC_SITE}/zh/a/${blog.blogid}`} />
        <link rel="alternate" hrefLang="ru" href={`${process.env.NEXT_PUBLIC_SITE}/ru/a/${blog.blogid}`} />
      </Head>
      <div>
        <SingleBlog title={blog.title} text={blog.body} type={tagsString} blogid={blog.blogid} date={displayDate} wordcount={blog.word_count} istranslated={blog.is_translated} />
        <Msg blogid={blog.blogid} blogname={blog.title} />
      </div>
    </>
  );
}

// ===================================================================
// MODERNIZED getServerSideProps using next-i18next
// ===================================================================

export async function getServerSideProps(context) {
  // 1. Get locale and blogid from the context provided by Next.js routing
  const {
    locale,
    params: { blogid },
  } = context; // <-- CORRECTED LINE

  try {
    // 2. Determine the correct table name based on the URL's locale
    // SECURITY: Whitelist languages to prevent SQL injection.
    const allowedLangs = ["zh", "en", "ru"];
    // The default 'blogs' table corresponds to the 'x-default' locale in your next.config
    let tableName = "blogs";

    if (locale && allowedLangs.includes(locale)) {
      tableName = `blogs_${locale}`;
    }

    const pool = await dbConnect();

    // 3. Use the dynamic tableName in the query
    const query = `
      SELECT blogid, tags, title, body, date, is_translated, word_count, preview_image, preview_text
      FROM ${tableName}
      WHERE blogid = $1
    `;
    const result = await pool.query(query, [blogid]);

    if (result.rows.length === 0) {
      return { notFound: true };
    }

    const blogData = result.rows[0];
    const blog = {
      ...blogData,
      date: blogData.date.toISOString(), // Serialize date
    };

    // 4. Load translation files for UI components (like headers, footers, buttons)
    // 'common' refers to 'public/locales/[locale]/common.json'
    const translations = await serverSideTranslations(locale ?? "en", ["common"]);

    return {
      props: {
        // Merge the translation props with your page-specific props
        ...translations,
        blog,
        tags: blog.tags,
        error: null,
      },
    };
  } catch (error) {
    console.error(`Error fetching blog data for blogid ${blogid} in locale ${locale}:`, error);
    return {
      props: {
        // Still need to pass translations for the error page layout
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
        blog: null,
        tags: null,
        error: "Failed to fetch blog data. Please try again later.",
      },
    };
  }
}
