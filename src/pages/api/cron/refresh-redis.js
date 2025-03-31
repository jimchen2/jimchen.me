import Blog from "@/backend_utils/models/blog.model";
import { initializeRedis } from "@/backend_utils/db/redis";
import dbConnect from "@/backend_utils/db/mongoose";

export async function processBlog(blog) {
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

export async function fetchBlogPreviews(start, count) {
  const blogs = await Blog.find().sort({ date: -1 }).skip(start).limit(count).collation({ locale: "en_US", numericOrdering: true });

  const previewPromises = blogs.map((blog) => processBlog(blog));
  return Promise.all(previewPromises);
}

export async function calculateAndCachePagination(count = 10) {
  const client = await initializeRedis();
  let totalPages = 0;
  let totalBlogs = 0;

  // Get total count of blogs
  totalBlogs = await Blog.countDocuments();
  totalPages = Math.ceil(totalBlogs / count);

  // Store in cache if Redis is available
  if (client) {
    await client.setEx("blog_total_pages", 365 * 24 * 60 * 60, totalPages.toString());
    await client.setEx("blog_total_count", 365 * 24 * 60 * 60, totalBlogs.toString());
  }

  return { totalBlogs, totalPages };
}


async function refreshCacheInBackground(start, count) {
  const cacheKey = `blog_previews:start=${start}&count=${count}`;

  try {
    const client = await initializeRedis();
    if (!client) return;

    const previews = await fetchBlogPreviews(start, count);

    // Set with 365 days expiration
    await client.setEx(cacheKey, 365 * 24 * 60 * 60, JSON.stringify(previews));
  } catch (err) {
    console.error(`Error refreshing cache for ${cacheKey}:`, err);
  }
}

export default async function refreshBlogsCron(req, res) {
  await dbConnect();

  try {
    // Calculate and cache pagination info
    const { totalBlogs, totalPages } = await calculateAndCachePagination();
    console.log(`Total blogpreview to cache: ${totalBlogs}`);

    const blogsPerPage = 10;
    const refreshPromises = [];

    for (let start = 0; start < totalBlogs; start += blogsPerPage) {
      refreshPromises.push(refreshCacheInBackground(start, blogsPerPage));
    }

    await Promise.all(refreshPromises);
    res.status(200).json({
      message: "Blog cache refresh initiated",
      totalBlogs,
      totalPages,
      batchesProcessed: Math.ceil(totalBlogs / blogsPerPage),
    });
  } catch (err) {
    console.error("Error in cron job:", err);
    res.status(500).json({ message: "Error in cron job", error: err.message });
  }
}
