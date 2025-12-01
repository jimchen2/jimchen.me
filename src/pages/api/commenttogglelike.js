// pages/api/comments/[commentuuid].js
import dbConnect from '../../db/dbConnect';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    try {
      const pool = await dbConnect();
      const { commentuuid } = req.query;
      const { userIP, isLiked } = req.body;

      if (userIP === "unknown" || userIP === "127.0.0.1") {
        return res.status(400).json({ message: "Cannot like comment from this IP" });
      }

      if (!commentuuid) {
        return res.status(400).json({ message: "Invalid query parameters" });
      }

      // First, check if the comment exists
      const commentResult = await pool.query(
        'SELECT * FROM comments WHERE uuid = $1',
        [commentuuid]
      );

      if (commentResult.rows.length === 0) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const comment = commentResult.rows[0];
      let newLikes = comment.likes || [];

      if (isLiked) {
        // Add the userIP if it doesn't already exist in the likes array
        if (!newLikes.includes(userIP)) {
          newLikes.push(userIP);
        }
      } else {
        // Remove the userIP from the likes array
        newLikes = newLikes.filter(ip => ip !== userIP);
      }

      // Update the comment with the new likes array
      const updatedResult = await pool.query(
        'UPDATE comments SET likes = $1, updated_at = CURRENT_TIMESTAMP WHERE uuid = $2 RETURNING *',
        [newLikes, commentuuid]
      );

      res.json(updatedResult.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating comment", error: err.message });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
