import dbConnect from '../../db/dbConnect';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    const { blogid } = req.query;
    const { userIP, isLiked } = req.body;

    if (!userIP || userIP === "unknown" || userIP === "127.0.0.1") {
      return res.status(400).json({ message: "Invalid IP address" });
    }

    try {
      const pool = await dbConnect();
      
      // First, check if a like record exists for this parent_id
      const findResult = await pool.query(
        'SELECT * FROM likes WHERE parent_id = $1',
        [blogid]
      );
      
      const foundLike = findResult.rows[0];

      if (foundLike) {
        // In PostgreSQL, we need to handle arrays differently
        const likes = foundLike.likes || [];
        const ipIndex = likes.indexOf(userIP);
        
        if (isLiked) {
          // User wants to unlike
          if (ipIndex !== -1) {
            // Remove the userIP from the array
            const updatedLikes = [...likes];
            updatedLikes.splice(ipIndex, 1);
            
            await pool.query(
              'UPDATE likes SET likes = $1, updated_at = CURRENT_TIMESTAMP WHERE parent_id = $2',
              [updatedLikes, blogid]
            );
            
            res.json({ message: "Like removed" });
          } else {
            res.status(400).json({ message: "Like not found for removal" });
          }
        } else {
          // User wants to like
          if (ipIndex === -1) {
            // Add userIP to the array
            const updatedLikes = [...likes, userIP];
            
            await pool.query(
              'UPDATE likes SET likes = $1, updated_at = CURRENT_TIMESTAMP WHERE parent_id = $2',
              [updatedLikes, blogid]
            );
            
            res.json({ message: "Like added" });
          } else {
            res.status(400).json({ message: "Blog already liked" });
          }
        }
      } else {
        if (!isLiked) {
          // Create a new like record
          await pool.query(
            'INSERT INTO likes (parent_id, likes) VALUES ($1, $2)',
            [blogid, [userIP]]
          );
          
          res.json({ message: "Like added to new blog" });
        } else {
          res.status(400).json({ message: "No likes exist for this blog" });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error processing request", error: err.message });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
