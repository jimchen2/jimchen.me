// Shared display helpers.
//
// This module must stay free of Node-only imports: it is imported by client
// components as well as by getServerSideProps, so anything that pulls in `fs`
// or `pg` would end up in the browser bundle.

/**
 * Titles stored in the database historically used hyphens in place of spaces.
 * Titles written with real spaces are left alone.
 */
export function displayTitle(title) {
  if (!title) return "";
  return title.includes(" ") ? title : title.split("-").join(" ");
}

/** Escapes user input for safe use inside a RegExp. */
export function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Posts dated year 9999 are evergreen and are displayed as "Current". */
export function isEvergreen(isoOrDate) {
  if (!isoOrDate) return false;
  const date = new Date(isoOrDate);
  return !Number.isNaN(date.getTime()) && date.getUTCFullYear() >= 9999;
}

function toDate(isoOrDate) {
  if (!isoOrDate) return null;
  const date = new Date(isoOrDate);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "Sep 09, 2026" — the format used in post listings. */
export function formatDate(isoOrDate) {
  if (isEvergreen(isoOrDate)) return "Current";
  const date = toDate(isoOrDate);
  if (!date) return "";
  // Pinned to UTC so the server and the browser cannot disagree on the day.
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "September 9, 2026" — the format used on a post page. */
export function formatLongDate(isoOrDate) {
  if (isEvergreen(isoOrDate)) return "Current";
  const date = toDate(isoOrDate);
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pulls the h2/h3 outline out of rendered post HTML so the table of contents
 * can be server-rendered instead of appearing only after hydration.
 * Returns `[{ id, text, children: [{ id, text }] }]`.
 */
export function extractHeadings(html) {
  const source = String(html || "");
  const pattern = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>/g;

  const items = [];
  let match;

  while ((match = pattern.exec(source)) !== null) {
    const [, level, id, inner] = match;
    const text = stripHtml(inner);
    if (!text) continue;

    if (level === "2") {
      items.push({ id, text, children: [] });
    } else if (items.length > 0) {
      items[items.length - 1].children.push({ id, text });
    }
  }

  return items;
}
