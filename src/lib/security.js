// lib/security.js
import crypto from "node:crypto";

const SECRET = process.env.likes_SECRET_KEY || process.env.LIKES_SECRET_KEY || "";

/**
 * Generates a hash signature based on IP and BlogID.
 * The signature proves the client fetched the page (and therefore received the
 * token) from this server, without exposing the IP.
 */
export const generateSignature = (blogid, ip) => {
  if (!SECRET) return "";
  return crypto.createHmac("sha256", SECRET).update(`${blogid}-${ip}`).digest("hex");
};

/** Validates that the provided signature matches the current IP and BlogID. */
export const validateSignature = (signature, blogid, ip) => {
  if (!SECRET || !signature) return false;

  const expected = generateSignature(blogid, ip);
  const provided = String(signature);

  // timingSafeEqual throws when the lengths differ — compare lengths first.
  if (provided.length !== expected.length) return false;

  try {
    return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
};
