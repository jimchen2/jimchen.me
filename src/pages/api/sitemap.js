import Blog from '../../backend_utils/models/blog.model';
import dbConnect from '../../backend_utils/db/mongoose';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      // Fetch all blogs from MongoDB with minimal fields for sitemap
      const blogs = await Blog.find({}, 'language type title date') // Only fetch necessary fields
        .sort({ date: -1 }) // Sort by date descending
        .collation({ locale: 'en_US', numericOrdering: true }) // Consistent sorting
        .lean(); // Convert to plain JS objects for performance

      const baseUrl = process.env.NEXT_PUBLIC_SITE 
      
      // Map blogs to sitemap entries
      const blogData = blogs.map(blog => {
        const dateObj = new Date(blog.date);
        const formattedDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD for sitemap

        return {
          url: `${baseUrl}/${encodeURIComponent(blog.language)}/${encodeURIComponent(blog.type)}/${encodeURIComponent(blog.title)}`,
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