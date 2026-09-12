/**
 * Local markdown content store.
 *
 * Reads `content/posts/*.md`, compiles them once (cached by mtime) and serves
 * them in exactly the same row shape as the Postgres `blogs` table. It powers
 * local development / previews without a database and acts as a safety net if
 * the database is unreachable. Production with POSTGRESQL_URL set keeps using
 * Postgres as the source of truth (see `npm run seed` to upload these posts).
 */
import fs from "fs";
import path from "path";
import { compilePost } from "./compile.mjs";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

let cache = { key: "", posts: [] };

export function loadLocalPosts() {
  let files = [];
  try {
    files = fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".md"))
      .sort();
  } catch {
    return cache.posts || [];
  }

  let key = "";
  for (const f of files) {
    try {
      const st = fs.statSync(path.join(CONTENT_DIR, f));
      key += `${f}:${st.mtimeMs}:${st.size};`;
    } catch {
      /* ignore unreadable file */
    }
  }
  if (key === cache.key) return cache.posts;

  const posts = [];
  for (const f of files) {
    try {
      const source = fs.readFileSync(path.join(CONTENT_DIR, f), "utf8");
      const post = compilePost(source, f.replace(/\.md$/, ""));
      // search/snippets work on plain text, not on rendered HTML
      post.snippet_source = post.plain_text;
      posts.push(post);
    } catch (err) {
      console.error(`[localPosts] failed to compile ${f}:`, err);
    }
  }
  posts.sort((a, b) => b.date - a.date);
  cache = { key, posts };
  return posts;
}

const SORTS = {
  date_oldest: (a, b) => a.date - b.date,
  date_latest: (a, b) => b.date - a.date,
  most_words: (a, b) => b.word_count - a.word_count,
  least_words: (a, b) => a.word_count - b.word_count,
};

function matches(post, type, searchterm) {
  if (type && !(post.type || []).includes(type)) return false;
  if (searchterm) {
    const term = String(searchterm).toLowerCase();
    const title = String(post.title || "").toLowerCase().replace(/-/g, " ");
    const text = String(post.plain_text || "").toLowerCase();
    if (!title.includes(term) && !text.includes(term)) return false;
  }
  return true;
}

export function queryLocalPosts({
  start = 0,
  count = 10,
  type = null,
  sort = "date_latest",
  searchterm = null,
} = {}) {
  const all = loadLocalPosts()
    .filter((p) => matches(p, type, searchterm))
    .sort(SORTS[sort] || SORTS.date_latest);
  return all.slice(start, start + count);
}

export function countLocalPosts({ type = null, searchterm = null } = {}) {
  const total = loadLocalPosts().filter((p) => matches(p, type, searchterm)).length;
  return { totalBlogs: total };
}

export function localTypesWithCounts() {
  const counts = new Map();
  for (const post of loadLocalPosts()) {
    for (const t of post.type || []) {
      counts.set(t, (counts.get(t) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
}

export function getLocalPost(blogid) {
  return loadLocalPosts().find((p) => p.blogid === blogid) || null;
}

export function localSitemapBlogs() {
  return loadLocalPosts()
    .slice()
    .sort((a, b) => b.date - a.date)
    .map((p) => ({ blogid: p.blogid, date: p.date }));
}

export function localRecentBlogs(limit = 15) {
  return loadLocalPosts()
    .slice()
    .sort((a, b) => b.date - a.date)
    .slice(0, limit);
}
