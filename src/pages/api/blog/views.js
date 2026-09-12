// pages/api/blog/views.js
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

  // Local example content has no database to record against.
  if (isDemoMode()) {
    return res.status(200).json({ views: 0, token: null, demo: true });
  }

  const userIp = getClientIp(req);

  if (isRateLimited(`${userIp}:views`, { limit: 30 })) {
    return res.status(429).json({ message: "Too many requests" });
  }

  const pool = await dbConnect();

  // --- GET: count + security token -------------------------------------
  if (req.method === "GET") {
    try {
      const countResult = await pool.query("SELECT COUNT(*) FROM blog_views WHERE blogid = $1", [blogid]);
      const totalViews = parseInt(countResult.rows[0].count, 10);

      return res.status(200).json({
        views: totalViews,
        token: generateSignature(blogid, userIp),
      });
    } catch (err) {
      console.error("Error fetching views:", err);
      return res.status(500).json({ message: "Error fetching data" });
    }
  }

  // --- POST: record one view per IP per day ----------------------------
  if (req.method === "POST") {
    try {
      const { token } = req.body || {};

      if (!token) {
        return res.status(403).json({ message: "Missing security token" });
      }

      if (!validateSignature(token, blogid, userIp)) {
        return res.status(403).json({ message: "Invalid session or IP mismatch" });
      }

      const checkResult = await pool.query(
        `SELECT 1 FROM blog_views
         WHERE blogid = $1 AND user_ip = $2 AND viewed_at::date = CURRENT_DATE`,
        [blogid, userIp],
      );

      if (checkResult.rowCount === 0) {
        await pool.query("INSERT INTO blog_views (blogid, user_ip, referrer) VALUES ($1, $2, $3)", [
          blogid,
          userIp,
          req.headers.referer || null,
        ]);
      }

      const countResult = await pool.query("SELECT COUNT(*) FROM blog_views WHERE blogid = $1", [blogid]);
      return res.status(200).json({ views: parseInt(countResult.rows[0].count, 10) });
    } catch (err) {
      console.error("Error recording view:", err);
      return res.status(500).json({ message: "Error updating views" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
