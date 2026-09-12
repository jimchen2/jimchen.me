import { getClientIp } from "@/lib/get-ip";

/** GET /api/get-ip — debug helper that echoes the caller's IP. */
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ ip: getClientIp(req) });
}
