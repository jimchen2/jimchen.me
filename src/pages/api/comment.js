import { isDemoMode } from "@/lib/blogData";
import dbConnect from "@/lib/dbConnect";

const UUID_RE = /^[0-9a-f]{32}$/i;
const MAX_TEXT_LENGTH = 5000;
const MAX_NAME_LENGTH = 60;

function formatComment(comment) {
  const date = new Date(comment.date);
  return {
    uuid: comment.uuid,
    user: comment.user_name,
    text: comment.text,
    blog: comment.blog_id,
    // 'uppointer' in the database is the list of replies; the UI calls it 'pointer'.
    pointer: comment.uppointer || [],
    date: Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" }),
  };
}

export default async function handler(req, res) {
  // Comments need a database (and a post to attach to), so they are disabled
  // while the site runs on the bundled example content.
  if (isDemoMode()) {
    if (req.method === "GET") return res.status(200).json([]);
    return res.status(503).json({ error: "Comments are disabled while the site runs on example content." });
  }

  let pool;
  try {
    pool = await dbConnect();
  } catch (err) {
    console.error("Database connection error:", err);
    return res.status(500).json({ error: "Database connection error" });
  }

  if (req.method === "GET") {
    const { blogid, limit } = req.query;

    try {
      const params = [];
      let query = "SELECT uuid, user_name, text, blog_id, uppointer, date FROM comments";

      if (blogid && blogid !== "0") {
        params.push(blogid);
        query += ` WHERE blog_id = $${params.length}`;
      }

      query += " ORDER BY date DESC";

      const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 0, 0), 500);
      if (parsedLimit > 0) {
        params.push(parsedLimit);
        query += ` LIMIT $${params.length}`;
      }

      const result = await pool.query(query, params);
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json(result.rows.map(formatComment));
    } catch (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).json({ error: "Error fetching comments" });
    }
  }

  if (req.method === "POST") {
    const { user, text, blog, uuid, parentid } = req.body || {};

    const trimmedText = typeof text === "string" ? text.trim() : "";
    const name = typeof user === "string" && user.trim() ? user.trim().slice(0, MAX_NAME_LENGTH) : "anonymous";

    if (!blog || !uuid || !trimmedText) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!UUID_RE.test(uuid)) {
      return res.status(400).json({ error: "Invalid UUID format" });
    }

    if (trimmedText.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ error: "Comment text too long" });
    }

    try {
      const blogExists = await pool.query("SELECT 1 FROM blogs WHERE blogid = $1", [blog]);
      if (blogExists.rows.length === 0) {
        return res.status(400).json({ error: "Invalid blog ID" });
      }

      const duplicate = await pool.query("SELECT 1 FROM comments WHERE uuid = $1", [uuid]);
      if (duplicate.rows.length > 0) {
        return res.status(400).json({ error: "Duplicate UUID detected" });
      }

      if (parentid) {
        const parent = await pool.query("SELECT 1 FROM comments WHERE uuid = $1", [parentid]);
        if (parent.rows.length === 0) {
          return res.status(400).json({ error: "Invalid parent comment ID" });
        }
      }

      const inserted = await pool.query(
        `INSERT INTO comments (uuid, user_name, text, blog_id, uppointer)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING uuid, user_name, text, blog_id, uppointer, date`,
        [uuid, name, trimmedText, blog, []],
      );

      if (parentid) {
        await pool.query(
          `UPDATE comments
           SET uppointer = array_append(COALESCE(uppointer, '{}'), $1::text), updated_at = CURRENT_TIMESTAMP
           WHERE uuid = $2`,
          [uuid, parentid],
        );
      }

      return res.status(201).json(formatComment(inserted.rows[0]));
    } catch (err) {
      console.error("Error creating comment:", err);
      return res.status(400).json({ error: "Error creating comment" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
