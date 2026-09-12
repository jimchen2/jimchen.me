import Head from "next/head";
import React from "react";

// KaTeX styles ship with the package (previously a version-mismatched CDN link).
import "katex/dist/katex.min.css";

import CommentSection from "@/comment/commentsection";
import SingleBlog from "@/singleblog/singleBlog";
import { getPost, isDemoMode, resolveSiteUrl } from "@/lib/blogData";
import { formatPostDate, formatTitle, stripHtml, truncate } from "@/lib/format";

export default function BlogPost({ blog, demo, siteUrl }) {
  const description = truncate(stripHtml(blog.body), 160);
  const tags = Array.isArray(blog.type) ? blog.type : [];
  const canonicalUrl = `${siteUrl}/a/${blog.blogid}`;
  const title = formatTitle(blog.title);
  const iso = blog.date ? new Date(blog.date).toISOString() : null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: iso,
    dateModified: iso,
    url: canonicalUrl,
    author: { "@type": "Person", name: "Jim Chen", url: siteUrl },
    keywords: tags.join(", "),
    ...(blog.preview_image ? { image: blog.preview_image } : {}),
  };

  return (
    <>
      <Head>
        <title>{`${title} — Jim Chen's Blog`}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={[...tags, "blog"].join(", ")} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        {blog.preview_image ? <meta property="og:image" content={blog.preview_image} /> : null}
        {iso ? <meta property="article:published_time" content={iso} /> : null}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- static, generated data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <SingleBlog
        title={title}
        text={blog.body}
        type={tags}
        blogid={blog.blogid}
        wordcount={blog.word_count}
        demo={demo}
        date={iso ? { iso, label: formatPostDate(blog.date, "long") } : null}
      />

      {!demo && <CommentSection blogid={blog.blogid} />}
    </>
  );
}

export async function getServerSideProps(context) {
  const { blogid } = context.params;

  try {
    const blog = await getPost(blogid);

    if (!blog) {
      return { notFound: true };
    }

    if (context.res) {
      context.res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600");
    }

    return {
      props: {
        demo: isDemoMode(),
        siteUrl: resolveSiteUrl(context.req),
        blog: {
          blogid: blog.blogid,
          title: blog.title,
          body: blog.body,
          date: blog.date instanceof Date ? blog.date.toISOString() : blog.date,
          type: Array.isArray(blog.type) ? blog.type : blog.type ? [blog.type] : [],
          word_count: blog.word_count ?? 0,
          preview_image: blog.preview_image || null,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return { notFound: true };
  }
}
