import dbConnect from "@/lib/db/dbConnect";

export default async function handler(req, res) {
  try {
    // Connect to PostgreSQL
    const pool = await dbConnect();

    // Get count for each type and order by count in descending order
    const typesWithCountsResult = await pool.query(
      "SELECT type, COUNT(*) as count FROM blogs WHERE type IS NOT NULL GROUP BY type ORDER BY count DESC"
    );

    const typesWithCounts = typesWithCountsResult.rows.map((row) => ({
      type: row.type,
      count: parseInt(row.count, 10),
    }));

    return res.status(200).json(typesWithCounts);
  } catch (error) {
    console.error("Error fetching blog types:", error);
    return res.status(500).json({ message: "Failed to fetch blog types", error: error.message });
  }
}
