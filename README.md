# jimchen.me

A Next.js (pages router) blog. Posts are Markdown, the chrome is React + Bootstrap,
math is KaTeX, and the database is Postgres.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev                  # http://localhost:3000
```

The site runs with **no configuration at all**: with `POSTGRESQL_URL` unset it
serves the Markdown files in `content/blogs`, so a fresh clone renders
immediately.

## Two content modes

`src/lib/blogRepo.js` is the only place that decides where posts come from.

| `POSTGRESQL_URL` | Posts come from                        | Likes / views / comments      |
| ---------------- | -------------------------------------- | ----------------------------- |
| set              | the `blogs` table in Postgres (below)  | `blog_likes` / `blog_views` / `comments` |
| unset            | `content/blogs/*.md`                   | in memory (reset on restart)  |

Nothing else in the app knows which one is active. Pages call the repository
directly instead of making HTTP calls to the app's own API, and the API routes
are thin handlers over the same repository.

## Writing a post

Add a file to `content/blogs` named `YYYY-MM-DD-slug.md`:

```markdown
---
title: How Many Shuffles Does a Deck Actually Need?
date: 2026-07-26
type: [math]
preview_text: Optional one-line summary shown in the post list.
preview_image: https://.../cover.jpg   # optional
---

Body in Markdown. Headings get ids automatically, which is what feeds the
table of contents.
```

- `blogid` defaults to the file name without the date prefix and becomes the URL `/a/<blogid>`.
- `type` accepts `[a, b]`, `a, b`, or a YAML list; tags drive `/?type=...` filtering.
- `word_count` and `preview_text` are computed when omitted.
- Files are re-read when their mtime changes, so `next dev` picks up edits.

### Code and math

Fenced code blocks become a copyable block with a language label:

````markdown
```python
def fisher_yates(cards): ...
```
````

Math uses `$inline$` and `$$display$$` (also `\(...\)` and `\[...\]`). It is
rendered to KaTeX on the server, so formulas are in the initial HTML.
Delimiters inside code are ignored, and `$5 and $10` stays prose.

## Scripts

| Command         | What it does                                             |
| --------------- | -------------------------------------------------------- |
| `npm run dev`   | dev server                                               |
| `npm run build` | production build                                         |
| `npm run start` | serve the production build                               |
| `npm run lint`  | ESLint                                                   |
| `npm run smoke` | end-to-end checks against a running instance             |

`npm run smoke` hits the real HTTP endpoints (pages, feeds, likes, views,
comments) and asserts on the responses:

```bash
npm run dev &
npm run smoke -- http://localhost:3000
```

## Environment

See `.env.example`. `NEXT_PUBLIC_SITE` is used for canonical URLs, Open Graph
tags and the RSS feed, and falls back to the request host when unset.

## CSS Rules

1. A link has the natural underline and color
2. Instant State Changes, no hover, edges should be sharp,
3. System typography only

## Platforms Used for Website

- Code, Blog content: Github
- Hosting: Vercel(PAAS)
- Database: Neon Postgres(for CI/CD from Github)
- Hosting Photos: Cloudflare R2
- Domain: Cloudflare

## Schema

### blogs

| Column        | Type                        | Collation | Nullable | Default                           |
| ------------- | --------------------------- | --------- | -------- | --------------------------------- |
| id            | integer                     |           | not null | nextval('blogs_id_seq'::regclass) |
| blogid        | character varying(36)       |           | not null |                                   |
| title         | text                        |           | not null |                                   |
| date          | timestamp without time zone |           |          |                                   |
| type          | text[]                      |           |          |                                   |
| body          | text                        |           |          |                                   |
| word_count    | integer                     |           |          |                                   |
| created_at    | timestamp without time zone |           |          | CURRENT_TIMESTAMP                 |
| updated_at    | timestamp without time zone |           |          | CURRENT_TIMESTAMP                 |
| preview_image | text                        |           |          |                                   |
| preview_text  | text                        |           |          |                                   |
| markdown_hash | character varying(64)       |           |          |                                   |

**Indexes:**

- `blogs_pkey` PRIMARY KEY, btree (id)
- `blogs_blogid_key` UNIQUE CONSTRAINT, btree (blogid)

### blog_likes

| Column     | Type                        | Collation | Nullable | Default                                |
| ---------- | --------------------------- | --------- | -------- | -------------------------------------- |
| id         | integer                     |           | not null | nextval('blog_likes_id_seq'::regclass) |
| blogid     | character varying(36)       |           | not null |                                        |
| user_ip    | inet                        |           |          |                                        |
| created_at | timestamp without time zone |           |          | CURRENT_TIMESTAMP                      |

**Indexes:**

- `blog_likes_pkey` PRIMARY KEY, btree (id)
- `blog_likes_blogid_ip` UNIQUE CONSTRAINT, btree (blogid, user_ip)

**Foreign Keys:**

- `blogid` → blogs(blogid) ON DELETE CASCADE

### blog_views

| Column    | Type                        | Collation | Nullable | Default                                |
| --------- | --------------------------- | --------- | -------- | -------------------------------------- |
| id        | integer                     |           | not null | nextval('blog_views_id_seq'::regclass) |
| blogid    | character varying(36)       |           | not null |                                        |
| user_ip   | inet                        |           |          |                                        |
| referrer  | text                        |           |          |                                        |
| viewed_at | timestamp without time zone |           |          | CURRENT_TIMESTAMP                      |

**Indexes:**

- `blog_views_pkey` PRIMARY KEY, btree (id)
- `blog_views_blogid_idx` btree (blogid)
- `idx_blog_views_check` btree (blogid, user_ip, (viewed_at::date))

**Foreign Keys:**

- `blogid` → blogs(blogid) ON DELETE CASCADE

### comment

| Column     | Type                        | Collation | Nullable | Default           |
| ---------- | --------------------------- | --------- | -------- | ----------------- |
| uuid       | text                        |           | not null |                   |
| user_name  | text                        |           |          |                   |
| text       | text                        |           |          |                   |
| blog_id    | text                        |           |          |                   |
| uppointer  | text[]                      |           |          | '{}'::text[]      |
| date       | timestamp without time zone |           |          | CURRENT_TIMESTAMP |
| updated_at | timestamp without time zone |           |          | CURRENT_TIMESTAMP |

**Indexes:**

- "comments_pkey" PRIMARY KEY, btree (uuid)