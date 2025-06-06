import dbConnect from "@/lib/db/dbConnect.js";

export default async function handler(req, res) {
  const pool = await dbConnect();

  if (req.method === "GET") {
    const { blogid } = req.query;

    try {
      const query = `
        SELECT * FROM blogs 
        WHERE blogid = $1 
      `;
      const values = [blogid];

      const result = await pool.query(query, values);

      if (!result.rows || result.rows.length === 0) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Error fetching blog", error: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
