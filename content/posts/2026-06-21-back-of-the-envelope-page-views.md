---
blogid: 54d0e2
title: Back of the Envelope: What Does a Page View Actually Cost?
date: 2026-06-21
type: [systems, tech]
---

This blog counts page views by inserting one Postgres row per unique visitor per day. A reader asked whether that is "a lot of writes". I like this question because the answer is a five-minute Fermi calculation, and Fermi calculations are the only systems skill I use every single day.

## Traffic, honestly

Let the site get $R = 3{,}000$ page views per day at the top of a spike month, and dedupe to $U = 1{,}800$ unique (visitor, page, day) triples. Writes per second, averaged:

$$ \lambda = \frac{U}{86{,}400\ \text{s}} \approx 0.021\ \text{writes/s} $$

Even a $100\times$ spike is $2$ writes/s. A single Postgres instance handles thousands of simple inserts per second, so the honest answer is: the write load is a rounding error, and I should spend my worry budget elsewhere. The real question is *storage* and *index maintenance*.

## Storage over a year

Each row in `blog_views` carries an id, a 6-char blogid, an inet, a referrer text, and a timestamp. With toast and index overhead, call it $120$ bytes:

$$ S = 1{,}800 \times 365 \times 120\ \text{B} \approx 79\ \text{MB/year} $$

Plus two secondary indexes, so round up to $120$ MB/year. That is nothing for Neon, and it is also nothing for a $5/month VPS. Storage is not the constraint either. The constraint I actually hit was **read amplification**: counting views with `COUNT(*)` scans the whole table every page load.

## The fix that mattered

```sql
-- before: O(table size) on every single page view
SELECT COUNT(*) FROM blog_views WHERE blogid = $1;

-- after: O(1), maintained by the database itself
CREATE MATERIALIZED VIEW blog_view_counts AS
  SELECT blogid, COUNT(*) AS views
  FROM blog_views
  GROUP BY blogid;

CREATE UNIQUE INDEX ON blog_view_counts (blogid);
REFRESH MATERIALIZED VIEW CONCURRENTLY blog_view_counts;
```

(On a blog this small, a plain grouped aggregate with an index on `blogid` is equally fine; the materialized view is there because it makes the point that the expensive part of a counter is the reading, not the writing.)

The same calculation applies to the dedupe check, which runs before every insert:

```sql
SELECT 1 FROM blog_views
WHERE blogid = $1 AND user_ip = $2 AND viewed_at::date = CURRENT_DATE;
```

Without an index this is a sequential scan per page view; with the composite index

```sql
CREATE INDEX idx_blog_views_check
  ON blog_views (blogid, user_ip, (viewed_at::date));
```

it is three index probes. The query plan went from "scan 400k rows, 60 ms" to "index scan, 0.2 ms", which is the difference between a counter and a DDoS on myself.

## Little's law, because it always applies

For anything queue-like on the site (the connection pool included), Little's law relates the three numbers I care about:

$$ L = \lambda \, W $$

With $\lambda = 30$ requests/s at spike and average latency $W = 80$ ms, the average number of in-flight requests is $L = 2.4$. A pool of ten connections is therefore $4\times$ headroom, and I can state that instead of feeling it. That is the entire value of these calculations: they convert anxiety into a number with a unit.

## Numbers to remember

- 86,400 seconds in a day; anything per-day divided by it is tiny.
- A row with a text column is ~100 bytes; a year of a small site is ~100 MB.
- Counters are read-heavy; index or pre-aggregate the read path first.
- $L = \lambda W$ sizes every pool, queue, and cache you will ever configure.

The next post in this series does the same treatment for the comment table, where the scary thing is not volume but recursion.
