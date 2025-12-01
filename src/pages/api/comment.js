import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  try {
    const pool = await dbConnect();

    // Handle GET requests
    if (req.method === "GET") {
      const { blogid, limit } = req.query;

      try {
        let query = "SELECT uuid, user_name, text, blog_id, uppointer, date FROM comments";
        const queryParams = [];

        if (blogid && blogid !== "0") {
          query += " WHERE blog_id = $1";
          queryParams.push(blogid);
        }

        query += " ORDER BY date DESC";

        if (limit) {
          query += ` LIMIT $${queryParams.length + 1}`;
          queryParams.push(parseInt(limit, 10));
        }

        const result = await pool.query(query, queryParams);

        // Format dates and map field names for frontend consistency
        const commentsWithFormattedDate = result.rows.map((comment) => {
          const date = new Date(comment.date);
          const formattedDateTime = date.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });

          return {
            uuid: comment.uuid,
            user: comment.user_name,
            text: comment.text,
            blog: comment.blog_id,
            // Map 'uppointer' from DB to 'pointer' for the frontend component
            pointer: comment.uppointer || [],
            date: formattedDateTime,
          };
        });

        res.status(200).json(commentsWithFormattedDate);
      } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ error: "Error fetching comments" });
      }
    }
    // Handle POST requests
    else if (req.method === "POST") {
      const { user, text, blog, uuid, parentid } = req.body;

      try {
        // --- INPUT VALIDATION ---
        if (!blog || !uuid || !text) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const blogValidationResult = await pool.query("SELECT 1 FROM blogs WHERE blogid = $1", [blog]);
        if (blogValidationResult.rows.length === 0) {
          return res.status(400).json({ error: "Invalid blog ID" });
        }

        const uuidRegex = /^[0-9a-f]{32}$/i;
        if (!uuidRegex.test(uuid)) {
          return res.status(400).json({ error: "Invalid UUID format" });
        }
        
        const uuidCheckResult = await pool.query("SELECT 1 FROM comments WHERE uuid = $1", [uuid]);
        if (uuidCheckResult.rows.length > 0) {
          return res.status(400).json({ error: "Duplicate UUID detected" });
        }

        if (text.length > 5000) {
          return res.status(400).json({ error: "Comment text too long" });
        }

        if (parentid) {
          const parentCheckResult = await pool.query("SELECT 1 FROM comments WHERE uuid = $1", [parentid]);
          if (parentCheckResult.rows.length === 0) {
            return res.status(400).json({ error: "Invalid parent comment ID" });
          }
        }

        // --- INSERTION ---
        const insertQuery = `
          INSERT INTO comments (uuid, user_name, text, blog_id, uppointer)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        const insertValues = [
          uuid,
          user || "anonymous",
          text,
          blog,
          [], // Default empty uppointer array
        ];

        const result = await pool.query(insertQuery, insertValues);
        const savedComment = result.rows[0];

        // --- PARENT UPDATE (if it's a reply) ---
        if (parentid) {
          const getParentQuery = "SELECT uppointer FROM comments WHERE uuid = $1";
          const parentResult = await pool.query(getParentQuery, [parentid]);
          
          if (parentResult.rows.length > 0) {
            const currentPointers = parentResult.rows[0].uppointer || [];
            const newPointers = [...currentPointers, uuid];

            const updateParentQuery = "UPDATE comments SET uppointer = $1, updated_at = CURRENT_TIMESTAMP WHERE uuid = $2";
            await pool.query(updateParentQuery, [newPointers, parentid]);
          }
        }

        // --- FORMAT RESPONSE ---
        const formattedComment = {
          uuid: savedComment.uuid,
          user: savedComment.user_name,
          text: savedComment.text,
          blog: savedComment.blog_id,
          pointer: savedComment.uppointer || [],
          date: savedComment.date,
        };

        res.status(201).json(formattedComment);
      } catch (err) {
        console.error("Error creating comment:", err);
        res.status(400).json({ error: "Error creating comment" });
      }
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ error: "Database connection error" });
  }
}