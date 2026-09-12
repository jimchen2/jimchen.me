import { listAllBlogMeta } from "@/lib/blogRepo";

/** GET /api/sitemap-data — the raw blog list used to build the sitemap. */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const blogs = await listAllBlogMeta();
    return res.status(200).json({ blogs });
  } catch (err) {
    console.error("Error fetching sitemap data:", err);
    return res
      .status(500)
      .json({ message: "Error fetching sitemap data", error: err.message });
  }
}
