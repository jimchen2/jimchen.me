// src/lib/blogRepo.js
// Single entry point for reading posts.
//
//   * POSTGRESQL_URL set  -> the Neon Postgres tables documented in README.md
//   * POSTGRESQL_URL unset -> Markdown files under content/blogs
//
// Every consumer (pages, API routes, RSS, sitemap) goes through here, so the
// rest of the app never has to know which backend is active.

import { getLocalPost, listLocalPosts, getLocalTypesWithCounts } from "./content.js";
import { formatDate, stripHtml } from "./display.js";
import {
  pgListBlogPreviews,
  pgGetBlog,
  pgGetBlogTypesWithCounts,
  pgListAllBlogMeta,
  pgCountBlogPreviews,
} from "./blogRepoPg.js";

// Re-exported so server code has one import site; client code must import from
// ./display.js directly to avoid pulling `pg` into the browser bundle.
export { formatDate, formatLongDate, stripHtml, displayTitle } from "./display.js";

export const POSTS_PER_PAGE = 10;

export const SORT_OPTIONS = [
  "date_latest",
  "date_oldest",
  "most_words",
  "least_words",
];

export function isDatabaseConfigured() {
  return Boolean(process.env.POSTGRESQL_URL);
}

/** Snippet centred on the search term, mirroring the SQL ILIKE behaviour. */
export function makeSearchSnippet(body, searchterm, isTitleMatch) {
  if (!body) return "";
  if (isTitleMatch) {
    return body.length > 150 ? `${body.slice(0, 150)}...` : body;
  }
  const index = body.toLowerCase().indexOf(searchterm.toLowerCase());
  if (index === -1) {
    return body.length > 150 ? `${body.slice(0, 150)}...` : body;
  }
  const start = Math.max(index - 75, 0);
  const end = Math.min(start + 150, body.length);
  return `${start > 0 ? "..." : ""}${body.slice(start, end)}${end < body.length ? "..." : ""}`;
}

function normalizeSort(sort) {
  return SORT_OPTIONS.includes(sort) ? sort : "date_latest";
}

function toPreviewRow(row, searchterm) {
  const title = row.title || "";
  const preview = {
    id: row.id ?? null,
    blogid: row.blogid,
    title,
    date: formatDate(row.date),
    rawDate: row.date,
    type: row.type || [],
    word_count: row.word_count ?? 0,
    preview_image: row.preview_image || null,
    preview_text: row.preview_text || "",
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
  };

  if (searchterm) {
    const isTitleMatch = title
      .toLowerCase()
      .replace(/-/g, " ")
      .includes(searchterm.toLowerCase());
    preview.preview_text = makeSearchSnippet(
      stripHtml(row.body ?? row.preview_text ?? ""),
      searchterm,
      isTitleMatch,
    );
  }

  return preview;
}


// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Paginated, filterable post list.
 * Returns `{ posts, pagination, types }` where `pagination` matches the shape
 * the home page has always received from /api/blog/preview.
 */
export async function listBlogPreviews({
  start = 0,
  count = POSTS_PER_PAGE,
  type = null,
  sort = "date_latest",
  searchterm = null,
} = {}) {
  const effectiveSort = normalizeSort(sort);

  if (!isDatabaseConfigured()) {
    // The Markdown source is only needed when searching the full body.
    const all = listLocalPosts({ includeMarkdown: Boolean(searchterm) }).map((post) => ({
      ...post,
      titleMatch: post.title.toLowerCase().replace(/-/g, " "),
    }));

    const filtered = all.filter((post) => {
      if (type && !(post.type || []).includes(type)) return false;
      if (searchterm) {
        const needle = searchterm.toLowerCase();
        return (
          post.titleMatch.includes(needle) ||
          (post.preview_text || "").toLowerCase().includes(needle) ||
          (post.markdown || "").toLowerCase().includes(needle)
        );
      }
      return true;
    });

    const sorters = {
      date_latest: (a, b) => new Date(b.date || 0) - new Date(a.date || 0),
      date_oldest: (a, b) => new Date(a.date || 0) - new Date(b.date || 0),
      most_words: (a, b) => (b.word_count || 0) - (a.word_count || 0),
      least_words: (a, b) => (a.word_count || 0) - (b.word_count || 0),
    };

    let ordered = [...filtered].sort(sorters[effectiveSort]);

    if (searchterm) {
      // Title matches first, same as the SQL `CASE WHEN ... ILIKE` ordering.
      const needle = searchterm.toLowerCase();
      ordered = [
        ...ordered.filter((p) => p.titleMatch.includes(needle)),
        ...ordered.filter((p) => !p.titleMatch.includes(needle)),
      ];
    }

    const totalItems = ordered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / count));
    const page = ordered.slice(start, start + count);

    const withBodies = searchterm
      ? page.map((post) => ({ ...post, body: getLocalPost(post.blogid)?.body ?? "" }))
      : page;

    return {
      posts: withBodies.map((row) => toPreviewRow(row, searchterm)),
      pagination: {
        totalPages,
        currentPage: Math.floor(start / count) + 1,
        pageSize: count,
        totalItems,
        type,
        sort: effectiveSort,
        searchterm,
      },
      types: getLocalTypesWithCounts(),
    };
  }

  const [rows, totalItems, types] = await Promise.all([
    pgListBlogPreviews({ start, count, type, sort: effectiveSort, searchterm }),
    pgCountBlogPreviews({ type, searchterm }),
    pgGetBlogTypesWithCounts(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalItems / count));

  return {
    posts: rows.map((row) => toPreviewRow(row, searchterm)),
    pagination: {
      totalPages,
      currentPage: Math.floor(start / count) + 1,
      pageSize: count,
      totalItems,
      type,
      sort: effectiveSort,
      searchterm,
    },
    types,
  };
}

/**
 * Full post (HTML body included) or null when the id is unknown.
 */
export async function getBlogByBlogid(blogid) {
  if (!blogid) return null;

  if (!isDatabaseConfigured()) {
    const post = getLocalPost(blogid);
    if (!post) return null;
    const { markdown, ...rest } = post;
    return rest;
  }

  return pgGetBlog(blogid);
}

export async function getBlogTypesWithCounts() {
  if (!isDatabaseConfigured()) return getLocalTypesWithCounts();
  return pgGetBlogTypesWithCounts();
}

/**
 * Everything the sitemap and RSS feed need, newest first.
 */
export async function listAllBlogMeta(limit = null) {
  if (!isDatabaseConfigured()) {
    const posts = listLocalPosts();
    return (limit ? posts.slice(0, limit) : posts).map((post) => ({
      blogid: post.blogid,
      title: post.title,
      date: post.date,
      type: post.type,
      word_count: post.word_count,
      preview_text: post.preview_text,
      updated_at: post.updated_at,
    }));
  }

  return pgListAllBlogMeta(limit);
}

/**
 * Neighbouring posts, used for the "read next" links at the bottom of a post.
 */
export async function getAdjacentPosts(blogid) {
  const meta = await listAllBlogMeta();
  const index = meta.findIndex((post) => post.blogid === blogid);
  if (index === -1) return { previous: null, next: null };
  return {
    // `meta` is newest-first, so "previous" is the newer neighbour.
    previous: index > 0 ? meta[index - 1] : null,
    next: index < meta.length - 1 ? meta[index + 1] : null,
  };
}
