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

