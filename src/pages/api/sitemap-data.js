import { sitemapBlogs } from "@/lib/blogStore";

/**
 * Fetches all blog data needed for sitemap generation
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const blogs = await sitemapBlogs();
    const serialized = blogs.map((blog) => ({
      blogid: blog.blogid,
      date: blog.date ? new Date(blog.date).toISOString() : null,
    }));
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
    res.status(200).json({ blogs: serialized });
  } catch (err) {
    console.error("Error fetching sitemap data:", err);
    res.status(500).json({
      message: "Error fetching sitemap data",
      error: err.message,
    });
  }
}
