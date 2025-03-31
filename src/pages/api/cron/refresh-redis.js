import dbConnect from "@/backend_utils/db/mongoose";
import Blog from "@/backend_utils/models/blog.model";
import { initializeRedis } from "@/backend_utils/db/redis";

async function refreshCacheInBackground(start, count) {
  const cacheKey = `blog_previews:start=${start}&count=${count}`;

  try {
    const client = await initializeRedis();
    if (!client) return;

    const blogs = await Blog.find().sort({ date: -1 }).skip(start).limit(count).collation({ locale: "en_US", numericOrdering: true });

    const previews = await Promise.all(blogs.map((blog) => processBlog(blog)));

    // Set with 365 days expiration
    await client.setEx(cacheKey, 365 * 24 * 60 * 60, JSON.stringify(previews));
  } catch (err) {
    console.error(`Error refreshing cache for ${cacheKey}:`, err);
  }
}

async function processBlog(blog) {
  const dateObj = new Date(blog.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return {
    ...blog.toObject(),
    body: blog.body.substring(0, 200),
    date: formattedDate,
  };
}

export default async function refreshBlogsCron(req, res) {
  await dbConnect();

  try {
    // Get the total count of blogs
    const totalBlogs = await Blog.countDocuments();
    console.log(`Total blogpreview to cache: ${totalBlogs}`);

    const refreshPromises = [];

    for (let start = 0; start < totalBlogs; start += 10) {
      refreshPromises.push(refreshCacheInBackground(start, 10));
    }

    await Promise.all(refreshPromises);
    res.status(200).json({
      message: "Blog cache refresh initiated",
      totalBlogs: totalBlogs,
      batchesProcessed: Math.ceil(totalBlogs / 10),
    });
  } catch (err) {
    console.error("Error in cron job:", err);
    res.status(500).json({ message: "Error in cron job", error: err.message });
  }
}
