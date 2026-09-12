// src/lib/blogRepoPg.js
// Postgres implementation of the post store.
//
// This is the original SQL from pages/api/blog/preview.js, lifted out so that
// pages can query the database directly instead of making an HTTP call to the
// app's own API, and so the same code can be reused by RSS/sitemap.

import dbConnect from "./dbConnect.js";

const SORT_SQL = {
  date_latest: "date DESC",
  date_oldest: "date ASC",
  most_words: "word_count DESC",
  least_words: "word_count ASC",
};

/**
 * Builds the shared WHERE clause. Parameter indices are returned so callers can
 * keep referring to the search term (used for "title matches first" ordering).
 */
function buildWhere({ type, searchterm }) {
  const params = [];
  const conditions = [];
  let searchParamIndex = null;

  if (type) {
    params.push(type);
    conditions.push(`$${params.length} = ANY(type)`);
  }

  if (searchterm) {
    params.push(`%${searchterm}%`);
    searchParamIndex = params.length;
    conditions.push(
      `(REPLACE(title, '-', ' ') ILIKE $${searchParamIndex} OR body ILIKE $${searchParamIndex})`,
    );
  }

  return {
    clause: conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "",
    params,
    searchParamIndex,
  };
}

export async function pgListBlogPreviews({
  start = 0,
  count = 10,
  type = null,
  sort = "date_latest",
  searchterm = null,
}) {
  const pool = await dbConnect();

  // When searching we need the body to build a snippet around the match;
  // otherwise the pre-computed preview_text is enough.
  const columns = searchterm
    ? "id, blogid, title, date, type, word_count, created_at, updated_at, preview_image, preview_text, body"
    : "id, blogid, title, date, type, word_count, created_at, updated_at, preview_image, preview_text";

  const { clause, params, searchParamIndex } = buildWhere({ type, searchterm });

  let orderBy;
  if (searchterm && searchParamIndex) {
    orderBy = `ORDER BY CASE WHEN REPLACE(title, '-', ' ') ILIKE $${searchParamIndex} THEN 0 ELSE 1 END, date DESC`;
  } else {
    orderBy = `ORDER BY ${SORT_SQL[sort] || SORT_SQL.date_latest}`;
  }

  const query = `SELECT ${columns} FROM blogs${clause} ${orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  const queryParams = [...params, count, start];

  try {
    const result = await pool.query(query, queryParams);
    return result.rows;
  } catch (error) {
    console.error("Error fetching blog previews:", error);
    console.error("Failed query:", query);
    console.error("Failed params:", queryParams);
    throw error;
  }
}

export async function pgCountBlogPreviews({ type = null, searchterm = null }) {
  const pool = await dbConnect();
  const { clause, params } = buildWhere({ type, searchterm });

  try {
    const result = await pool.query(`SELECT COUNT(*) FROM blogs${clause}`, params);
    return parseInt(result.rows[0].count, 10);
  } catch (error) {
    console.error("Error counting blogs:", error);
    throw error;
  }
}

export async function pgGetBlog(blogid) {
  const pool = await dbConnect();
  const result = await pool.query(
    "SELECT blogid, title, body, date, type, word_count, preview_image, preview_text, created_at, updated_at FROM blogs WHERE blogid = $1",
    [blogid],
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    ...row,
    // Date objects are not serialisable into props.
    date: row.date instanceof Date ? row.date.toISOString() : row.date,
  };
}

export async function pgGetBlogTypesWithCounts() {
  const pool = await dbConnect();
  const query = `
    SELECT single_type AS type, COUNT(*) AS count
    FROM blogs, UNNEST(type) AS single_type
    WHERE type IS NOT NULL AND cardinality(type) > 0
    GROUP BY single_type
    ORDER BY count DESC
  `;

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    type: row.type,
    count: parseInt(row.count, 10),
  }));
}

export async function pgListAllBlogMeta(limit = null) {
  const pool = await dbConnect();
  const params = [];
  let query =
    "SELECT blogid, title, date, type, word_count, preview_text, updated_at FROM blogs ORDER BY date DESC";

  if (limit) {
    params.push(limit);
    query += ` LIMIT $${params.length}`;
  }

  const result = await pool.query(query, params);
  return result.rows.map((row) => ({
    ...row,
    date: row.date instanceof Date ? row.date.toISOString() : row.date,
  }));
}
