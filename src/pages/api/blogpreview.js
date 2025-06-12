import dbConnect from "@/lib/db/dbConnect";

function getRelevantSnippet(body, searchterm, isTitleMatch) {
  if (!body) return ""; // Handle case where body is null or undefined
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

export async function fetchBlogPreviews(start, count, type = null, sort = "date_latest", searchterm = null) {
  const pool = await dbConnect();

  const selectClause = searchterm
    ? `SELECT id, blogid, title, date, type, word_count, created_at, updated_at, preview_image, body`
    : `SELECT id, blogid, title, date, type, word_count, created_at, updated_at, preview_image, preview_text`;

  let query = `${selectClause} FROM blogs`;
  let queryParams = [];
  let conditions = [];

  // --- REVISED LOGIC ---

  // Build WHERE conditions and params sequentially
  if (type) {
    queryParams.push(type);
    conditions.push(`$${queryParams.length} = ANY(type)`);
  }

  if (searchterm) {
    queryParams.push(`%${searchterm}%`);
    const searchIndex = queryParams.length; // The index for the search term
    conditions.push(`(title ILIKE $${searchIndex} OR body ILIKE $${searchIndex})`);
  }

  // Combine conditions into WHERE clause
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  // Define sort criteria
  let sortQuery;
  if (searchterm) {
    const searchIndex = queryParams.findIndex((p) => p.includes(searchterm));
    sortQuery = `ORDER BY CASE WHEN title ILIKE $${searchIndex + 1} THEN 0 ELSE 1 END, date DESC`;
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

  // Add LIMIT and OFFSET. Their indices will now be correct because we've built the array sequentially.
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

export async function processAndSnippetBlog(blog, searchterm = null) {
  const dateObj = new Date(blog.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const processedBlog = {
    ...blog,
    date: formattedDate,
  };

  if (searchterm) {
    const isTitleMatch = blog.title.toLowerCase().includes(searchterm.toLowerCase());
    processedBlog.preview_text = getRelevantSnippet(blog.body, searchterm, isTitleMatch);
    delete processedBlog.body; // Remove full body to reduce payload size
  }

  return processedBlog;
}

export async function calculatePaginationInfo(count = 10, type = null, searchterm = null) {
  const pool = await dbConnect();
  let query = "SELECT COUNT(*) FROM blogs";
  let queryParams = [];
  let paramCounter = 1;
  let conditions = [];

  // Build WHERE conditions
  if (type) {
    conditions.push(`$${paramCounter} = ANY(type)`);
    queryParams.push(type);
    paramCounter++;
  }

  if (searchterm) {
    conditions.push(`(title ILIKE $${paramCounter} OR body ILIKE $${paramCounter})`);
    queryParams.push(`%${searchterm}%`);
    paramCounter++;
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

export async function getBlogTypesWithCounts() {
  const pool = await dbConnect();
  const query = `
    SELECT single_type AS type, COUNT(*) AS count
    FROM blogs, UNNEST(type) AS single_type
    WHERE type IS NOT NULL AND cardinality(type) > 0
    GROUP BY single_type
    ORDER BY count DESC;
  `;
  try {
    const result = await pool.query(query);
    return result.rows.map((row) => ({ type: row.type, count: parseInt(row.count, 10) }));
  } catch (error) {
    console.error("Error getting blog types:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Parse and validate query parameters
    const start = parseInt(req.query.start) || 0;
    const count = parseInt(req.query.count) || 10;
    const type = req.query.type || null;
    const sort = req.query.sort || "date_latest";
    const searchterm = req.query.searchterm || null;

    const validSorts = ["date_oldest", "date_latest", "most_words", "least_words"];
    if (!validSorts.includes(sort)) {
      return res.status(400).json({ message: "Invalid sort parameter" });
    }

    // Fetch blog data based on all parameters
    const blogPreviewsRaw = await fetchBlogPreviews(start, count, type, sort, searchterm);
    const blogPreviews = await Promise.all(blogPreviewsRaw.map((blog) => processAndSnippetBlog(blog, searchterm)));

    // Get pagination info (aware of search/filter)
    const { totalPages, totalBlogs } = await calculatePaginationInfo(count, type, searchterm);

    // Get types for filter UI (this is independent of the current search/filter)
    const typesWithCounts = await getBlogTypesWithCounts();

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
      },
      filters: {
        types: typesWithCounts,
        sortOptions: validSorts,
      },
    });
  } catch (err) {
    console.error("Error in blog API:", err);
    res.status(500).json({ message: "Error fetching blog data", error: err.message });
  }
}
