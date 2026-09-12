import { VALID_SORTS, listPostPreviews } from "@/lib/blogData";

/**
 * Blog previews for the homepage: filtering, sorting, search + pagination.
 *
 * The heavy lifting lives in `@/lib/blogData`, which reads from Postgres when
 * `POSTGRESQL_URL` is configured and from `content/posts/*.md` otherwise. Pages
 * call that module directly instead of fetching this route over HTTP.
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const start = Math.max(parseInt(req.query.start, 10) || 0, 0);
  const count = Math.min(Math.max(parseInt(req.query.count, 10) || 10, 1), 50);
  const type = typeof req.query.type === "string" && req.query.type ? req.query.type : null;
  const searchterm =
    typeof req.query.searchterm === "string" && req.query.searchterm
      ? req.query.searchterm.slice(0, 120)
      : null;
  const sort = VALID_SORTS.includes(req.query.sort) ? req.query.sort : "date_latest";

  try {
    const { rows, total, types } = await listPostPreviews({ start, count, type, sort, searchterm });

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      data: rows,
      pagination: {
        totalPages: Math.ceil(total / count),
        currentPage: Math.floor(start / count) + 1,
        pageSize: count,
        totalItems: total,
        type,
        sort,
        searchterm,
      },
      filters: {
        types,
        sortOptions: VALID_SORTS,
      },
    });
  } catch (err) {
    console.error("Error in blog preview API:", err);
    return res.status(500).json({ message: "Error fetching blog data" });
  }
}
