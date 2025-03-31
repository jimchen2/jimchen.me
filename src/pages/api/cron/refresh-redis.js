import Blog from "@/backend_utils/models/blog.model";
import { initializeRedis } from "@/backend_utils/db/redis";
import dbConnect from "@/backend_utils/db/mongoose";

export async function fetchBlogPreviews(start, count, type = null) {
  let query = {};

  // If type is provided, filter by that type
  if (type) {
    query.type = type;
  }

  const blogs = await Blog.find(query).sort({ date: -1 }).skip(start).limit(count).collation({ locale: "en_US", numericOrdering: true });

  const previewPromises = blogs.map((blog) => processBlog(blog));
  return Promise.all(previewPromises);
}

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

export async function calculateAndCachePagination(count = 10) {
  const client = await initializeRedis();
  let totalBlogs = 0;
  let totalPages = 0;

  // Get total count of all blogs
  totalBlogs = await Blog.countDocuments();
  totalPages = Math.ceil(totalBlogs / count);

  // Store in cache if Redis is available
  if (client) {
    await client.setEx("blog_total_pages", 365 * 24 * 60 * 60, totalPages.toString());
    await client.setEx("blog_total_count", 365 * 24 * 60 * 60, totalBlogs.toString());

    // Get all unique blog types
    const blogTypes = await Blog.distinct("type");

    // Store the list of blog types
    await client.setEx("blog_types", 365 * 24 * 60 * 60, JSON.stringify(blogTypes));

    // Cache counts for each type
    for (const type of blogTypes) {
      const typeCount = await Blog.countDocuments({ type });
      const typePages = Math.ceil(typeCount / count);

      await client.setEx(`blog_total_pages_type_${type}`, 365 * 24 * 60 * 60, typePages.toString());
      await client.setEx(`blog_total_count_type_${type}`, 365 * 24 * 60 * 60, typeCount.toString());
    }
  }

  return { totalBlogs, totalPages };
}

async function refreshCacheInBackground(start, count, type = null) {
  // Create cache key based on parameters
  const cacheKey = type ? `blog_previews:start=${start}&count=${count}&type=${type}` : `blog_previews:start=${start}&count=${count}`;

  try {
    const client = await initializeRedis();
    if (!client) return;

    const previews = await fetchBlogPreviews(start, count, type);

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
    console.log(`Total blog previews to cache: ${totalBlogs}`);

    const blogsPerPage = 10;
    const refreshPromises = [];

    // Cache all blogs first (without type filtering)
    for (let start = 0; start < totalBlogs; start += blogsPerPage) {
      refreshPromises.push(refreshCacheInBackground(start, blogsPerPage));
    }

    // Get all unique blog types
    const blogTypes = await Blog.distinct("type");

    // Cache each type separately
    for (const type of blogTypes) {
      const typeCount = await Blog.countDocuments({ type });

      for (let start = 0; start < typeCount; start += blogsPerPage) {
        refreshPromises.push(refreshCacheInBackground(start, blogsPerPage, type));
      }
    }

    await Promise.all(refreshPromises);

    res.status(200).json({
      message: "Blog cache refresh completed",
    });
  } catch (err) {
    console.error("Error in cron job:", err);
    res.status(500).json({ message: "Error in cron job", error: err.message });
  }
}
