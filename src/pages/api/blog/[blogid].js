import { getBlog } from "@/lib/blogStore";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { blogid } = req.query;

  try {
    const blog = await getBlog(blogid);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const serializable = {
      ...blog,
      date: blog.date ? new Date(blog.date).toISOString() : null,
    };
    delete serializable.plain_text;
    delete serializable.snippet_source;

    return res.status(200).json({ data: serializable });
  } catch (err) {
    console.error("Error fetching blog:", err);
    return res.status(500).json({ message: "Error fetching blog" });
  }
}
