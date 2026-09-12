import RSS from "rss";
import { listAllBlogMeta } from "@/lib/blogRepo";
import { displayTitle } from "@/lib/display";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE || "https://jimchen.me").replace(/\/$/, "");

/** GET /api/rss — the 15 most recent posts. */
export default async function handler(req, res) {
  try {
    const feed = new RSS({
      title: "Jim Chen's Blog",
      description: "Journals, travel notes and technical writing",
      feed_url: `${SITE_URL}/api/rss`,
      site_url: SITE_URL,
      language: "en",
      pubDate: new Date(),
    });

    const blogs = await listAllBlogMeta(15);

    for (const blog of blogs) {
      feed.item({
        title: displayTitle(blog.title),
        description: blog.preview_text || "",
        url: `${SITE_URL}/a/${blog.blogid}`,
        guid: blog.blogid,
        // `type` is an array; RSS categories must be flat strings.
        categories: (blog.type || []).map(String),
        date: blog.date ? new Date(blog.date) : undefined,
        author: "Jim Chen",
      });
    }

    res.setHeader("Content-Type", "application/rss+xml; charset=UTF-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(feed.xml({ indent: true }));
  } catch (error) {
    console.error("RSS feed generation error:", error);
    return res.status(500).json({
      message: "Error generating RSS feed",
      error: error.message,
    });
  }
}
