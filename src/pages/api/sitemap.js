// pages/api/sitemap.js
import dbConnect from '../../config/dbConnect';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const pool = await dbConnect();
      
      // Fetch all blogs from PostgreSQL with minimal fields for sitemap
      const query = `
        SELECT blogid, date
        FROM blogs
        ORDER BY date DESC
      `;
      
      const result = await pool.query(query);
      const blogs = result.rows;
      
      const baseUrl = process.env.NEXT_PUBLIC_SITE;
      
      // Map blogs to sitemap entries
      const blogData = blogs.map(blog => {
        const dateObj = new Date(blog.date);
        const formattedDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD for sitemap

        return {
          url: `${baseUrl}/a/${blogid}`,
          lastmod: formattedDate, // Use blog's date
          changefreq: 'daily',
          priority: 1.0
        };
      });

      // Static pages with fixed lastmod
      const staticPages = [
        { url: `${baseUrl}/`, lastmod: '2025-01-01', changefreq: 'yearly', priority: 1.0 },
        { url: `${baseUrl}/about`, lastmod: '2025-01-01', changefreq: 'yearly', priority: 0.7 },
      ];

      const sitemapData = [...staticPages, ...blogData];

      res.status(200).json(sitemapData);
    } catch (err) {
      console.error('Error fetching blogs for sitemap:', err);
      res.status(500).json({ message: 'Error generating sitemap', error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
