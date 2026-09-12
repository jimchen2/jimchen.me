import dbConnect from "./dbConnect";
import { formatPostDate, stripHtml, truncate } from "./format";
import {
  contentDirectory,
  getPostBySlug,
  getTypesWithCounts,
  getAllPosts,
  queryPosts,
} from "./contentSource";

/**
 * Single entry point for post data.
 *
 * - `POSTGRESQL_URL` set  -> Postgres (the production setup, unchanged SQL)
 * - otherwise (or if the database is unreachable) -> markdown files in
 *   `content/posts`, so the site always renders something.
 */

export const VALID_SORTS = ["date_latest", "date_oldest", "most_words", "least_words"];

const PREVIEW_COLUMNS =
  "id, blogid, title, date, type, word_count, created_at, updated_at, preview_image, preview_text";

let demoModeWarningShown = false;

function hasDatabase() {
  return Boolean(process.env.POSTGRESQL_URL);
}

export function isDemoMode() {
  return !hasDatabase() || demoModeActive;
}

let demoModeActive = !hasDatabase();

function noteDatabaseFailure(error) {
  demoModeActive = true;
  if (!demoModeWarningShown) {
    demoModeWarningShown = true;
    console.warn(
      `[blogData] Database unavailable (${error.message}). Falling back to markdown content in ${contentDirectory()}.`,
    );
  }
}

/** Strips markup out of a stored post body so search snippets read as prose. */
function getRelevantSnippet(body, searchterm, isTitleMatch) {
  const plain = stripHtml(body || "");
  if (!plain) return "";
  if (isTitleMatch) return truncate(plain, 220);

  const index = plain.toLowerCase().indexOf(String(searchterm).toLowerCase());
  if (index === -1) return truncate(plain, 220);

  const start = Math.max(index - 90, 0);
  const end = Math.min(start + 220, plain.length);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < plain.length ? "…" : "";
  return `${prefix}${plain.slice(start, end).trim()}${suffix}`;
}

async function getPool() {
  return dbConnect();
}

/** Tag counts are the same for every request — keep them for a minute. */
let typeCountsCache = { at: 0, value: null };
const TYPE_COUNTS_TTL_MS = 60_000;

export async function listTypesWithCounts() {
  if (isDemoMode()) return getTypesWithCounts();

  const now = Date.now();
  if (typeCountsCache.value && now - typeCountsCache.at < TYPE_COUNTS_TTL_MS) {
    return typeCountsCache.value;
  }

  try {
    const pool = await getPool();
    const { rows } = await pool.query(`
      SELECT single_type AS type, COUNT(*) AS count
      FROM blogs, UNNEST(type) AS single_type
      WHERE type IS NOT NULL AND cardinality(type) > 0
      GROUP BY single_type
      ORDER BY count DESC, single_type ASC
    `);
    const value = rows.map((row) => ({ type: row.type, count: Number(row.count) }));
    typeCountsCache = { at: now, value };
    return value;
  } catch (error) {
    noteDatabaseFailure(error);
    return getTypesWithCounts();
  }
}

/**
 * Preview rows for the homepage: filtering, search and pagination.
 * Returns `{ rows, total, types }`.
 */
