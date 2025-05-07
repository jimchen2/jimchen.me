import dbConnect from '../../lib/db/dbConnect';

export default async function handler(req, res) {
  const pool = await dbConnect();

  if (req.method === 'GET') {
    const { blogid, isarray } = req.query;

    try {
      // Query the likes table for the record matching parent_id (blogid)
      const result = await pool.query(
        'SELECT likes FROM likes WHERE parent_id = $1',
        [blogid]
      );

      // Check if a record exists
      if (result.rows.length > 0) {
        const likesArray = result.rows[0].likes || [];
        if (isarray === "true") {
          res.json({ likes: likesArray });
        } else {
          res.json({ count: likesArray.length });
        }
      } else {
        // If no record is found, return an empty array or count of 0
        if (isarray === "true") {
          res.json({ likes: [] });
        } else {
          res.json({ count: 0 });
        }
      }
    } catch (err) {
      console.error(`Error retrieving blog likes: ${blogid}`, err);
      res.status(500).json({ message: "Error retrieving blog likes", error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
