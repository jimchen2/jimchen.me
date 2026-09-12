// lib/security.js
import crypto from "crypto";

// Fall back to a per-boot random secret so a missing env var degrades to
// "tokens invalidate on restart" instead of a hard crash on every request.
const SECRET =
  process.env.likes_SECRET_KEY ||
  (global.__likesFallbackSecret ||= crypto.randomBytes(32).toString("hex"));

/**
 * Generates a hash signature based on IP and BlogID
 */
export const generateSignature = (blogid, ip) => {
  return crypto
    .createHmac("sha256", SECRET)
    .update(`${blogid}-${ip}`)
    .digest("hex");
};

/**
 * Validates that the provided signature matches the current IP and BlogID.
 * Constant-time, and safe against mismatched lengths (which would otherwise
 * throw out of timingSafeEqual and turn into a 500).
 */
export const validateSignature = (signature, blogid, ip) => {
  if (typeof signature !== "string" || signature.length === 0) return false;
  const expectedSignature = generateSignature(blogid, ip);
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
};
