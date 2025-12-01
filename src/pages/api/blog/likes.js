import dbConnect from '@/lib/dbConnect';
import { getClientIp } from '@/lib/get-ip';

export default async function handler(req, res) {
  const { blogid } = req.query;
  const pool = await dbConnect();
  const userIp = getClientIp(req);

  // 1. GET: Retrieve Like Count and if Current User Liked
  if (req.method === 'GET') {
    try {
      // Run two queries in parallel: Total Count and User Specific Status
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM blog_likes WHERE blogid = $1',
        [blogid]
      );
      
      const userStatusResult = await pool.query(
        'SELECT 1 FROM blog_likes WHERE blogid = $1 AND user_ip = $2 LIMIT 1',
        [blogid, userIp]
      );

      const totalLikes = parseInt(countResult.rows[0].count, 10);
      const hasLiked = (userStatusResult.rowCount > 0);

      return res.status(200).json({ 
        likes: totalLikes, 
        liked: hasLiked 
      });

    } catch (err) {
      console.error("Error fetching likes:", err);
      return res.status(500).json({ message: "Error fetching data" });
    }
  }

  // 2. POST: Toggle Like (Add or Remove)
  if (req.method === 'POST') {
    try {
      // Check if already liked
      const checkLike = await pool.query(
        'SELECT id FROM blog_likes WHERE blogid = $1 AND user_ip = $2',
        [blogid, userIp]
      );

      let action = '';

      if (checkLike.rowCount > 0) {
        // Unlike: Remove the row
        await pool.query(
          'DELETE FROM blog_likes WHERE blogid = $1 AND user_ip = $2',
          [blogid, userIp]
        );
        action = 'unliked';
      } else {
        // Like: Add the row
        // utilizing the UNIQUE constraint (blogid, user_ip) to prevent duplicates
        await pool.query(
          'INSERT INTO blog_likes (blogid, user_ip) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [blogid, userIp]
        );
        action = 'liked';
      }

      // Return the new count to ensure frontend stays synced
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM blog_likes WHERE blogid = $1',
        [blogid]
      );

      return res.status(200).json({ 
        message: `Successfully ${action}`, 
        likes: parseInt(countResult.rows[0].count, 10),
        liked: action === 'liked'
      });

    } catch (err) {
      console.error("Error toggling like:", err);
      return res.status(500).json({ message: "Error updating like" });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}