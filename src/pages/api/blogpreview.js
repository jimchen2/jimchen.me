// api/blog-preview.js
import dbConnect from "@/backend_utils/db/mongoose";
import { initializeRedis } from "@/backend_utils/db/redis";
import { fetchBlogPreviews } from "./cron/refresh-redis";
import { calculateCountAndCachePagination } from "./cron/refresh-redis";

async function getCachedPaginationInfo(count = 10, type = null) {
  const client = await initializeRedis();

  if (client) {
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
  
  return calculateCountAndCachePagination(count, type); // Pass type to function
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

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const start = parseInt(req.query.start) || 0;
      const count = parseInt(req.query.count) || 10;
      const type = req.query.type || null;
      const sort = req.query.sort || 'date_latest'; // Default to date_latest

      // Validate sort parameter
      const validSorts = ['date_oldest', 'date_latest', 'most_words', 'least_words'];
      if (sort && !validSorts.includes(sort)) {
        return res.status(400).json({ message: "Invalid sort parameter" });
      }

      // Create cache key including sort
      const cacheKey = type 
        ? `blog_previews:sort=${sort}&start=${start}&count=${count}&type=${type}`
        : `blog_previews:sort=${sort}&start=${start}&count=${count}`;
      
      const blogPreviews = await getFromCacheOrFetch(cacheKey, () => 
        fetchBlogPreviews(start, count, type, sort)
      );

      const { totalPages, totalBlogs } = await getCachedPaginationInfo(count, type);

      res.json({
        data: blogPreviews,
        pagination: {
          totalPages,
          currentPage: Math.floor(start / count) + 1,
          pageSize: count,
          totalItems: totalBlogs || null,
          type: type,
          sort: sort,
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