// pages/api/blog/likes.js
import { isDemoMode } from "@/lib/blogData";
import dbConnect from "@/lib/dbConnect";
import { getClientIp } from "@/lib/get-ip";
import { isRateLimited } from "@/lib/rateLimit";
import { generateSignature, validateSignature } from "@/lib/security";

export default async function handler(req, res) {
  const { blogid } = req.query;

  if (!blogid) {
    return res.status(400).json({ message: "Missing blogid" });
  }

  if (isDemoMode()) {
    return res.status(200).json({ likes: 0, liked: false, token: null, demo: true });
  }

  // The IP is always derived server-side, never trusted from the body.
  const userIp = getClientIp(req);

  if (isRateLimited(`${userIp}:likes`, { limit: 20 })) {
    return res.status(429).json({ message: "Too many requests. Please slow down." });
  }

  const pool = await dbConnect();

  // --- GET: count, whether this visitor liked it, and a token ----------
  if (req.method === "GET") {
    try {
      const [countResult, userStatusResult] = await Promise.all([
        pool.query("SELECT COUNT(*) FROM blog_likes WHERE blogid = $1", [blogid]),
        pool.query("SELECT 1 FROM blog_likes WHERE blogid = $1 AND user_ip = $2 LIMIT 1", [
          blogid,
          userIp,
        ]),
      ]);

      return res.status(200).json({
        likes: parseInt(countResult.rows[0].count, 10),
        liked: userStatusResult.rowCount > 0,
        token: generateSignature(blogid, userIp),
      });
    } catch (err) {
      console.error("Error fetching likes:", err);
      return res.status(500).json({ message: "Error fetching data" });
    }
  }

  // --- POST: toggle the like -------------------------------------------
  if (req.method === "POST") {
    try {
      const { token } = req.body || {};

      if (!token) {
        return res.status(403).json({ message: "Missing security token" });
      }

      if (!validateSignature(token, blogid, userIp)) {
        return res.status(403).json({ message: "Invalid session or IP mismatch" });
      }

      const existing = await pool.query("SELECT id FROM blog_likes WHERE blogid = $1 AND user_ip = $2", [
        blogid,
        userIp,
      ]);

      let liked;
      if (existing.rowCount > 0) {
        await pool.query("DELETE FROM blog_likes WHERE blogid = $1 AND user_ip = $2", [blogid, userIp]);
        liked = false;
      } else {
        await pool.query(
          "INSERT INTO blog_likes (blogid, user_ip) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [blogid, userIp],
        );
        liked = true;
      }

      const countResult = await pool.query("SELECT COUNT(*) FROM blog_likes WHERE blogid = $1", [blogid]);

      return res.status(200).json({
        message: liked ? "Successfully liked" : "Successfully unliked",
        likes: parseInt(countResult.rows[0].count, 10),
        liked,
      });
    } catch (err) {
      console.error("Error toggling like:", err);
      return res.status(500).json({ message: "Error updating like" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
