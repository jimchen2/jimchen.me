// src/lib/content.js
// File-based post store.
//
// Posts live in `content/blogs/*.md` as Markdown with a small frontmatter block.
// This is the fallback (and local-development) source used whenever
// POSTGRESQL_URL is not configured; in production the Postgres tables described
// in README.md are used instead. The shape returned here mirrors the `blogs`
// table so the rest of the app cannot tell the two apart.
//
// Frontmatter supported keys:
//   title          (required)
//   blogid         (optional, defaults to the file name without the date prefix)
//   date           (required, YYYY-MM-DD or any Date-parseable string)
//   type           (array: `type: [journal, culture]` or `type: journal, culture`)
//   preview_text   (optional, defaults to the first ~200 words of plain text)
//   preview_image  (optional)

import fs from "fs";
import path from "path";
import {
  renderMarkdownToHtml,
  countWords,
  makeSnippet,
  slugify,
} from "./markdown.js";

const CONTENT_DIR = path.join(process.cwd(), "content", "blogs");

// Very small frontmatter parser (scalar + inline array + list items).
export function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data: {}, body: raw };

  const data = {};
  const lines = match[1].split(/\r?\n/);
  let currentKey = null;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const listMatch = /^\s+-\s+(.*)$/.exec(line);
    if (listMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(stripQuotes(listMatch[1].trim()));
      continue;
    }

    const kv = /^([A-Za-z0-9_]+)\s*:\s*(.*)$/.exec(line);
    if (!kv) continue;

    const [, key, rawValue] = kv;
    const value = rawValue.trim();
    currentKey = key;

    if (value === "") {
      data[key] = [];
      continue;
    }

    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((part) => stripQuotes(part.trim()))
        .filter(Boolean);
      continue;
    }

    data[key] = stripQuotes(value);
  }

  return { data, body: raw.slice(match[0].length) };
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function normalizeTypes(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((t) => String(t).trim()).filter(Boolean);
  }
  return String(value)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// Cache parsed files, invalidated by mtime so `next dev` picks up edits.
let cache = { key: "", posts: [] };

function buildCacheKey() {
  if (!fs.existsSync(CONTENT_DIR)) return "missing";
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const stat = fs.statSync(path.join(CONTENT_DIR, file));
      return `${file}:${stat.mtimeMs}:${stat.size}`;
    })
    .sort()
    .join("|");
}

function parseFile(file) {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
  const { data, body } = parseFrontmatter(raw);

  const datePrefix = /^(\d{4}-\d{2}-\d{2})[-_]/.exec(file);
  const fallbackId = datePrefix
    ? file.slice(datePrefix[0].length).replace(/\.md$/, "")
    : file.replace(/\.md$/, "");

  const title = data.title || fallbackId.split("-").join(" ");
  const blogid = data.blogid || slugify(fallbackId) || slugify(title);
  const date = data.date || datePrefix?.[1] || null;

  return {
    blogid,
    title,
    date: date ? new Date(date).toISOString() : null,
    type: normalizeTypes(data.type),
    markdown: body,
    word_count: data.word_count ? Number(data.word_count) : countWords(body),
    preview_image: data.preview_image || null,
    preview_text: data.preview_text || makeSnippet(body),
    updated_at: fs.statSync(path.join(CONTENT_DIR, file)).mtime.toISOString(),
  };
}

function loadPosts() {
  const key = buildCacheKey();
  if (key === cache.key) return cache.posts;

  if (key === "missing") {
    cache = { key, posts: [] };
    return cache.posts;
  }

  const posts = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      try {
        return parseFile(file);
      } catch (err) {
        console.error(`Skipping malformed post "${file}":`, err.message);
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  cache = { key, posts };
  return posts;
}

/**
 * Posts without the Markdown source (cheap; used for listings and sitemaps).
 * Pass `includeMarkdown: true` when the caller needs to search the full text.
 */
export function listLocalPosts({ includeMarkdown = false } = {}) {
  if (includeMarkdown) return loadPosts().map((post) => ({ ...post }));
  return loadPosts().map(({ markdown, ...rest }) => rest);
}

export function getLocalPost(blogid) {
  const post = loadPosts().find((p) => p.blogid === blogid);
  if (!post) return null;
  return { ...post, body: renderMarkdownToHtml(post.markdown) };
}

export function getLocalTypesWithCounts() {
  const counts = new Map();
  for (const post of loadPosts()) {
    for (const type of post.type) {
      counts.set(type, (counts.get(type) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
}
