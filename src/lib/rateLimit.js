/**
 * Minimal in-process fixed-window rate limiter.
 *
 * It protects the API from accidental hammering from a single client. It is not
 * a defence against a real attacker — that belongs in front of the app (CDN/WAF).
 */

const buckets = new Map();
let sweeper = null;

function sweep(windowMs) {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.start > windowMs) buckets.delete(key);
  }
}

export function isRateLimited(key, { limit = 30, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.start > windowMs) {
    buckets.set(key, { start: now, count: 1 });
  } else {
    bucket.count += 1;
    if (bucket.count > limit) return true;
  }

  if (!sweeper) {
    sweeper = setInterval(() => sweep(windowMs), windowMs);
    if (typeof sweeper.unref === "function") sweeper.unref();
  }

  return false;
}
