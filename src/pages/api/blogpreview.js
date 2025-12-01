import dbConnect from "@/db/dbConnect";

/**
 * Creates a relevant text snippet from a blog body based on a search term.
 */
function getRelevantSnippet(body, searchterm, isTitleMatch) {
  if (!body) return ""; // Handle case where body is null or undefined
  if (isTitleMatch) {
    // If title matches, just show the beginning of the body
    return body.length > 150 ? body.substring(0, 150) + "..." : body;
  } else {
    // If body matches, find the term and create a snippet around it
    const index = body.toLowerCase().indexOf(searchterm.toLowerCase());
    if (index === -1) {
      // Fallback if the term isn't found (shouldn't happen with correct query)
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
  searchterm = null
) {
  const pool = await dbConnect();

  // If searching, we need the full 'body' to create a relevant snippet.
  // Otherwise, we use the pre-made 'preview_text'.
  const selectClause = searchterm
    ? `SELECT id, blogid, title, date, type, word_count, created_at, updated_at, preview_image, body`
    : `SELECT id, blogid, title, date, type, word_count, created_at, updated_at, preview_image, preview_text`;

  let query = `${selectClause} FROM blogs`;
  let queryParams = [];
  let conditions = [];

  // Build WHERE conditions and params sequentially for safety
  if (type) {
    queryParams.push(type);
    conditions.push(`$${queryParams.length} = ANY(type)`);
  }

  if (searchterm) {
    queryParams.push(`%${searchterm}%`);
    const searchIndex = queryParams.length;
    // This logic matches hyphens in titles to spaces in the search term.
    conditions.push(
      `(REPLACE(title, '-', ' ') ILIKE $${searchIndex} OR body ILIKE $${searchIndex})`
    );
  }

  // Combine conditions into a WHERE clause if any exist
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  // Define sort criteria
  let sortQuery;
  if (searchterm) {
    // If searching, prioritize results where the title matches.
    const searchIndex = queryParams.findIndex((p) => p.includes(searchterm));
    sortQuery = `ORDER BY CASE WHEN REPLACE(title, '-', ' ') ILIKE $${
      searchIndex + 1
    } THEN 0 ELSE 1 END, date DESC`;
  } else {
    // Standard sorting options
    const sortCriteria = {
      date_oldest: "date ASC",
      most_words: "word_count DESC",
      least_words: "word_count ASC",
      date_latest: "date DESC",
    };
    sortQuery = `ORDER BY ${sortCriteria[sort] || sortCriteria.date_latest}`;
  }
  query += ` ${sortQuery}`;

  // Add LIMIT and OFFSET for pagination. Indices are correct due to sequential building.
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
 * Formats a raw blog row for the frontend, creating a snippet if searching.
 */
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

  // If a search was performed, generate a custom preview snippet.
  if (searchterm) {
    const isTitleMatch = blog.title
      .toLowerCase()
      .replace(/-/g, " ") // Also replace hyphens here for a consistent match check
      .includes(searchterm.toLowerCase());

    processedBlog.preview_text = getRelevantSnippet(
      blog.body,
      searchterm,
      isTitleMatch
    );
    delete processedBlog.body; // Remove full body to reduce API payload size
  }

  return processedBlog;
}

/**
 * Calculates total blogs and pages, respecting any active filters or search terms.
 */
export async function calculatePaginationInfo(
  count = 10,
  type = null,
  searchterm = null
) {
  const pool = await dbConnect();
  let query = "SELECT COUNT(*) FROM blogs";
  let queryParams = [];
  let conditions = [];

  // Build WHERE conditions sequentially
  if (type) {
    queryParams.push(type);
    conditions.push(`$${queryParams.length} = ANY(type)`);
  }

  if (searchterm) {
    queryParams.push(`%${searchterm}%`);
    const searchIndex = queryParams.length;
    // *** FIX APPLIED HERE ***
    // This logic MUST match fetchBlogPreviews to ensure pagination is accurate.
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
 * Fetches all unique blog types and their respective post counts.
 */
export async function getBlogTypesWithCounts() {
  const pool = await dbConnect();
  // This query unnests the 'type' array and counts occurrences of each unique type.
  const query = `
    SELECT single_type AS type, COUNT(*) AS count
    FROM blogs, UNNEST(type) AS single_type
    WHERE type IS NOT NULL AND cardinality(type) > 0
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
    // Parse and validate query parameters
    const start = parseInt(req.query.start) || 0;
    const count = parseInt(req.query.count) || 10;
    const type = req.query.type || null;
    const sort = req.query.sort || "date_latest";
    const searchterm = req.query.searchterm || null;

    const validSorts = [
      "date_oldest",
      "date_latest",
      "most_words",
      "least_words",
    ];
    if (sort && !validSorts.includes(sort)) {
      return res.status(400).json({ message: "Invalid sort parameter" });
    }

    // Perform data fetching in parallel for efficiency
    const [blogPreviewsRaw, paginationInfo, typesWithCounts] = await Promise.all([
      fetchBlogPreviews(start, count, type, sort, searchterm),
      calculatePaginationInfo(count, type, searchterm),
      getBlogTypesWithCounts(), // This is independent of filters
    ]);
    
    // Process the raw blog data to format dates and create snippets
    const blogPreviews = await Promise.all(
      blogPreviewsRaw.map((blog) => processAndSnippetBlog(blog, searchterm))
    );
    
    const { totalPages, totalBlogs } = paginationInfo;

    // Return everything the frontend needs in a single, well-structured response
    res.status(200).json({
      data: blogPreviews,
      pagination: {
        totalPages,
        currentPage: Math.floor(start / count) + 1,
        pageSize: count,
        totalItems: totalBlogs,
        // Echo back the params for frontend state management
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
    console.error("Error in blog API handler:", err);
    res
      .status(500)
      .json({ message: "Error fetching blog data", error: err.message });
  }
}