import { listBlogPreviews, SORT_OPTIONS, POSTS_PER_PAGE } from "@/lib/blogRepo";

/**
 * GET /api/blog/preview?start=0&count=10&type=journal&sort=date_latest&searchterm=...
 *
 * The home page queries the repository directly now; this endpoint stays for
 * external consumers (and is handy for debugging).
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const start = Math.max(0, parseInt(req.query.start, 10) || 0);
  const count = Math.min(
    Math.max(parseInt(req.query.count, 10) || POSTS_PER_PAGE, 1),
    50,
  );
  const type = req.query.type || null;
  const sort = req.query.sort || "date_latest";
  const searchterm = req.query.searchterm?.trim() || null;

  if (!SORT_OPTIONS.includes(sort)) {
    return res.status(400).json({ message: "Invalid sort parameter" });
  }

  try {
    const { posts, pagination, types } = await listBlogPreviews({
      start,
      count,
      type,
      sort,
      searchterm,
    });

    return res.status(200).json({
      data: posts,
      pagination,
      filters: {
        types,
        sortOptions: SORT_OPTIONS,
      },
    });
  } catch (err) {
    console.error("Error in blog API handler:", err);
    return res
      .status(500)
      .json({ message: "Error fetching blog data", error: err.message });
  }
}
