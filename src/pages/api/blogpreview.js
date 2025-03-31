import Blog from "../../backend_utils/models/blog.model";
import dbConnect from "../../backend_utils/db/mongoose";
import { initializeRedis } from "@/backend_utils/db/redis";

async function getFromCacheOrFetch(cacheKey, fetchFn) {
  const client = await initializeRedis();
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

      const fetchBlogData = async () => {
        const blogs = await Blog.find().sort({ date: -1 }).skip(start).limit(count).collation({ locale: "en_US", numericOrdering: true });
        const previewPromises = blogs.map((blog) => processBlog(blog));
        return Promise.all(previewPromises);
      };

      const cacheKey = `blog_previews:start=${start}&count=${count}`;
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
