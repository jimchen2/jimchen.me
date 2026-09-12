import { listAllPosts, listTypesWithCounts } from "@/lib/blogData";

/** Data behind `/sitemap.xml` (kept as a route so it can be inspected directly). */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const [blogs, types] = await Promise.all([listAllPosts(), listTypesWithCounts()]);

    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json({
      blogs: blogs.map(({ blogid, date }) => ({ blogid, date })),
      types: types.map((entry) => entry.type),
    });
  } catch (err) {
    console.error("Error fetching sitemap data:", err);
    return res.status(500).json({ message: "Error fetching sitemap data" });
  }
}
