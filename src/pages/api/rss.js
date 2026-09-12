// pages/api/rss.js
import RSS from "rss";

import { listAllPosts, resolveSiteUrl } from "@/lib/blogData";
import { formatTitle, stripHtml, truncate } from "@/lib/format";

export default async function handler(req, res) {
  const siteUrl = resolveSiteUrl(req);

  try {
    const posts = await listAllPosts({ limit: 20 });

    const feed = new RSS({
      title: "Jim Chen's Blog",
      description: "Daily journals, notes and technical posts.",
      feed_url: `${siteUrl}/api/rss`,
      site_url: siteUrl,
      image_url: `${siteUrl}/image.png`,
      language: "en",
      pubDate: posts[0]?.date ? new Date(posts[0].date) : new Date(),
      ttl: 60,
    });

    posts.forEach((post) => {
      const tags = Array.isArray(post.type) ? post.type : [];
      feed.item({
        title: formatTitle(post.title),
        // Posts are stored as HTML; RSS readers render a text description best.
        description: post.preview_text
          ? String(post.preview_text)
          : truncate(stripHtml(post.body || ""), 400),
        url: `${siteUrl}/a/${post.blogid}`,
        guid: `${siteUrl}/a/${post.blogid}`,
        categories: tags,
        date: new Date(post.date),
      });
    });

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(feed.xml({ indent: true }));
  } catch (error) {
    console.error("RSS feed generation error:", error);
    return res.status(500).json({ message: "Error generating RSS feed" });
  }
}
