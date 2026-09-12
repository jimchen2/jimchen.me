# jimchen.me

Personal blog: daily journals, travel notes and tech writing. Next.js (pages
router) + Postgres (Neon), hosted on Vercel.

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

## Running locally

```bash
npm install
npm run dev
```

No database needed: with `POSTGRESQL_URL` unset, the site serves the markdown
posts in `content/posts/` (compiled at boot with markdown-it + KaTeX), and
likes/views/comments switch themselves off gracefully. Set `POSTGRESQL_URL`
(and `likes_SECRET_KEY`) in `.env.local` to run against Postgres; if the
database becomes unreachable the site automatically falls back to the local
posts for 60s at a time instead of erroring.

### Writing posts

Add a file to `content/posts/` (any name, `.md`):

```markdown
---
blogid: 9c41d7            # 6+ hex chars, must be unique
title: A Rainy Week in Fayetteville
date: 2026-09-05
type: [journal]           # tags, shown as #journal links
preview_image: /image.png # optional
preview_text: Optional one-paragraph card snippet.
---

Post body in markdown. Fenced code blocks become highlighted code cards with
a copy button. Math works inline ($e^{i\pi}+1=0$) and display:

$$ \sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6} $$

`##` and `###` headings get ids and appear in the table of contents.
```

Posts are compiled server-side: headings get anchor ids, code fences become
`<pre><code class="language-x">` (rendered by the CodeBlock component with
syntax highlighting), and math is rendered to KaTeX markup in the HTML so it
works without JavaScript.

### Uploading local posts to Postgres

```bash
npm run seed            # upsert new/changed posts (skips unchanged by hash)
npm run seed -- --force # rewrite every local post
```

Production keeps using Postgres as the source of truth; the markdown files
are the editable source and the offline fallback.

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
