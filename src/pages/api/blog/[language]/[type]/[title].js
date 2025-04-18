import dbConnect from "../../../../../lib/db/dbConnect.js";

export default async function handler(req, res) {
  const pool = await dbConnect();

  if (req.method === "GET") {
    const { language, type, title } = req.query;

    try {
      // Query the blogs table with the given language, type, and title
      const query = `
        SELECT * FROM blogs 
        WHERE language = $1 
        AND type = $2 
        AND title = $3
      `;
      const values = [language, type, title];

      const result = await pool.query(query, values);

      if (!result.rows || result.rows.length === 0) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Format the date for each blog
      const formattedBlogs = result.rows.map((blog) => {
        const dateObj = new Date(blog.date);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });

        return {
          ...blog,
          date: formattedDate,
        };
      });

      res.json(formattedBlogs);
    } catch (err) {
      res.status(500).json({ message: "Error fetching blog", error: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
