// pages/api/blog/[language]/[type]/[title].js
import Blog from "../../../../../backend_utils/models/blog.model.js";
import dbConnect from "../../../../../backend_utils/db/mongoose.js";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { language, type, title } = req.query;

    try {
      const blogs = await Blog.find({ language, type, title });

      if (!blogs || blogs.length === 0) {
        return res.status(404).json({ message: "Blog not found" });
      }

      const formattedBlogs = blogs.map((blog) => {
        const dateObj = new Date(blog.date);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });

        return {
          ...blog.toObject(),
          date: formattedDate, 
        };
      });

      res.json(formattedBlogs);
    } catch (err) {
      res.status(500).json({ message: "Error fetching blog", error: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
