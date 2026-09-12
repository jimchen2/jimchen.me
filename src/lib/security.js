// src/lib/security.js
// HMAC token used to prove that a like/view request comes from the same client
// that fetched the page (the token binds blogid + client IP to a server secret).

import crypto from "crypto";

const ENV_SECRET = process.env.likes_SECRET_KEY;

// Without a configured secret the app still runs (local development) but the
// token is derived from a non-persistent, per-process value so it can never be
// used to forge requests against a deployment that does set the secret.
const SECRET =
  ENV_SECRET ||
  (globalThis.__likesDevSecret ??= crypto.randomBytes(32).toString("hex"));

if (!ENV_SECRET && process.env.NODE_ENV === "production") {
  console.warn(
    "likes_SECRET_KEY is not set; falling back to a random per-process secret. " +
      "Likes/views will stop validating across restarts and instances.",
  );
}

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
 * Validates that the provided signature matches the current IP and BlogID
 */
export const validateSignature = (signature, blogid, ip) => {
  if (typeof signature !== "string" || signature.length === 0) return false;

  const expectedSignature = generateSignature(blogid, ip);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  // timingSafeEqual throws on length mismatch, which would surface as a 500.
  if (provided.length !== expected.length) return false;

  try {
    return crypto.timingSafeEqual(provided, expected);
  } catch {
    return false;
  }
};
