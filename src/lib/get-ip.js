// lib/get-ip.js

/** Best-effort client IP, normalised for the `inet` columns. */
export const getClientIp = (req) => {
  const forwarded = req?.headers?.["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;

  const ip = (raw ? raw.split(",")[0] : req?.socket?.remoteAddress || "").trim();

  // Normalise IPv4-mapped addresses and loopback so the same client always
  // maps to the same row.
  if (ip === "::1" || ip === "::ffff:127.0.0.1" || ip === "") return "127.0.0.1";
  return ip.startsWith("::ffff:") ? ip.slice(7) : ip;
};
