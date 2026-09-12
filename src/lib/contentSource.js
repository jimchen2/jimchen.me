import fs from "node:fs";
import path from "node:path";

import { parseFrontMatter, renderMarkdown, slugify } from "./markdown";
import { countWords, normalizeTag, stripHtml, truncate } from "./format";

/**
 * Local, database-free content source.
 *
 * Every file in `content/posts/*.md` becomes a post. This is what makes the site
 * render out of the box (and it is the fallback if Postgres is unreachable) —
 * when `POSTGRESQL_URL` is set, the database remains the source of truth.
 */

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const CACHE_TTL_MS = process.env.NODE_ENV === "production" ? 30_000 : 2_000;

let cache = { at: 0, posts: null };

export function contentDirectory() {
  return POSTS_DIR;
}

function readPostFiles() {
  let entries;
  try {
    entries = fs.readdirSync(POSTS_DIR);
  } catch {
    return [];
  }

  return entries
    .filter((file) => /\.(md|markdown)$/i.test(file))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      return buildPost(file, raw);
    })
    .filter(Boolean);
}

function buildPost(file, raw) {
  const { data, content } = parseFrontMatter(raw);

  if (data.draft === true || data.draft === "true") return null;

  const slug = slugify(data.slug || file.replace(/\.(md|markdown)$/i, ""), "post");
  const body = renderMarkdown(content);
  const plainText = stripHtml(body);
  const date = data.date ? new Date(data.date) : new Date(fs.statSync(path.join(POSTS_DIR, file)).mtime);

  const type = (Array.isArray(data.type) ? data.type : data.type ? [data.type] : [])
    .map(normalizeTag)
    .filter(Boolean);

  return {
    id: slug,
    blogid: slug,
    title: data.title || slug.replace(/-/g, " "),
    date: (Number.isNaN(date.getTime()) ? new Date() : date).toISOString(),
    type,
    body,
    text: plainText,
    word_count: countWords(body),
    preview_image: data.preview_image || null,
    preview_text: data.preview_text ? String(data.preview_text) : truncate(plainText, 220),
  };
}

export function getAllPosts() {
  const now = Date.now();
  if (cache.posts && now - cache.at < CACHE_TTL_MS) return cache.posts;

  const posts = readPostFiles().sort((a, b) => new Date(b.date) - new Date(a.date));
  cache = { at: now, posts };
  return posts;
}

export function getPostBySlug(slug) {
  return getAllPosts().find((post) => post.blogid === slug) || null;
}

export function getTypesWithCounts() {
  const counts = new Map();
  for (const post of getAllPosts()) {
    for (const tag of post.type) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
}

function matchesType(post, type) {
  if (!type) return true;
  const wanted = normalizeTag(type);
  return post.type.some((tag) => normalizeTag(tag) === wanted);
}

function matchesSearch(post, searchterm) {
  if (!searchterm) return true;
  return post.searchText.includes(searchterm.toLowerCase());
}

function withSearchText(post) {
  return {
    ...post,
    searchText: `${post.title.replace(/-/g, " ")} ${post.text}`.toLowerCase(),
  };
}

/** Mirrors the query API of the Postgres path: filtering, sorting, pagination. */
export function queryPosts({ start = 0, count = 10, type = null, sort = "date_latest", searchterm = null } = {}) {
  const all = getAllPosts().map(withSearchText);

  let rows = all.filter((post) => matchesType(post, type) && matchesSearch(post, searchterm));

  const sorters = {
    date_oldest: (a, b) => new Date(a.date) - new Date(b.date),
    date_latest: (a, b) => new Date(b.date) - new Date(a.date),
    most_words: (a, b) => b.word_count - a.word_count,
    least_words: (a, b) => a.word_count - b.word_count,
  };
  rows = [...rows].sort(sorters[sort] || sorters.date_latest);

  const total = rows.length;
  const slice = rows.slice(start, start + count);

  return {
    total,
    rows: slice.map(({ searchText, text, ...post }) => post),
  };
}


