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

**Foreign Keys:**

- `blogid` → blogs(blogid) ON DELETE CASCADE
