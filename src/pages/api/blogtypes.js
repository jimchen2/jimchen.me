import dbConnect from "@/lib/db/dbConnect";

export default async function handler(req, res) {
  try {
    // Connect to PostgreSQL
    const pool = await dbConnect();

    // Get type, language, and count, ordered by count in descending order
    const typesWithCountsResult = await pool.query(`
      SELECT type, language, COUNT(*) as count 
      FROM blogs 
      WHERE type IS NOT NULL 
      GROUP BY type, language 
      ORDER BY count DESC
    `);

    // Map the results to the desired format
    const typesWithCounts = typesWithCountsResult.rows.map((row) => ({
      type: row.type,
      language: row.language || "unknown", // Handle NULL language
      count: parseInt(row.count, 10),
    }));

    return res.status(200).json(typesWithCounts);
  } catch (error) {
    console.error("Error fetching blog types and languages:", error);
    return res.status(500).json({ message: "Failed to fetch blog types and languages", error: error.message });
  }
}
