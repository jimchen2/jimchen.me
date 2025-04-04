// pages/api/rss.js
import RSS from "rss";
import dbConnect from "../../backend_utils/db/mongoose";
import Blog from "../../backend_utils/models/blog.model.js";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const feed = new RSS({
      title: "Jim Chen's Blog",
      description: "Daily Journals and Tech Notes",
      feed_url: "https://jimchen.me/api/rss",
      site_url: "https://jimchen.me",
      language: "en",
      pubDate: new Date(),
      image_url: "https://cdn.jimchen.me/50b97eec1be681f92c0abc602c1f3436/jimchen.me.png",
    });

    const blogs = await Blog.find().sort({ date: -1 }).limit(15).collation({ locale: "en_US", numericOrdering: true });

    blogs.forEach((blog) => {
      feed.item({
        title: blog.title,
        description: blog.body,
        url: `https://jimchen.me/${blog.language}/${blog.type}/${blog.title}`,
        guid: blog.uuid,
        categories: [blog.type],
        date: new Date(blog.date),
        language: blog.language,
      });
    });

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(feed.xml());
  } catch (error) {
    res.status(500).json({
      message: "Error generating RSS feed",
      error: error.message,
    });
  }
}
