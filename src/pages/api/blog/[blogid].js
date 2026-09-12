import { getBlogByBlogid } from "@/lib/blogRepo";

/** GET /api/blog/:blogid — full post as JSON. */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { blogid } = req.query;

  try {
    const blog = await getBlogByBlogid(blogid);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(blog);
  } catch (err) {
    console.error("Error fetching blog:", err);
    return res.status(500).json({ message: "Error fetching blog", error: err.message });
  }
}
