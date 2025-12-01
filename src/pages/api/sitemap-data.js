import dbConnect from "@/lib/dbConnect";

/**
 * Fetches all blog data needed for sitemap generation
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const pool = await dbConnect();

    // Fetch all blogs with relevant sitemap data
    const blogsQuery = `
      SELECT blogid, date 
      FROM blogs 
      ORDER BY date DESC
    `;
    
    const blogsResult = await pool.query(blogsQuery);
    res.status(200).json({
      blogs: blogsResult.rows,
    });
  } catch (err) {
    console.error("Error fetching sitemap data:", err);
    res.status(500).json({ 
      message: "Error fetching sitemap data", 
      error: err.message 
    });
  }
}