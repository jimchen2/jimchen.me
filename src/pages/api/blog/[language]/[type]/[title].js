// pages/api/blog/[language]/[type]/[title].js
import Blog from '../../../../../backend_utils/models/blog.model.js';
import dbConnect from '../../../../../backend_utils/db/mongoose.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { language, type, title } = req.query;

    try {
      const blogs = await Blog.find({ language, type, title });
      
      if (!blogs || blogs.length === 0) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      res.json(blogs);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching blog', error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}