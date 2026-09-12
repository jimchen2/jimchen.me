/**
 * All Postgres reads for the blog, extracted from the API routes so the same
 * queries can be shared by pages (getServerSideProps), APIs and the sitemap.
 */
import dbConnect from "./dbConnect";

/**
 * Fetches a page of blog previews with filtering, sorting and searching.
 */
export async function fetchBlogPreviews(
  start,
  count,
  type = null,
  sort = "date_latest",
  searchterm = null
) {
  const pool = await dbConnect();

  // If searching we need the full body to build a relevant snippet,
  // otherwise the pre-made preview_text is enough.
  const selectClause = searchterm
    ? `SELECT id, blogid, title, date, type, word_count, created_at, updated_at, preview_image, body`
    : `SELECT id, blogid, title, date, type, word_count, created_at, updated_at, preview_image, preview_text`;

  let query = `${selectClause} FROM blogs`;
  const queryParams = [];
  const conditions = [];

  if (type) {
    queryParams.push(type);
    conditions.push(`$${queryParams.length} = ANY(type)`);
  }

  if (searchterm) {
    queryParams.push(`%${searchterm}%`);
    const searchIndex = queryParams.length;
    // Matches hyphens in titles against spaces in the search term.
    conditions.push(
      `(REPLACE(title, '-', ' ') ILIKE $${searchIndex} OR body ILIKE $${searchIndex})`
    );
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  let sortQuery;
  if (searchterm) {
    const searchIndex = queryParams.findIndex((p) =>
      String(p).includes(searchterm)
    );
    sortQuery = `ORDER BY CASE WHEN REPLACE(title, '-', ' ') ILIKE $${
      searchIndex + 1
    } THEN 0 ELSE 1 END, date DESC`;
  } else {
    const sortCriteria = {
      date_oldest: "date ASC",
      most_words: "word_count DESC",
      least_words: "word_count ASC",
      date_latest: "date DESC",
    };
    sortQuery = `ORDER BY ${sortCriteria[sort] || sortCriteria.date_latest}`;
  }
  query += ` ${sortQuery}`;

  queryParams.push(count, start);
  query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;

  try {
    const result = await pool.query(query, queryParams);
    return result.rows;
  } catch (error) {
    console.error("Error fetching blog previews:", error);
    console.error("Failed Query:", query);
    console.error("Failed Params:", queryParams);
    throw error;
  }
}

/**
 * Total blogs and pages, respecting active filters / search terms.
 * Must mirror fetchBlogPreviews' WHERE clause exactly.
 */
export async function calculatePaginationInfo(count = 10, type = null, searchterm = null) {
  const pool = await dbConnect();
  let query = "SELECT COUNT(*) FROM blogs";
  const queryParams = [];
  const conditions = [];

  if (type) {
    queryParams.push(type);
    conditions.push(`$${queryParams.length} = ANY(type)`);
  }

  if (searchterm) {
    queryParams.push(`%${searchterm}%`);
    const searchIndex = queryParams.length;
    conditions.push(
      `(REPLACE(title, '-', ' ') ILIKE $${searchIndex} OR body ILIKE $${searchIndex})`
    );
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  const result = await pool.query(query, queryParams);
  const totalBlogs = parseInt(result.rows[0].count, 10);
  return { totalBlogs, totalPages: Math.ceil(totalBlogs / count) };
}

/** All unique blog types with post counts. */
export async function getBlogTypesWithCounts() {
  const pool = await dbConnect();
  const query = `
    SELECT single_type AS type, COUNT(*) AS count
    FROM blogs, UNNEST(type) AS single_type
    WHERE type IS NOT NULL AND cardinality(type) > 0
    GROUP BY single_type
    ORDER BY count DESC;
  `;
  const result = await pool.query(query);
  return result.rows.map((row) => ({
    type: row.type,
    count: parseInt(row.count, 10),
  }));
}

/** A single full blog row, or null. */
export async function getBlogByBlogid(blogid) {
  const pool = await dbConnect();
  const result = await pool.query(
    `SELECT blogid, type, title, body, date, word_count, preview_image
       FROM blogs
      WHERE blogid = $1`,
    [blogid]
  );
  return result.rows[0] || null;
}

/** Every blogid + date, for the sitemap. */
export async function getSitemapBlogs() {
  const pool = await dbConnect();
  const result = await pool.query(
    `SELECT blogid, date FROM blogs ORDER BY date DESC`
  );
  return result.rows;
}

/** The N most recent full rows, for RSS. */
export async function getRecentBlogs(limit = 15) {
  const pool = await dbConnect();
  const result = await pool.query(
    `SELECT blogid, title, body, date, type, preview_text
       FROM blogs
      ORDER BY date DESC
      LIMIT $1`,
    [limit]
  );
  return result.rows;
}
