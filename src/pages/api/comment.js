import dbConnect from "@/lib/db/dbConnect";

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

      try {
        // Insert new comment
        const insertQuery = `
          INSERT INTO comments (uuid, user_name, text, blog_id, blog_name, pointer, likes)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;

        const insertValues = [
          uuid,
          user,
          text,
          blog,
          blogname,
          [], // Empty pointer array
          [], // Empty likes array
        ];

        const result = await pool.query(insertQuery, insertValues);
        const savedComment = result.rows[0];

        // If it's a reply, update the parent comment
        if (parentid) {
          // First, get the current pointer array
          const getParentQuery = "SELECT pointer FROM comments WHERE uuid = $1";
          const parentResult = await pool.query(getParentQuery, [parentid]);

          if (parentResult.rows.length === 0) {
            console.warn(`Parent comment ${parentid} not found`);
          } else {
            // Add the new UUID to the pointer array
            const currentPointers = parentResult.rows[0].pointer || [];
            const newPointers = [...currentPointers, uuid];

            // Update the parent comment
            const updateParentQuery =
              "UPDATE comments SET pointer = $1, updated_at = CURRENT_TIMESTAMP WHERE uuid = $2";
            await pool.query(updateParentQuery, [newPointers, parentid]);
          }
        }

        // Format the response to match MongoDB structure
        const formattedComment = {
          ...savedComment,
          user: savedComment.user_name,
          blog: savedComment.blog_id,
          blogname: savedComment.blog_name,
          like: savedComment.likes || [],
        };

        res.status(201).json(formattedComment);
      } catch (err) {
        console.error(err);
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