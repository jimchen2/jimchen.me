import dbConnect from "@/db/dbConnect";

export default async function handler(req, res) {
  try {
    // Connect to PostgreSQL
    const pool = await dbConnect();

    const typesWithCountsResult = await pool.query(`
      SELECT
        single_type AS type,
        COUNT(*) AS count
      FROM
        blogs,
        UNNEST(type) AS single_type -- This creates a new row for each element in the 'type' array
      WHERE 
        type IS NOT NULL AND cardinality(type) > 0 -- Ensure we only process rows with non-empty type arrays
      GROUP BY
        single_type -- Group by the individual types from the unnested array
      ORDER BY
        count DESC;
    `);

    // Map the results to the desired format (language field removed)
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