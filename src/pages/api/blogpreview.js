import Blog from '../../backend_utils/models/blog.model';
import dbConnect from '../../backend_utils/db/mongoose';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const blogs = await Blog.find()
        .sort({ date: -1 })
        .collation({ locale: 'en_US', numericOrdering: true });

      const previews = [];
      const typeCounts = {};

      blogs.forEach(blog => {
        const dateObj = new Date(blog.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        });

        const preview = {
          ...blog.toObject(),
          body: blog.body.substring(0, 200),
          date: formattedDate
        };
        previews.push(preview);
        typeCounts[blog.type] = (typeCounts[blog.type] || 0) + 1;
      });

      const postTypes = Object.entries(typeCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      res.json({
        previews,
        postTypes
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching blog previews', error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}