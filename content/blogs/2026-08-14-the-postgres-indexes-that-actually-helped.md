---
title: The Postgres Indexes That Actually Helped This Blog
date: 2026-08-14
type: [systems]
preview_text: Four queries were slow. Two indexes fixed three of them, and the fourth turned out to be a missing LIMIT. Notes from a weekend of EXPLAIN ANALYZE.
---

This site runs on Postgres. For a long time it was fast for the same reason a bicycle is fast: not much traffic. Then a couple of posts got shared around and the numbers told a different story.

Here is what I found, with the queries close to what is actually in the codebase.

## 1. The listing query

```sql
SELECT id, blogid, title, date, type, word_count, preview_image, preview_text
FROM blogs
ORDER BY date DESC
LIMIT 10 OFFSET 20;
```

`EXPLAIN ANALYZE` showed a full sequential scan followed by a sort, on every page view. With a few thousand rows that is not fatal, but it is also not free, and it gets worse every time I publish.

```sql
CREATE INDEX CONCURRENTLY idx_blogs_date_desc ON blogs (date DESC);
```

After that the plan became an index scan with no sort step. On a cold cache the listing went from roughly 40ms to under 5ms. `CONCURRENTLY` matters here: a plain `CREATE INDEX` takes a write lock, and I did not want the site down while I fixed it.

## 2. Filtering by tag

Tags live in a `text[]` column, and the filter is

```sql
SELECT blogid, title, date FROM blogs
WHERE $1 = ANY(type)
ORDER BY date DESC
LIMIT 10;
```

A B-tree on `type` does not help with `= ANY(...)`. The right tool is GIN:

```sql
CREATE INDEX CONCURRENTLY idx_blogs_type_gin ON blogs USING GIN (type);
```

Postgres can then turn the array-membership test into a bitmap index scan. On the `journal` tag, which is the biggest one, this took the query from 35ms to about 3ms.

## 3. The one-view-per-day check

The view counter does a lookup like this on every post load:

```sql
SELECT id FROM blog_views
WHERE blogid = $1 AND user_ip = $2 AND viewed_at::date = CURRENT_DATE;
```

The `blog_views` table is the one that actually grows without bound, and this query was the slowest thing on the page. The index that fixed it:

```sql
CREATE INDEX CONCURRENTLY idx_blog_views_check
  ON blog_views (blogid, user_ip, (viewed_at::date));
```

Note the expression in the third position. Indexing the expression, rather than the raw timestamp, is what lets Postgres use the index for an equality test on the *day*. Without it, the cast on the column defeats any plain index.

## 4. The one that was not an index problem

The comment list was slow, and I assumed it needed an index on `blog_id`. It did need one:

```sql
CREATE INDEX CONCURRENTLY idx_comments_blog_id ON comments (blog_id, date DESC);
```

But the real problem was that the query fetched every comment for the post and the frontend rendered all of them, on every load, forever. Adding a `LIMIT` and paginating older threads did more for perceived speed than the index did. Lesson, again: measure before you index.

## What I would tell myself six months ago

1. `EXPLAIN (ANALYZE, BUFFERS)` on the actual query, with real data volume. Guessing from the query text is how you build indexes that nobody uses.
2. `CREATE INDEX CONCURRENTLY` on a live site, always. It cannot run inside a transaction block, which is an annoying but fair restriction.
3. Check `pg_stat_user_indexes` a week later. `idx_scan = 0` means you built furniture for a room nobody enters:

```sql
SELECT relname, indexrelname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

4. An index costs you on every write and on disk. This site writes rarely and reads constantly, so the trade is easy — for an app with heavy inserts it would not be.

Next on the list: moving the RSS feed and sitemap off per-request queries and into a cached build step.
