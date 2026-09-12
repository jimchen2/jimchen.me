---
title: A Tiny Rate Limiter in Node
date: 2026-05-18
type: [programming, web]
preview_text: Twenty lines of code will stop a surprising amount of abuse. Here is the counter-in-a-Map version I actually ship, why it is imperfect, and when to reach for something else.
---

Twenty lines of code will stop a surprising amount of abuse. Here is the version I
actually ship.

## The whole thing

```javascript
// lib/rate-limit.js
const buckets = new Map();

export function isRateLimited(key, { limit = 30, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.start > windowMs) {
    buckets.set(key, { start: now, count: 1 });
    return false;
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return true;
  }

  return false;
}
```

Call it at the top of an API route:

```javascript
const ip = getClientIp(req);

if (isRateLimited(`${ip}:${req.url}`, { limit: 20 })) {
  return res.status(429).json({ message: "Too many requests" });
}
```

That is a fixed window counter, and it is enough for a site whose worst-case abuse is
a bored person with `curl`.

## The leak

`buckets` grows forever. Every new IP adds an entry and nothing removes it. On a
long-lived server this is a slow memory leak; on serverless it barely matters because
the process dies. Still, the fix is four lines:

```javascript
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.start > 60_000) buckets.delete(key);
  }
}, 60_000).unref();
```

Two details worth noticing:

- `.unref()` keeps the timer from holding the process open on shutdown.
- Iterating a `Map` while deleting from it is safe in JavaScript, which is a nicer
  guarantee than most languages give you.

## Why fixed windows are wrong (and why that's fine)

A fixed window lets a client send the full quota at the end of one window and the full
quota again at the start of the next — double the rate, for a moment. If that matters,
use a sliding window or a token bucket:

```javascript
export function tokenBucket(key, { rate = 0.5, burst = 10 } = {}) {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: burst, at: now };

  b.tokens = Math.min(burst, b.tokens + ((now - b.at) / 1000) * rate);
  b.at = now;

  if (b.tokens < 1) {
    buckets.set(key, b);
    return false;
  }

  b.tokens -= 1;
  buckets.set(key, b);
  return true;
}
```

Here `rate` is tokens per second and `burst` is how much you are allowed to save up.
For 20 requests a minute with a little tolerance for bursts, `rate = 0.33`, `burst = 5`.

## When to stop hand-rolling

| Situation | Use |
| --- | --- |
| One serverless region, a personal site | Map + fixed window |
| Multiple instances behind a load balancer | Redis or Upstash |
| Protection from a real attacker | A CDN or WAF, before your code runs |

The last row is the important one. An in-process limiter protects your database from
accidents; it does not protect you from anyone determined. That job belongs to
infrastructure that sees traffic before your function is even invoked.
