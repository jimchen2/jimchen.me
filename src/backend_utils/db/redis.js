import { createClient } from "redis";

let redisClient;

export async function initializeRedis() {
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
