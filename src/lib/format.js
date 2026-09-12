/** Small shared formatting helpers (no heavy imports — used on the client too). */

/** URL/id friendly slug. */
export function slugify(text, fallback = "section") {
  const slug = String(text)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

/** Plain text from an HTML snippet (used for previews, descriptions, word counts). */
export function stripHtml(html = "") {
  return String(html)
    .replace(/<pre[\s\S]*?<\/pre>/gi, " ")
    .replace(/<[^>]+>/g, " ")
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
 * Titles are stored slug-style ("a-slow-sunday") in some setups. Only rewrite the
 * dashes when the title has no spaces at all, so real punctuation survives.
 */
export function formatTitle(title = "") {
  const value = String(title).trim();
  if (!value) return "";
  return value.includes(" ") ? value : value.replace(/-/g, " ");
}

/** The database uses 9999-12-31 as a sentinel for "currently working on this". */
export function formatPostDate(value, style = "short") {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  if (date.getFullYear() >= 9999) return "Current";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: style === "long" ? "long" : "short",
    day: "2-digit",
    timeZone: "UTC",
  });
}

export function countWords(text = "") {
  return stripHtml(text).split(/\s+/).filter(Boolean).length;
}

export function truncate(text = "", length = 200) {
  const value = String(text).trim();
  if (value.length <= length) return value;
  const cut = value.slice(0, length);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : length).trim()}…`;
}

export function normalizeTag(tag = "") {
  return String(tag).trim().toLowerCase().replace(/\s+/g, "-");
}
