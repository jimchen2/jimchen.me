import { getPost } from "@/lib/blogData";

/** A single post, including its body. */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { blogid } = req.query;

  if (!blogid) {
    return res.status(400).json({ message: "Missing blogid" });
  }

  try {
    const post = await getPost(blogid);

    if (!post) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600");
    // Previously this returned the whole `pg` result object; the row itself is
    // what every caller actually wants.
    return res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching blog:", err);
    return res.status(500).json({ message: "Error fetching blog" });
  }
}
