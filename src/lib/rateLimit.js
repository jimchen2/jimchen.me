// src/lib/rateLimit.js
// Small in-memory sliding window limiter.
//
// On a single serverless instance this is best-effort only (each instance has
// its own map); swap it for Vercel KV / Upstash if the limit needs to be exact.

const buckets = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_TRACKED_KEYS = 10_000;

export function isRateLimited(key, requestLimit = 20, windowMs = WINDOW_MS) {
  const now = Date.now();
  const stats = buckets.get(key);

  if (!stats || now - stats.lastRequest > windowMs) {
    // Opportunistic cleanup so the map cannot grow without bound.
    if (buckets.size > MAX_TRACKED_KEYS) {
      for (const [k, v] of buckets) {
        if (now - v.lastRequest > windowMs) buckets.delete(k);
      }
    }
    buckets.set(key, { count: 1, lastRequest: now });
    return false;
  }

  if (stats.count >= requestLimit) return true;

  stats.count += 1;
  buckets.set(key, stats);
  return false;
}
