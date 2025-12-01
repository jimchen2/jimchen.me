// pages/api/rss.js
import RSS from "rss";
import dbConnect from "../../db/dbConnect";

export default async function handler(req, res) {
  try {
    const pool = await dbConnect();

    const feed = new RSS({
      title: "Jim Chen's Blog",
      description: "Daily Journals and Tech Notes",
      feed_url: "https://jimchen.me/api/rss",
      site_url: "https://jimchen.me",
      language: "en",
      pubDate: new Date(),
      image_url: "https://jimchen.me/site-icon.png",
    });

    // Get blogs sorted by date, limited to 15 most recent
    const blogsResult = await pool.query(
      "SELECT * FROM blogs ORDER BY date DESC LIMIT 15"
    );
    const blogs = blogsResult.rows;

    blogs.forEach((blog) => {
      feed.item({
        title: blog.title,
        description: blog.body,
        url: `https://jimchen.me/${blog.language}/${blog.type}/${blog.title}`,
        categories: [blog.type],
        date: new Date(blog.date),
        language: blog.language,
      });
    });

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(feed.xml());
  } catch (error) {
    console.error("RSS feed generation error:", error);
    res.status(500).json({
      message: "Error generating RSS feed",
      error: error.message,
    });
  }
}
