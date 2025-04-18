## [Prev Code](https://github.com/jimchen2/old-website-react)

## Blogs

```
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    date TIMESTAMP,
    type VARCHAR(50),
    body TEXT,
    language VARCHAR(5) DEFAULT 'en',
    word_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE INDEX idx_blogs_uuid ON blogs(uuid);
CREATE INDEX idx_blogs_date ON blogs(date);
CREATE INDEX idx_blogs_type ON blogs(type);
CREATE INDEX idx_blogs_word_count ON blogs(word_count);
```

## Comments

```
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pointer TEXT[], -- Array type to store multiple strings
    blog_id VARCHAR(36) NOT NULL,
    blog_name TEXT NOT NULL,
    likes TEXT[], -- Array type to store multiple user IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Likes

```
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    parent_id VARCHAR(36) NOT NULL,
    likes TEXT[], -- Array type to store multiple user IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
