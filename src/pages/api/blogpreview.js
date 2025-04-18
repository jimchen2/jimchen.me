import dbConnect from "@/lib/db/dbConnect";

export async function fetchBlogPreviews(start, count, type = null, sort = "date_latest") {
  const pool = await dbConnect();
  let query = "SELECT * FROM blogs";
  let queryParams = [];
  let paramCounter = 1;

  if (type) {
    query += ` WHERE type = $${paramCounter}`;
    queryParams.push(type);
    paramCounter++;
  }

  // Define sort criteria
  let sortQuery = "";
  switch (sort) {
    case "date_oldest":
      sortQuery = " ORDER BY date ASC";
      break;
    case "most_words":
      sortQuery = " ORDER BY word_count DESC";
      break;
    case "least_words":
      sortQuery = " ORDER BY word_count ASC";
      break;
    default:
      sortQuery = " ORDER BY date DESC";
  }

  query += sortQuery;
  query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
  queryParams.push(count, start);

  const result = await pool.query(query, queryParams);
  return result.rows;
}

export async function processBlog(blog) {
  const dateObj = new Date(blog.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return {
    ...blog,
    body: blog.body ? blog.body.substring(0, 200) : '',
    date: formattedDate,
  };
}

export async function calculatePaginationInfo(count = 10, type = null) {
  const pool = await dbConnect();
  let query = "SELECT COUNT(*) FROM blogs";
  let queryParams = [];
  let paramCounter = 1;

  if (type) {
    query += ` WHERE type = $${paramCounter}`;
    queryParams.push(type);
  }

  const result = await pool.query(query, queryParams);
  const totalBlogs = parseInt(result.rows[0].count, 10);
  const totalPages = Math.ceil(totalBlogs / count);

  return { totalBlogs, totalPages };
}

export async function getBlogTypesWithCounts() {
  const pool = await dbConnect();
  const query = "SELECT type, COUNT(*) as count FROM blogs GROUP BY type";
  const result = await pool.query(query);
  return result.rows.map(row => ({ type: row.type, count: parseInt(row.count, 10) }));
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const start = parseInt(req.query.start) || 0;
      const count = parseInt(req.query.count) || 10;
      const type = req.query.type || null;
      const sort = req.query.sort || "date_latest"; // Default to date_latest

      // Validate sort parameter
      const validSorts = ["date_oldest", "date_latest", "most_words", "least_words"];
      if (sort && !validSorts.includes(sort)) {
        return res.status(400).json({ message: "Invalid sort parameter" });
      }

      // Fetch blog previews directly from the database
      const blogPreviewsRaw = await fetchBlogPreviews(start, count, type, sort);
      const blogPreviews = await Promise.all(blogPreviewsRaw.map(blog => processBlog(blog)));

      // Get pagination info directly
      const { totalPages, totalBlogs } = await calculatePaginationInfo(count, type);

      // Get blog types with counts for filtering
      const typesWithCounts = await getBlogTypesWithCounts();

      res.json({
        data: blogPreviews,
        pagination: {
          totalPages,
          currentPage: Math.floor(start / count) + 1,
          pageSize: count,
          totalItems: totalBlogs,
          type: type,
          sort: sort,
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
