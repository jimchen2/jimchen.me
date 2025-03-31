import dbConnect from "@/backend_utils/db/mongoose";
import Blog from "@/backend_utils/models/blog.model";
import { initializeRedis } from "@/backend_utils/db/redis";

export default async function handler(req, res) {
  try {
    // Try to get from Redis cache first
    const client = await initializeRedis();
    
    if (client) {
      try {
        const cachedTypes = await client.get("blog_types_with_counts");
        
        if (cachedTypes) {
          return res.status(200).json(JSON.parse(cachedTypes));
        }
      } catch (error) {
        console.error("Redis error when fetching blog types:", error);
        // Continue to fallback if Redis fails
      }
    }

    // Fallback to MongoDB if Redis is unavailable or cache miss
    await dbConnect();
    
    const blogTypes = await Blog.distinct("type");
    
    // Get count for each type
    const typesWithCounts = await Promise.all(
      blogTypes.map(async (type) => {
        const count = await Blog.countDocuments({ type });
        return { type, count };
      })
    );
    
    // Cache the result in Redis if available
    if (client) {
      await client.setEx("blog_types_with_counts", 365 * 24 * 60 * 60, JSON.stringify(typesWithCounts));
    }
    
    return res.status(200).json(typesWithCounts);
  } catch (error) {
    console.error("Error fetching blog types:", error);
    return res.status(500).json({ message: "Failed to fetch blog types", error: error.message });
  }
}
