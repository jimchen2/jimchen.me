import dbConnect from "@/lib/db/dbConnect";

// Corrected: Filters by checking if the 'type' array contains the given value.
export async function fetchBlogPreviews(start, count, type = null, sort = "date_latest") {
  const pool = await dbConnect();
  let query = "SELECT * FROM blogs";
  let queryParams = [];
  let paramCounter = 1;
  let conditions = [];

  // Build WHERE conditions
  if (type) {
    conditions.push(`$${paramCounter} = ANY(type)`);
    queryParams.push(type);
    paramCounter++;
  }

  // Combine conditions into WHERE clause
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  // Define sort criteria
  const sortCriteria = {
    date_oldest: "date ASC",
    most_words: "word_count DESC",
    least_words: "word_count ASC",
    date_latest: "date DESC",
  };
  const sortQuery = sortCriteria[sort] || sortCriteria.date_latest;
  query += ` ORDER BY ${sortQuery}`;

  // Add LIMIT and OFFSET
  query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
  queryParams.push(count, start);

  try {
    const result = await pool.query(query, queryParams);
    return result.rows;
  } finally {
    // pool.end(); // If you're using pg-pool, you don't need to end the pool here.
  }
}

// No changes needed in this function
export async function processBlog(blog) {
  const dateObj = new Date(blog.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return {
    ...blog,
    body: blog.body ? blog.body.substring(0, 200) : "",
    date: formattedDate,
  };
}

// Corrected: Filters by checking if the 'type' array contains the given value.
export async function calculatePaginationInfo(count = 10, type = null) {
  const pool = await dbConnect();
  let query = "SELECT COUNT(*) FROM blogs";
  let queryParams = [];
  let conditions = [];
  let paramCounter = 1;

  // Build WHERE conditions
  if (type) {
    // CORRECTED: Use the `= ANY()` operator here as well.
    conditions.push(`$${paramCounter} = ANY(type)`);
    queryParams.push(type);
    paramCounter++;
  }

  // Combine conditions into WHERE clause
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  try {
    const result = await pool.query(query, queryParams);
    const totalBlogs = parseInt(result.rows[0].count, 10);
    const totalPages = Math.ceil(totalBlogs / count);
    return { totalBlogs, totalPages };
  } finally {
    // pool.end();
  }
}

// Corrected: Unnests the array to correctly group and count individual types.
export async function getBlogTypesWithCounts() {
  const pool = await dbConnect();
  // CORRECTED: This query unnests the 'type' array to count each element individually.
  // The old query `GROUP BY type` is invalid for an array column.
  const query = `
    SELECT
      single_type AS type,
      COUNT(*) AS count
    FROM
      blogs,
      UNNEST(type) AS single_type
    WHERE 
      type IS NOT NULL AND cardinality(type) > 0
    GROUP BY
      single_type
    ORDER BY
      count DESC;
  `;

  try {
    const result = await pool.query(query); // No queryParams needed for this one
    return result.rows.map((row) => ({ type: row.type, count: parseInt(row.count, 10) }));
  } finally {
    // pool.end();
  }
}

// Corrected: The main handler now properly calls getBlogTypesWithCounts
export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const start = parseInt(req.query.start) || 0;
      const count = parseInt(req.query.count) || 10;
      const type = req.query.type || null;
      const sort = req.query.sort || "date_latest";

      const validSorts = ["date_oldest", "date_latest", "most_words", "least_words"];
      if (!validSorts.includes(sort)) {
        return res.status(400).json({ message: "Invalid sort parameter" });
      }

      // Fetch blog previews
      const blogPreviewsRaw = await fetchBlogPreviews(start, count, type, sort);
      const blogPreviews = await Promise.all(blogPreviewsRaw.map((blog) => processBlog(blog)));

      // Get pagination info
      const { totalPages, totalBlogs } = await calculatePaginationInfo(count, type);

      // CORRECTED: You were missing the call to get the types for the filters.
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
        },
        filters: {
          types: typesWithCounts,
          sortOptions: validSorts,
        },
      });
    } catch (err) {
      console.error("Error in blog preview API:", err);
      res.status(500).json({ message: "Error fetching blog previews", error: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}