export async function listPostPreviews({ start = 0, count = 10, type = null, sort = "date_latest", searchterm = null } = {}) {
  const safeCount = Math.min(Math.max(Number(count) || 10, 1), 50);
  const safeStart = Math.max(Number(start) || 0, 0);
  const safeSort = VALID_SORTS.includes(sort) ? sort : "date_latest";
  const term = searchterm ? String(searchterm).slice(0, 120) : null;

  if (isDemoMode()) {
    const { rows, total } = queryPosts({
      start: safeStart,
      count: safeCount,
      type,
      sort: safeSort,
      searchterm: term,
    });
    const normalized = rows.map((post) => {
      const { body, text, ...rest } = post;
      return {
        ...rest,
        date: formatPostDate(post.date, "short"),
        preview_text: term
          ? getRelevantSnippet(body, term, post.title.replace(/-/g, " ").toLowerCase().includes(term.toLowerCase()))
          : post.preview_text,
      };
    });
    return { rows: normalized, total, types: getTypesWithCounts() };
  }

  try {
    const pool = await getPool();
    const params = [];
    const conditions = [];

    if (type) {
      params.push(type);
      conditions.push(`$${params.length} = ANY(type)`);
    }

    if (term) {
      params.push(`%${term}%`);
      conditions.push(`(REPLACE(title, '-', ' ') ILIKE $${params.length} OR body ILIKE $${params.length})`);
    }

    const where = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";

    const orderBy = term
      ? `ORDER BY CASE WHEN REPLACE(title, '-', ' ') ILIKE $${params.length} THEN 0 ELSE 1 END, date DESC`
      : `ORDER BY ${{ date_oldest: "date ASC", most_words: "word_count DESC", least_words: "word_count ASC" }[safeSort] || "date DESC"}`;

    const columns = term ? `${PREVIEW_COLUMNS}, body` : PREVIEW_COLUMNS;

    const listParams = [...params, safeCount, safeStart];
    const [listResult, countResult] = await Promise.all([
      pool.query(
        `SELECT ${columns} FROM blogs${where} ${orderBy} LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
        listParams,
      ),
      pool.query(`SELECT COUNT(*) FROM blogs${where}`, params),
    ]);

    const rows = listResult.rows.map((row) => {
      const isTitleMatch = term
        ? String(row.title).toLowerCase().replace(/-/g, " ").includes(term.toLowerCase())
        : false;
      const preview_text = term ? getRelevantSnippet(row.body, term, isTitleMatch) : row.preview_text;
      const { body, ...rest } = row;
      return { ...rest, date: formatPostDate(row.date, "short"), preview_text };
    });

    return {
      rows,
      total: Number(countResult.rows[0]?.count || 0),
      types: await listTypesWithCounts(),
    };
  } catch (error) {
    noteDatabaseFailure(error);
    return listPostPreviews({ start: safeStart, count: safeCount, type, sort: safeSort, searchterm: term });
  }
}

/** A single post, with the full body. Returns `null` when it does not exist. */
export async function getPost(blogid) {
  if (isDemoMode()) {
    return getPostBySlug(blogid);
  }

  try {
    const pool = await getPool();
    const { rows } = await pool.query(
      "SELECT blogid, type, title, body, date, word_count, preview_image FROM blogs WHERE blogid = $1",
      [blogid],
    );
    return rows[0] || null;
  } catch (error) {
    noteDatabaseFailure(error);
    return getPostBySlug(blogid);
  }
}

/** Lightweight list used by the sitemap and the RSS feed. */
export async function listAllPosts({ limit = null } = {}) {
  if (isDemoMode()) {
    const posts = getAllPosts().map(({ blogid, title, date, preview_text, type, word_count }) => ({
      blogid,
      title,
      date,
      preview_text,
      type,
      word_count,
    }));
    return limit ? posts.slice(0, limit) : posts;
  }

  try {
    const pool = await getPool();
    const { rows } = await pool.query(
      `SELECT blogid, title, date, preview_text, type, word_count FROM blogs ORDER BY date DESC${limit ? ` LIMIT ${Number(limit)}` : ""}`,
    );
    return rows;
  } catch (error) {
    noteDatabaseFailure(error);
    return listAllPosts({ limit });
  }
}

/** Resolves the public site URL from env or the incoming request. */
export function resolveSiteUrl(req) {
  const configured = process.env.NEXT_PUBLIC_SITE;
  if (configured && !/localhost|127\.0\.0\.1/.test(configured)) return configured.replace(/\/$/, "");

  const protocol = req?.headers?.["x-forwarded-proto"]?.split(",")[0]?.trim() || "https";
  const host = req?.headers?.["x-forwarded-host"] || req?.headers?.host;
  if (host) return `${protocol}://${host}`;

  return (configured || "http://localhost:3000").replace(/\/$/, "");
}
