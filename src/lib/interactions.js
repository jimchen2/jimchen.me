// src/lib/interactions.js
// Likes, view counters and comments.
//
// Same rule as the post store: Postgres when POSTGRESQL_URL is configured,
// otherwise an in-process store so the site is fully usable in development
// (state resets when the dev server restarts).

import dbConnect from "./dbConnect.js";
import { isDatabaseConfigured } from "./blogRepo.js";

// ---------------------------------------------------------------------------
// In-memory fallback
// ---------------------------------------------------------------------------

const memory = (globalThis.__blogMemory ??= {
  likes: new Map(), // blogid -> Set<ip>
  views: new Map(), // blogid -> Map<`${ip}:${day}` , true>
  comments: new Map(), // blogid -> [comment]
});

const today = () => new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------------------
// Likes
// ---------------------------------------------------------------------------

export async function getLikeState(blogid, ip) {
  if (!isDatabaseConfigured()) {
    const set = memory.likes.get(blogid);
    return { likes: set ? set.size : 0, liked: Boolean(set?.has(ip)) };
  }

  const pool = await dbConnect();
  const [countResult, userResult] = await Promise.all([
    pool.query("SELECT COUNT(*) FROM blog_likes WHERE blogid = $1", [blogid]),
    pool.query("SELECT 1 FROM blog_likes WHERE blogid = $1 AND user_ip = $2 LIMIT 1", [
      blogid,
      ip,
    ]),
  ]);

  return {
    likes: parseInt(countResult.rows[0].count, 10),
    liked: userResult.rowCount > 0,
  };
}

export async function toggleLike(blogid, ip) {
  if (!isDatabaseConfigured()) {
    const set = memory.likes.get(blogid) ?? new Set();
    let liked;
    if (set.has(ip)) {
      set.delete(ip);
      liked = false;
    } else {
      set.add(ip);
      liked = true;
    }
    memory.likes.set(blogid, set);
    return { likes: set.size, liked, action: liked ? "liked" : "unliked" };
  }

  const pool = await dbConnect();
  const existing = await pool.query(
    "SELECT id FROM blog_likes WHERE blogid = $1 AND user_ip = $2",
    [blogid, ip],
  );

  let liked;
  if (existing.rowCount > 0) {
    await pool.query("DELETE FROM blog_likes WHERE blogid = $1 AND user_ip = $2", [
      blogid,
      ip,
    ]);
    liked = false;
  } else {
    await pool.query(
      "INSERT INTO blog_likes (blogid, user_ip) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [blogid, ip],
    );
    liked = true;
  }

  const countResult = await pool.query("SELECT COUNT(*) FROM blog_likes WHERE blogid = $1", [
    blogid,
  ]);

  return {
    likes: parseInt(countResult.rows[0].count, 10),
    liked,
    action: liked ? "liked" : "unliked",
  };
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

export async function getViewState(blogid) {
  if (!isDatabaseConfigured()) {
    return { views: memory.views.get(blogid)?.size ?? 0 };
  }

  const pool = await dbConnect();
  const result = await pool.query("SELECT COUNT(*) FROM blog_views WHERE blogid = $1", [
    blogid,
  ]);
  return { views: parseInt(result.rows[0].count, 10) };
}

/**
 * Records one view per IP per day and returns the (possibly unchanged) count.
 */
export async function recordView(blogid, ip, referrer = null) {
  if (!isDatabaseConfigured()) {
    const bucket = memory.views.get(blogid) ?? new Map();
    bucket.set(`${ip}:${today()}`, true);
    memory.views.set(blogid, bucket);
    return { views: bucket.size, recorded: true };
  }

  const pool = await dbConnect();
  const existing = await pool.query(
    `SELECT id FROM blog_views
     WHERE blogid = $1 AND user_ip = $2 AND viewed_at::date = CURRENT_DATE`,
    [blogid, ip],
  );

  let recorded = false;
  if (existing.rowCount === 0) {
    await pool.query(
      "INSERT INTO blog_views (blogid, user_ip, referrer) VALUES ($1, $2, $3)",
      [blogid, ip, referrer],
    );
    recorded = true;
  }

  const countResult = await pool.query("SELECT COUNT(*) FROM blog_views WHERE blogid = $1", [
    blogid,
  ]);
  return { views: parseInt(countResult.rows[0].count, 10), recorded };
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

function formatComment(row) {
  const date = new Date(row.date);
  return {
    uuid: row.uuid,
    user: row.user_name,
    text: row.text,
    blog: row.blog_id,
    pointer: row.uppointer || [],
    date: Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
  };
}

export async function listComments(blogid, limit = null) {
  if (!isDatabaseConfigured()) {
    const rows = memory.comments.get(blogid) ?? [];
    const sorted = [...rows].sort((a, b) => new Date(b.date) - new Date(a.date));
    return (limit ? sorted.slice(0, limit) : sorted).map(formatComment);
  }

  const pool = await dbConnect();
  const params = [];
  let query =
    "SELECT uuid, user_name, text, blog_id, uppointer, date FROM comments";

  if (blogid && blogid !== "0") {
    params.push(blogid);
    query += ` WHERE blog_id = $${params.length}`;
  }

  query += " ORDER BY date DESC";

  if (limit) {
    params.push(limit);
    query += ` LIMIT $${params.length}`;
  }

  const result = await pool.query(query, params);
  return result.rows.map(formatComment);
}

export async function blogExists(blogid) {
  if (!isDatabaseConfigured()) {
    // Local mode: every rendered post is commentable, and the page already
    // 404s for unknown ids, so there is nothing extra to validate here.
    return true;
  }

  const pool = await dbConnect();
  const result = await pool.query("SELECT 1 FROM blogs WHERE blogid = $1", [blogid]);
  return result.rows.length > 0;
}

export async function addComment({ user, text, blog, uuid, parentid }) {
  const comment = {
    uuid,
    user_name: user || "anonymous",
    text,
    blog_id: blog,
    uppointer: [],
    date: new Date().toISOString(),
  };

  if (!isDatabaseConfigured()) {
    const rows = memory.comments.get(blog) ?? [];
    if (rows.some((row) => row.uuid === uuid)) {
      throw new DuplicateCommentError("Duplicate UUID detected");
    }
    if (parentid) {
      const parent = rows.find((row) => row.uuid === parentid);
      if (!parent) throw new InvalidParentError("Invalid parent comment ID");
      parent.uppointer = [...(parent.uppointer || []), uuid];
    }
    rows.push(comment);
    memory.comments.set(blog, rows);
    return formatComment(comment);
  }

  const pool = await dbConnect();

  const duplicate = await pool.query("SELECT 1 FROM comments WHERE uuid = $1", [uuid]);
  if (duplicate.rows.length > 0) {
    throw new DuplicateCommentError("Duplicate UUID detected");
  }

  if (parentid) {
    const parent = await pool.query("SELECT uppointer FROM comments WHERE uuid = $1", [
      parentid,
    ]);
    if (parent.rows.length === 0) {
      throw new InvalidParentError("Invalid parent comment ID");
    }

    const newPointers = [...(parent.rows[0].uppointer || []), uuid];
    await pool.query(
      "UPDATE comments SET uppointer = $1, updated_at = CURRENT_TIMESTAMP WHERE uuid = $2",
      [newPointers, parentid],
    );
  }

  const result = await pool.query(
    `INSERT INTO comments (uuid, user_name, text, blog_id, uppointer)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [comment.uuid, comment.user_name, comment.text, comment.blog_id, []],
  );

  return formatComment(result.rows[0]);
}

export class DuplicateCommentError extends Error {}
export class InvalidParentError extends Error {}
