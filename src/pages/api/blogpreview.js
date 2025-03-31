import dbConnect from "@/backend_utils/db/mongoose";
import { initializeRedis } from "@/backend_utils/db/redis";
import { fetchBlogPreviews } from "./cron/refresh-redis";
import { calculateAndCachePagination } from "./cron/refresh-redis";

async function getCachedPaginationInfo(count = 10, type = null) {
  const client = await initializeRedis();

  if (client) {
    // If type is provided, get type-specific pagination info
    if (type) {
      const cachedTotalPages = await client.get(`blog_total_pages_type_${type}`);
      const cachedTotalBlogs = await client.get(`blog_total_count_type_${type}`);

      if (cachedTotalPages && cachedTotalBlogs) {
        return {
          totalPages: parseInt(cachedTotalPages),
          totalBlogs: parseInt(cachedTotalBlogs),
        };
      }
    } else {
      // Get general pagination info
      const cachedTotalPages = await client.get("blog_total_pages");
      const cachedTotalBlogs = await client.get("blog_total_count");

      if (cachedTotalPages && cachedTotalBlogs) {
        return {
          totalPages: parseInt(cachedTotalPages),
          totalBlogs: parseInt(cachedTotalBlogs),
        };
      }
    }
  }
  
  return calculateAndCachePagination(count);
}

async function getFromCacheOrFetch(cacheKey, fetchFn) {
  const client = await initializeRedis();
  if (!client) return await fetchFn();

  const cachedData = await client.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const data = await fetchFn();
  await client.setEx(cacheKey, 365 * 24 * 60 * 60, JSON.stringify(data));
  return data;
}

// Main API handler
export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const start = parseInt(req.query.start) || 0;
      const count = parseInt(req.query.count) || 10;
      const type = req.query.type || null; // Get type from query params if available

      // Create cache key based on parameters (including type if provided)
      const cacheKey = type 
        ? `blog_previews:start=${start}&count=${count}&type=${type}`
        : `blog_previews:start=${start}&count=${count}`;
      
      // Fetch blog previews with type filter if provided
      const blogPreviews = await getFromCacheOrFetch(cacheKey, () => 
        fetchBlogPreviews(start, count, type)
      );

      // Get pagination info (with type-specific info if needed)
      const { totalPages, totalBlogs } = await getCachedPaginationInfo(count, type);

      // Return blog previews along with pagination metadata
      res.json({
        data: blogPreviews,
        pagination: {
          totalPages,
          currentPage: Math.floor(start / count) + 1,
          pageSize: count,
          totalItems: totalBlogs || null,
          type: type || null, // Include type in response if it was used
        },
      });
    } catch (err) {
      console.error("Error in blog preview API:", err);
      res.status(500).json({ message: "Error fetching blog previews", error: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
