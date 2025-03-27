import Blog from "../../backend_utils/models/blog.model";
import dbConnect from "../../backend_utils/db/mongoose";
import { createClient } from "redis";

// Initialize Redis client
let redisClient;

async function initializeRedis() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on("error", (err) => console.error("Redis Client Error", err));

    try {
      await redisClient.connect();
    } catch (err) {
      console.error("Failed to connect to Redis:", err);
      redisClient = null;
    }
  }
  return redisClient;
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

// Background refresh function
async function refreshCacheInBackground(cacheKey, fetchFn) {
  try {
    const client = await initializeRedis();
    if (!client) return;

    const freshData = await fetchFn();
    await client.setEx(cacheKey, 24 * 60 * 60 * 100, JSON.stringify(freshData));
  } catch (err) {}
}

async function getFromCacheOrFetch(cacheKey, fetchFn) {
  const client = await initializeRedis();

  if (!client) {
    return fetchFn();
  }

  try {
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      const ttl = await client.ttl(cacheKey);
      if (ttl < 24 * 60 * 60 * 99) {
        setImmediate(() => refreshCacheInBackground(cacheKey, fetchFn));
      }
      return JSON.parse(cachedData);
    }

    // If cache is expired or missing, fetch fresh data immediately for this request
    const data = await fetchFn();
    await client.setEx(cacheKey, 24 * 60 * 60 * 100, JSON.stringify(data));
    return data;
  } catch (err) {
    console.error("Redis error:", err);
    return fetchFn(); // Fallback to direct fetch on error
  }
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const fetchBlogData = async () => {
        const blogs = await Blog.find().sort({ date: -1 }).collation({ locale: "en_US", numericOrdering: true });

        const previewPromises = blogs.map((blog) => processBlog(blog));
        const previews = await Promise.all(previewPromises);

        const typeCounts = blogs.reduce((acc, blog) => {
          acc[blog.type] = (acc[blog.type] || 0) + 1;
          return acc;
        }, {});

        const postTypes = Object.entries(typeCounts)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count);

        return { previews, postTypes };
      };

      const cacheKey = "blog_previews_and_types";
      const data = await getFromCacheOrFetch(cacheKey, fetchBlogData);

      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error fetching blog previews", error: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
