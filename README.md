# jimchen.me

Personal blog: Next.js (pages router) + Postgres, deployed on Vercel.

## CSS Rules

1. A link has the natural underline and color
2. Instant state changes, no hover, edges should be sharp,
3. System typography only

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

No configuration is required to run the site locally: without a database it
renders the markdown posts in [`content/posts`](./content/posts) (see
[Local content](#local-content)).

## Environment

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
| --- | --- |
| `POSTGRESQL_URL` | Postgres connection string (Neon in production). Leave empty to use the markdown posts. |
| `NEXT_PUBLIC_SITE` | Public origin used for canonical URLs, RSS and the sitemap. Falls back to the request host. |
| `likes_SECRET_KEY` | Secret used to sign the like/view tokens. Any long random string. |

## Local content

Every `*.md` file in `content/posts/` is a post. This is what the site falls back
to when `POSTGRESQL_URL` is not set (or is unreachable), so the blog always
renders something — useful for local development and previews.

```markdown
---
title: A Slow Sunday in September
date: 2026-09-06
type: [journal]
preview_text: Optional summary shown on the homepage card.
preview_image: Optional image URL.
draft: false            # drafts are skipped
---

Markdown body. `#` becomes a section heading, `##` a sub-heading.
```

Supported in bodies:

- GitHub-flavoured markdown (tables, task lists, blockquotes, footnotes)
- fenced code blocks with syntax highlighting (` ```javascript `)
- math with KaTeX: `$inline$`, `$$display$$`, `\(inline\)`, `\[display\]`
- images (`loading="lazy"` is added automatically)

One `#` is the first heading level in the body because the post title is the
page `<h1>`; headings are shifted down one level during rendering.

When `POSTGRESQL_URL` **is** set, Postgres is the source of truth and the
markdown files are ignored (`src/lib/blogData.js` picks the backend).

A small notice at the top of the homepage says which source is in use.

## How a request is rendered

```
page (getServerSideProps)  ->  lib/blogData  ->  Postgres  |  content/posts
API routes                 ->  lib/blogData
```

Pages and API routes call the data layer directly instead of fetching
`/api/blog/preview` over HTTP, so nothing depends on `NEXT_PUBLIC_SITE` being
set correctly at request time.

Markdown is converted to HTML in `src/lib/markdown.js` (marked + KaTeX) and the
HTML is parsed into React elements in `src/singleblog/singleBlog.js`, which is
where code blocks, heading anchors, lazy images and scrollable tables come from.
Raw LaTeX stored in the database is typeset on the client by KaTeX.

## Platforms Used for Website

- Code, Blog content: Github
- Hosting: Vercel (PAAS)
- Database: Neon Postgres (for CI/CD from Github)
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

- `comments_pkey` PRIMARY KEY, btree (uuid)
