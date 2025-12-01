// pages/api/blog/views.js
import dbConnect from '@/lib/dbConnect';
import { getClientIp } from '@/lib/get-ip';
import { generateSignature, validateSignature } from '@/lib/security';

// In-memory rate limiting (same as your likes API)
const rateLimitMap = new Map();

const isRateLimited = (ip) => {
  const now = Date.now();
  const windowTime = 60 * 1000; // 1 minute
  const requestLimit = 30; // 30 requests per minute per IP (slightly higher for views)

  const clientStats = rateLimitMap.get(ip) || { count: 0, lastRequest: now };

  if (now - clientStats.lastRequest > windowTime) {
    rateLimitMap.set(ip, { count: 1, lastRequest: now });
    return false;
  }

  if (clientStats.count >= requestLimit) {
    return true; 
  }

  clientStats.count += 1;
  rateLimitMap.set(ip, clientStats);
  return false;
};

export default async function handler(req, res) {
  const { blogid } = req.query;
  const userIp = getClientIp(req);

  // 1. Rate Limit Check
  if (isRateLimited(userIp)) {
    return res.status(429).json({ message: "Too many requests" });
  }

  const pool = await dbConnect();

  // --- GET: Fetch Count & Generate Token ---
  if (req.method === 'GET') {
    try {
      // Get total views
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM blog_views WHERE blogid = $1',
        [blogid]
      );
      
      const totalViews = parseInt(countResult.rows[0].count, 10);

      // Generate Security Token (Hash of BlogID + IP)
      const token = generateSignature(blogid, userIp);

      return res.status(200).json({ 
        views: totalViews, 
        token: token 
      });

    } catch (err) {
      console.error("Error fetching views:", err);
      return res.status(500).json({ message: "Error fetching data" });
    }
  }

  // --- POST: Record View ---
  if (req.method === 'POST') {
    try {
      const { token } = req.body;
      const referrer = req.headers.referer || null;

      if (!token) {
        return res.status(403).json({ message: "Missing security token" });
      }

      // 2. Validate Token matches IP and BlogID
      const isValid = validateSignature(token, blogid, userIp);

      if (!isValid) {
        return res.status(403).json({ message: "Invalid session or IP mismatch" });
      }

      // 3. NEW: Check if this IP has already viewed this blog today
      // We use `viewed_at::date = CURRENT_DATE` to compare only the date part in Postgres
      const checkResult = await pool.query(
        `SELECT id FROM blog_views 
         WHERE blogid = $1 AND user_ip = $2 AND viewed_at::date = CURRENT_DATE`,
        [blogid, userIp]
      );

      // 4. If no view exists for today (rowCount is 0), insert a new one
      if (checkResult.rowCount === 0) {
        await pool.query(
          'INSERT INTO blog_views (blogid, user_ip, referrer) VALUES ($1, $2, $3)',
          [blogid, userIp, referrer]
        );
      }
      // If a view already exists for today, we do nothing and simply proceed.

      // 5. Return the final, potentially updated, count
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM blog_views WHERE blogid = $1',
        [blogid]
      );

      return res.status(200).json({ 
        views: parseInt(countResult.rows[0].count, 10)
      });

    } catch (err) {
      console.error("Error recording view:", err);
      return res.status(500).json({ message: "Error updating views" });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}