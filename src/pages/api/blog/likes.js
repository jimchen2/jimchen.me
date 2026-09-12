import { getLikeState, toggleLike } from "@/lib/interactions";
import { getClientIp } from "@/lib/get-ip";
import { generateSignature, validateSignature } from "@/lib/security";
import { isRateLimited } from "@/lib/rateLimit";

const REQUESTS_PER_MINUTE = 20;

export default async function handler(req, res) {
  const { blogid } = req.query;

  if (!blogid) {
    return res.status(400).json({ message: "Missing blogid" });
  }

  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // IP security: the IP is never taken from the body, only from the request.
  const userIp = getClientIp(req);

  if (isRateLimited(`likes:${userIp}`, REQUESTS_PER_MINUTE)) {
    return res.status(429).json({ message: "Too many requests. Please slow down." });
  }

  try {
    if (req.method === "GET") {
      const { likes, liked } = await getLikeState(blogid, userIp);

      // The token proves the client really loaded this page from this IP.
      const token = generateSignature(blogid, userIp);

      return res.status(200).json({ likes, liked, token });
    }

    // --- POST: toggle ---
    const { token } = req.body || {};

    if (!token) {
      return res.status(403).json({ message: "Missing security token" });
    }

    if (!validateSignature(token, blogid, userIp)) {
      return res.status(403).json({ message: "Invalid session or IP mismatch" });
    }

    const result = await toggleLike(blogid, userIp);

    return res.status(200).json({
      message: `Successfully ${result.action}`,
      likes: result.likes,
      liked: result.liked,
    });
  } catch (err) {
    console.error("Like endpoint error:", err);
    return res.status(500).json({ message: "Error updating like" });
  }
}
