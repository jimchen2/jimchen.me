import dbConnect from "@/config/dbConnect";

export default async function handler(req, res) {
  try {
    // Get PostgreSQL connection pool
    const pool = await dbConnect();

    // Handle GET requests
    if (req.method === "GET") {
      // Destructure blogid and limit from the query
      const { blogid, limit } = req.query;

      try {
        let query = "SELECT * FROM comments";
        const queryParams = [];

        if (blogid && blogid !== "0") {
          query += " WHERE blog_id = $1";
          queryParams.push(blogid);
        }

        // Fetch comments and sort by date (descending)
        query += " ORDER BY date DESC";

        // Add LIMIT clause if a limit is provided
        if (limit) {
          // Use the next available parameter index
          query += ` LIMIT $${queryParams.length + 1}`;
          // Ensure limit is an integer and push to params
          queryParams.push(parseInt(limit, 10));
        }

        const result = await pool.query(query, queryParams);

        // Format the date for each comment
        const commentsWithFormattedDate = result.rows.map((comment) => {
          const date = new Date(comment.date);
          const formattedDateTime = date.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });

          return {
            ...comment,
            date: formattedDateTime,
            // Map field names to match the previous MongoDB structure
            user: comment.user_name,
            blog: comment.blog_id,
            blogname: comment.blog_name,
            like: comment.likes || [],
          };
        });

        res.status(200).json(commentsWithFormattedDate);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching comments" });
      }
    }
    // Handle POST requests
    else if (req.method === "POST") {
      const { user, text, blog, uuid, blogname, parentid } = req.body;

      // INPUT VALIDATION CHECKS
      try {
        // 1. Validate required fields
        if (!blog || !uuid || !blogname || !text) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        // 2. Validate blog ID exists in database
        const blogValidationQuery = "SELECT title FROM blogs WHERE blogid = $1";
        const blogValidationResult = await pool.query(blogValidationQuery, [blog]);

        if (blogValidationResult.rows.length === 0) {
          return res.status(400).json({ error: "Invalid blog ID - blog does not exist" });
        }

        // 3. Validate blogname matches actual blog title
        const actualBlogTitle = blogValidationResult.rows[0].title;
        if (blogname !== actualBlogTitle) {
          return res.status(400).json({
            error: "Blog name tampering detected - provided name does not match blog title",
          });
        }

        // 4. Validate UUID format (32 character hex string)
        const uuidRegex = /^[0-9a-f]{32}$/i;
        if (!uuidRegex.test(uuid)) {
          return res.status(400).json({ error: "Invalid UUID format" });
        }

        // 5. Check if UUID already exists (prevent duplicates)
        const uuidCheckQuery = "SELECT uuid FROM comments WHERE uuid = $1";
        const uuidCheckResult = await pool.query(uuidCheckQuery, [uuid]);

        if (uuidCheckResult.rows.length > 0) {
          return res.status(400).json({ error: "UUID already exists - potential tampering detected" });
        }

        // 6. Additional text validation (prevent excessively long comments)
        if (text.length > 5000) {
          return res.status(400).json({ error: "Comment text too long" });
        }

        // 7. Validate parentid if provided
        if (parentid) {
          const parentCheckQuery = "SELECT uuid FROM comments WHERE uuid = $1";
          const parentCheckResult = await pool.query(parentCheckQuery, [parentid]);

          if (parentCheckResult.rows.length === 0) {
            return res.status(400).json({ error: "Invalid parent comment ID" });
          }
        }

        // If all validations pass, proceed with insert
        const insertQuery = `
          INSERT INTO comments (uuid, user_name, text, blog_id, blog_name, pointer, likes)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;

        const insertValues = [
          uuid,
          user || "anonymous", // Provide default if user is empty
          text,
          blog,
          blogname,
          [], // Empty pointer array
          [], // Empty likes array
        ];

        const result = await pool.query(insertQuery, insertValues);
        const savedComment = result.rows[0];

        // Handle parent comment update (same as before)
        if (parentid) {
          const getParentQuery = "SELECT pointer FROM comments WHERE uuid = $1";
          const parentResult = await pool.query(getParentQuery, [parentid]);

          if (parentResult.rows.length > 0) {
            const currentPointers = parentResult.rows[0].pointer || [];
            const newPointers = [...currentPointers, uuid];

            const updateParentQuery = "UPDATE comments SET pointer = $1, updated_at = CURRENT_TIMESTAMP WHERE uuid = $2";
            await pool.query(updateParentQuery, [newPointers, parentid]);
          }
        }

        // Format the response
        const formattedComment = {
          ...savedComment,
          user: savedComment.user_name,
          blog: savedComment.blog_id,
          blogname: savedComment.blog_name,
          like: savedComment.likes || [],
        };

        res.status(201).json(formattedComment);
      } catch (err) {
        console.error("Validation or insert error:", err);
        res.status(400).json({ error: "Error creating comment" });
      }
    }
    // Handle other methods
    else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ error: "Database connection error" });
  }
}
