import {
  addComment,
  blogExists,
  DuplicateCommentError,
  InvalidParentError,
  listComments,
} from "@/lib/interactions";
import { getClientIp } from "@/lib/get-ip";
import { isRateLimited } from "@/lib/rateLimit";

const UUID_REGEX = /^[0-9a-f]{32}$/i;
const MAX_COMMENT_LENGTH = 5000;
const MAX_NAME_LENGTH = 60;

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { blogid, limit } = req.query;
      const parsedLimit = limit ? parseInt(limit, 10) : null;

      const comments = await listComments(
        blogid,
        Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : null,
      );

      return res.status(200).json(comments);
    }

    if (req.method === "POST") {
      const { user, text, blog, uuid, parentid } = req.body || {};

      if (isRateLimited(`comments:${getClientIp(req)}`, 10)) {
        return res.status(429).json({ error: "Too many requests. Please slow down." });
      }

      // --- INPUT VALIDATION ---
      if (!blog || !uuid || !text || typeof text !== "string" || !text.trim()) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!UUID_REGEX.test(uuid)) {
        return res.status(400).json({ error: "Invalid UUID format" });
      }

      if (text.length > MAX_COMMENT_LENGTH) {
        return res.status(400).json({ error: "Comment text too long" });
      }

      if (user && String(user).length > MAX_NAME_LENGTH) {
        return res.status(400).json({ error: "Name too long" });
      }

      if (!(await blogExists(blog))) {
        return res.status(400).json({ error: "Invalid blog ID" });
      }

      const comment = await addComment({
        user: user ? String(user).trim() : "anonymous",
        text,
        blog,
        uuid,
        parentid: parentid || null,
      });

      return res.status(201).json(comment);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (err) {
    if (err instanceof DuplicateCommentError || err instanceof InvalidParentError) {
      return res.status(400).json({ error: err.message });
    }

    console.error("Comment endpoint error:", err);
    return res.status(500).json({ error: "Error processing comment" });
  }
}
