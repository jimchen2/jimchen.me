import dbConnect from "@/lib/db/dbConnect";

/**
 * A helper function to safely determine the correct table name from a language code.
 * Defaults to 'blogs' for 'original' or invalid codes.
 * This prevents SQL injection by using a whitelist.
 */
function getTableName(language) {
  const allowedLangs = ["en", "zh", "ru"];
  if (language && allowedLangs.includes(language)) {
    return `blogs_${language}`;
  }
  return "blogs"; // Default table for 'original' language
}

/**
 * Creates a relevant text snippet from a blog body based on a search term.
 */
function getRelevantSnippet(body, searchterm, isTitleMatch) {
  if (!body) return "";
  if (isTitleMatch) {
    return body.length > 150 ? body.substring(0, 150) + "..." : body;
  } else {
    const index = body.toLowerCase().indexOf(searchterm.toLowerCase());
    if (index === -1) {
      return body.length > 150 ? body.substring(0, 150) + "..." : body;
    }
    const start = Math.max(index - 75, 0);
    const end = Math.min(start + 150, body.length);
    const prefix = start > 0 ? "..." : "";
    const suffix = end < body.length ? "..." : "";
    return prefix + body.substring(start, end) + suffix;
  }
}

/**
 * Fetches a list of blog previews from the database with filtering, sorting, and searching.
 */
export async function fetchBlogPreviews(
  start,
  count,
  type = null,
  sort = "date_latest",
  searchterm = null,
  language = null // ADDED: Language parameter
) {
  const pool = await dbConnect();
  const tableName = getTableName(language); // Use the helper to get the safe table name

  const selectClause = searchterm
    ? `SELECT id, blogid, title, date, tags, word_count, created_at, updated_at, preview_image, body`
    : `SELECT id, blogid, title, date, tags, word_count, created_at, updated_at, preview_image, preview_text`;

  // MODIFIED: Use the dynamic tableName
  let query = `${selectClause} FROM ${tableName}`;
  let queryParams = [];
  let conditions = [];

  if (type) {
    queryParams.push(type);
    conditions.push(`$${queryParams.length} = ANY(tags)`);
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

  let sortQuery;
  if (searchterm) {
    const searchIndex = queryParams.findIndex((p) => p.includes(searchterm));
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
    throw error;
  }
}

/**
 * Formats a raw blog row for the frontend, creating a snippet if searching.
 */
export async function processAndSnippetBlog(blog, searchterm = null) {
  const dateObj = new Date(blog.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const { tags, ...restOfBlog } = blog;
  const processedBlog = {
    ...restOfBlog,
    type: tags,
    date: formattedDate,
  };

  if (searchterm) {
    const isTitleMatch = blog.title
      .toLowerCase()
      .replace(/-/g, " ")
      .includes(searchterm.toLowerCase());
    processedBlog.preview_text = getRelevantSnippet(
      blog.body,
      searchterm,
      isTitleMatch
    );
    delete processedBlog.body;
  }

  return processedBlog;
}

/**
 * Calculates total blogs and pages, respecting any active filters or search terms.
 */
export async function calculatePaginationInfo(
  count = 10,
  type = null,
  searchterm = null,
  language = null // ADDED: Language parameter
) {
  const pool = await dbConnect();
  const tableName = getTableName(language); // Use the helper to get the safe table name

  // MODIFIED: Use the dynamic tableName
  let query = `SELECT COUNT(*) FROM ${tableName}`;
  let queryParams = [];
  let conditions = [];

  if (type) {
    queryParams.push(type);
    conditions.push(`$${queryParams.length} = ANY(tags)`);
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

  try {
    const result = await pool.query(query, queryParams);
    const totalBlogs = parseInt(result.rows[0].count, 10);
    const totalPages = Math.ceil(totalBlogs / count);
    return { totalBlogs, totalPages };
  } catch (error) {
    console.error("Error calculating pagination:", error);
    throw error;
  }
}

/**
 * Fetches all unique blog tags and their respective post counts for a given language.
 */
export async function getBlogTypesWithCounts(language = null) { // ADDED: Language parameter
  const pool = await dbConnect();
  const tableName = getTableName(language); // Use the helper to get the safe table name

  // MODIFIED: Use the dynamic tableName
  const query = `
    SELECT single_type AS type, COUNT(*) AS count
    FROM ${tableName}, UNNEST(tags) AS single_type
    WHERE tags IS NOT NULL AND cardinality(tags) > 0
    GROUP BY single_type
    ORDER BY count DESC;
  `;
  try {
    const result = await pool.query(query);
    return result.rows.map((row) => ({
      type: row.type,
      count: parseInt(row.count, 10),
    }));
  } catch (error) {
    console.error("Error getting blog types:", error);
    throw error;
  }
}

/**
 * The main API handler for GET /api/blogpreview
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const start = parseInt(req.query.start) || 0;
    const count = parseInt(req.query.count) || 10;
    const type = req.query.type || null;
    const sort = req.query.sort || "date_latest";
    const searchterm = req.query.searchterm || null;
    const language = req.query.language || null; // ADDED: Read language from query

    const validSorts = [
      "date_oldest",
      "date_latest",
      "most_words",
      "least_words",
    ];
    if (sort && !validSorts.includes(sort)) {
      return res.status(400).json({ message: "Invalid sort parameter" });
    }

    const [blogPreviewsRaw, paginationInfo, typesWithCounts] =
      await Promise.all([
        // Pass language to all functions
        fetchBlogPreviews(start, count, type, sort, searchterm, language),
        calculatePaginationInfo(count, type, searchterm, language),
        getBlogTypesWithCounts(language),
      ]);

    const blogPreviews = await Promise.all(
      blogPreviewsRaw.map((blog) => processAndSnippetBlog(blog, searchterm))
    );

    const { totalPages, totalBlogs } = paginationInfo;

    res.status(200).json({
      data: blogPreviews,
      pagination: {
        totalPages,
        currentPage: Math.floor(start / count) + 1,
        pageSize: count,
        totalItems: totalBlogs,
        type,
        sort,
        searchterm,
        language, // ADDED: Echo language back in response
      },
      filters: {
        types: typesWithCounts,
        sortOptions: validSorts,
      },
    });
  } catch (err) {
    console.error("Error in blog API handler:", err);
    res
      .status(500)
      .json({ message: "Error fetching blog data", error: err.message });
  }
}