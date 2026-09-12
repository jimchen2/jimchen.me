import { getViewState, recordView } from "@/lib/interactions";
import { getClientIp } from "@/lib/get-ip";
import { generateSignature, validateSignature } from "@/lib/security";
import { isRateLimited } from "@/lib/rateLimit";

const REQUESTS_PER_MINUTE = 30;

export default async function handler(req, res) {
  const { blogid } = req.query;

  if (!blogid) {
    return res.status(400).json({ message: "Missing blogid" });
  }

  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const userIp = getClientIp(req);

  if (isRateLimited(`views:${userIp}`, REQUESTS_PER_MINUTE)) {
    return res.status(429).json({ message: "Too many requests" });
  }

  try {
    if (req.method === "GET") {
      const { views } = await getViewState(blogid);
      return res.status(200).json({ views, token: generateSignature(blogid, userIp) });
    }

    // --- POST: record a view ---
    const { token } = req.body || {};
    const referrer = req.headers.referer || null;

    if (!token) {
      return res.status(403).json({ message: "Missing security token" });
    }

    if (!validateSignature(token, blogid, userIp)) {
      return res.status(403).json({ message: "Invalid session or IP mismatch" });
    }

    const result = await recordView(blogid, userIp, referrer);
    return res.status(200).json({ views: result.views, recorded: result.recorded });
  } catch (err) {
    console.error("View endpoint error:", err);
    return res.status(500).json({ message: "Error updating views" });
  }
}
