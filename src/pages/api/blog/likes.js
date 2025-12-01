// pages/api/blog/likes.js
import dbConnect from '@/lib/dbConnect';
import { getClientIp } from '@/lib/get-ip';
import { generateSignature, validateSignature } from '@/lib/security';

// Simple in-memory rate limit (For serverless, use Redis/Vercel KV for better results)
const rateLimitMap = new Map();

const isRateLimited = (ip) => {
  const now = Date.now();
  const windowTime = 60 * 1000; // 1 minute
  const requestLimit = 20; // Max 20 requests per minute per IP

  const clientStats = rateLimitMap.get(ip) || { count: 0, lastRequest: now };

  if (now - clientStats.lastRequest > windowTime) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, lastRequest: now });
    return false;
  }

  if (clientStats.count >= requestLimit) {
    return true; // Blocked
  }

  clientStats.count += 1;
  rateLimitMap.set(ip, clientStats);
  return false;
};

export default async function handler(req, res) {
  const { blogid } = req.query;
  
  // 1. IP Security: NEVER accept IP from the body. Only calculate it server-side.
  const userIp = getClientIp(req); 

  // 2. Rate Limiting Check
  if (isRateLimited(userIp)) {
    return res.status(429).json({ message: "Too many requests. Please slow down." });
  }

  const pool = await dbConnect();

  // --- GET REQUEST ---
  if (req.method === 'GET') {
    try {
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

      // 3. Generate Security Token
      // This proves the user actually requested the page with THIS specific IP
      const token = generateSignature(blogid, userIp);

      return res.status(200).json({ 
        likes: totalLikes, 
        liked: hasLiked,
        token: token // Send token to frontend
      });

    } catch (err) {
      console.error("Error fetching likes:", err);
      return res.status(500).json({ message: "Error fetching data" });
    }
  }

  // --- POST REQUEST ---
  if (req.method === 'POST') {
    try {
      // 4. Retrieve the token sent by frontend
      const { token } = req.body; 

      if (!token) {
        return res.status(403).json({ message: "Missing security token" });
      }

      // 5. Verify Token
      // If the attacker tries to send a fake IP or a random blogid via Postman,
      // this check will fail because they can't generate the correct hash 
      // without your server's secret key.
      const isValid = validateSignature(token, blogid, userIp);

      if (!isValid) {
        return res.status(403).json({ message: "Invalid session or IP mismatch" });
      }

      // Logic to toggle like (same as before)
      const checkLike = await pool.query(
        'SELECT id FROM blog_likes WHERE blogid = $1 AND user_ip = $2',
        [blogid, userIp]
      );

      let action = '';

      if (checkLike.rowCount > 0) {
        await pool.query(
          'DELETE FROM blog_likes WHERE blogid = $1 AND user_ip = $2',
          [blogid, userIp]
        );
        action = 'unliked';
      } else {
        await pool.query(
          'INSERT INTO blog_likes (blogid, user_ip) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [blogid, userIp]
        );
        action = 'liked';
      }

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