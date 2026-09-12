/**
 * blogStore — one data interface, two backends.
 *
 *  1. Postgres (Neon) when POSTGRESQL_URL is configured and reachable. This is
 *     the production source of truth and behaves exactly as before.
 *  2. Local markdown files in `content/posts/` when there is no database (or
 *     when it is down), so the site always renders instead of white-screening.
 *
 * Every read goes through `withFallback`, which retries Postgres at most once
 * per minute after a failure.
 */
import dbConnect from "./dbConnect";
import * as pg from "./pgBlogQueries";
import * as local from "./content/localPosts";

const RETRY_COOLDOWN_MS = 60_000;
let localUntil = 0; // timestamp until which we skip Postgres attempts

function pgConfigured() {
  return Boolean(process.env.POSTGRESQL_URL);
}

export function usingLocalContent() {
  return !pgConfigured() || Date.now() < localUntil;
}

async function withFallback(pgFn, localFn) {
  if (pgConfigured() && Date.now() >= localUntil) {
    try {
      return await pgFn();
    } catch (err) {
      localUntil = Date.now() + RETRY_COOLDOWN_MS;
      console.error(
        "[blogStore] Postgres unavailable, serving local content for 60s:",
        err.message
      );
    }
  }
  return localFn();
}

/** Quick liveness probe for features that need writes (likes/views/comments). */
export async function isDbAvailable() {
  if (!pgConfigured()) return false;
  if (Date.now() < localUntil) return false;
  try {
    await dbConnect();
    return true;
  } catch {
    localUntil = Date.now() + RETRY_COOLDOWN_MS;
    return false;
  }
}

export async function listBlogs({
  start = 0,
  count = 10,
  type = null,
  sort = "date_latest",
  searchterm = null,
} = {}) {
  return withFallback(
    async () => {
      const [rows, pagination, types] = await Promise.all([
        pg.fetchBlogPreviews(start, count, type, sort, searchterm),
        pg.calculatePaginationInfo(count, type, searchterm),
        pg.getBlogTypesWithCounts(),
      ]);
      return { rows, pagination, types };
    },
    () => {
      const rows = local.queryLocalPosts({ start, count, type, sort, searchterm });
      const { totalBlogs } = local.countLocalPosts({ type, searchterm });
      return {
        rows,
        pagination: { totalBlogs, totalPages: Math.ceil(totalBlogs / count) },
        types: local.localTypesWithCounts(),
      };
    }
  );
}

export async function getBlog(blogid) {
  return withFallback(
    () => pg.getBlogByBlogid(blogid),
    () => local.getLocalPost(blogid)
  );
}

export async function sitemapBlogs() {
  return withFallback(
    () => pg.getSitemapBlogs(),
    () => local.localSitemapBlogs()
  );
}

export async function recentBlogs(limit = 15) {
  return withFallback(
    () => pg.getRecentBlogs(limit),
    () => local.localRecentBlogs(limit)
  );
}
