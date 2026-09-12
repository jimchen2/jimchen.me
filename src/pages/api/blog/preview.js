import { listBlogs } from "@/lib/blogStore";
import { processAndSnippetBlog } from "@/lib/blogFormat";

const VALID_SORTS = ["date_oldest", "date_latest", "most_words", "least_words"];

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Parse and validate query parameters
    const start = Math.max(0, parseInt(req.query.start, 10) || 0);
    const count = Math.min(50, Math.max(1, parseInt(req.query.count, 10) || 10));
    const type = req.query.type || null;
    const sort = req.query.sort || "date_latest";
    const searchterm = req.query.searchterm || null;

    if (sort && !VALID_SORTS.includes(sort)) {
      return res.status(400).json({ message: "Invalid sort parameter" });
    }

    const { rows, pagination, types } = await listBlogs({
      start,
      count,
      type,
      sort,
      searchterm,
    });

    // Format dates and build search snippets
    const blogPreviews = rows.map((blog) =>
      processAndSnippetBlog(blog, searchterm)
    );

    return res.status(200).json({
      data: blogPreviews,
      pagination,
      filters: { types },
    });
  } catch (error) {
    console.error("Error in /api/blog/preview:", error);
    return res.status(500).json({ message: "Error fetching blog previews" });
  }
}
