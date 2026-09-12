import { getClientIp } from "@/lib/get-ip";

/** Debug helper: reports the IP the server sees for this request. */
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ ip: getClientIp(req) });
}
