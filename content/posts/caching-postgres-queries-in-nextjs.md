---
title: Caching Postgres Queries in Next.js Without a Cache Server
date: 2026-06-02
type: [programming, web, systems]
preview_text: Most blogs read far more than they write. That asymmetry means a surprising amount of speed is available for free, if you are willing to keep a little state in the process.
---

Most blogs read far more than they write. That asymmetry means a surprising amount of
speed is available for free, if you are willing to keep a little state in the process.

## The problem

My homepage rendered in about 400 ms, and almost all of it was one query:

```sql
SELECT id, blogid, title, date, type, word_count, preview_image, preview_text
FROM blogs
ORDER BY date DESC
LIMIT 10 OFFSET 0;
```

There is nothing wrong with that query. It is indexed, it returns ten rows, and it
still costs a network round trip — from a cold serverless function, sometimes two.

## The pattern

Keep the query, wrap it in a tiny in-process cache with a time-to-live. The cache lives
for as long as the serverless instance does, which is exactly the lifetime we want.

```javascript
// lib/cache.js
const store = new Map();

export function memoize(fn, ttlMs = 30_000) {
  return async function memoized(...args) {
    const key = `${fn.name}:${JSON.stringify(args)}`;
    const now = Date.now();
    const hit = store.get(key);

    if (hit && now - hit.at < ttlMs) {
      return hit.value;
    }

    const value = await fn(...args);
    store.set(key, { at: now, value });
    return value;
  };
}
```

Then the data access function becomes:

```javascript
export const getTagCounts = memoize(async () => {
  const { rows } = await pool.query(`
    SELECT single_type AS type, COUNT(*) AS count
    FROM blogs, UNNEST(type) AS single_type
    WHERE cardinality(type) > 0
    GROUP BY single_type
    ORDER BY count DESC
  `);
  return rows.map((row) => ({ type: row.type, count: Number(row.count) }));
}, 60_000);
```

## Three rules I keep

1. **Cache reads, never writes.** Invalidate by TTL only. If a new post appears 30
   seconds late in a tag count, nobody is harmed.
2. **Key on the arguments.** A cache that ignores filters will happily serve you the
   wrong page forever.
3. **Do not cache user-specific data.** Likes, views, and comments should always be
   computed fresh, because a stale "1 like" is just a bug with extra steps.

## What it changed

| Endpoint | Before | After (warm) |
| --- | --- | --- |
| `/` render | 400 ms | 90 ms |
| Tag counts | 55 ms | 0.1 ms |
| Post lookup | 70 ms | 70 ms |

The last row is intentional. Post bodies change when I edit them, and I would rather pay
70 ms than serve yesterday's typo.

> A cache is a bet that the future looks like the past. Place small bets, and place them
> where being wrong is cheap.

## The unglamorous part

None of this beats a CDN in front of the whole page. Static generation plus
`stale-while-revalidate` handles 95% of a personal blog's traffic. The in-process cache
is for the 5% that must be dynamic — search, filtering, and anything that touches the
database at request time.
