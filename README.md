Need to add i18n

## Schema

```
CREATE TABLE likes (
  id SERIAL PRIMARY KEY, -- Unique identifier for the likes record
  parent_id VARCHAR(255) NOT NULL, -- Identifier for the blog post (e.g., blogid)
  likes TEXT[] DEFAULT '{}', -- Array of user IPs who liked the blog post
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the record was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the record was last updated
  UNIQUE (parent_id) -- Ensure each blog post has only one likes record
);

CREATE TABLE comments (
    uuid TEXT PRIMARY KEY,
    user_name TEXT,
    text TEXT,
    blog_id TEXT,
    blog_name TEXT,
    pointer TEXT[] DEFAULT '{}',
    likes TEXT[] DEFAULT '{}',
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

```
pg_dump --clean --no-owner -f neondb_dump.sql "postgres://........aws.neon.tech/neondb?sslmode=require"
```

```
createdb neondb_local_copy
psql -d neondb_local_copy -f neondb_dump.sql
```




Use i18n.
Also in the website repo separate the blog fetching in the backend.
Also, add a popup at page start with the locale to check which language user wants if there's no cookie.
Also, blog's comments title should also match that title.
Also, try to add ?tr=lang to the blog name in the preview menu instead of different fetching.
Also add the disclaimers that the blog is translated by which LLM and add a link to the original language.
