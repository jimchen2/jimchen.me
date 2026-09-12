// pages/api/rss.js
import RSS from "rss";
import { recentBlogs } from "@/lib/blogStore";
import { stripHtml } from "@/lib/blogFormat";

export default async function handler(req, res) {
  try {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["host"];
    const siteUrl = process.env.NEXT_PUBLIC_SITE || `${protocol}://${host}`;

    const feed = new RSS({
      title: "Jim Chen's Blog",
      description: "Daily Journals and Tech Notes",
      feed_url: `${siteUrl}/api/rss`,
      site_url: siteUrl,
      language: "en",
      pubDate: new Date(),
      image_url: `${siteUrl}/image.png`,
    });

    const blogs = await recentBlogs(15);

    blogs.forEach((blog) => {
      const plain = stripHtml(blog.preview_text || blog.body || "");
      feed.item({
        title: blog.title,
        description: plain.length > 500 ? `${plain.slice(0, 500)}...` : plain,
        url: `${siteUrl}/a/${blog.blogid}`,
        guid: `${siteUrl}/a/${blog.blogid}`,
        categories: Array.isArray(blog.type) ? blog.type : [],
        date: new Date(blog.date),
      });
    });

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate");
    res.status(200).send(feed.xml());
  } catch (error) {
    console.error("RSS feed generation error:", error);
    res.status(500).json({
      message: "Error generating RSS feed",
      error: error.message,
    });
  }
}
