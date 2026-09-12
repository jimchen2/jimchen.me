/**
 * Shared formatting helpers for blog rows, used by both the Postgres-backed
 * and the local-markdown-backed code paths.
 */

/**
 * Creates a relevant text snippet from a (plain or html) body based on a search term.
 */
export function getRelevantSnippet(body, searchterm, isTitleMatch) {
  if (!body) return "";
  if (isTitleMatch) {
    return body.length > 150 ? `${body.substring(0, 150)}...` : body;
  }
  const index = body.toLowerCase().indexOf(String(searchterm).toLowerCase());
  if (index === -1) {
    return body.length > 150 ? `${body.substring(0, 150)}...` : body;
  }
  const start = Math.max(index - 75, 0);
  const end = Math.min(start + 150, body.length);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < body.length ? "..." : "";
  return prefix + body.substring(start, end) + suffix;
}

/**
 * Formats a raw blog row for the frontend, creating a snippet if searching.
 * Accepts Date objects or ISO strings for `date`.
 */
export function processAndSnippetBlog(blog, searchterm = null) {
  const dateObj = new Date(blog.date);
  const formattedDate = Number.isNaN(dateObj.getTime())
    ? "Jan 01, 1970"
    : dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

  const processedBlog = { ...blog, date: formattedDate };

  if (searchterm) {
    const source = processedBlog.snippet_source || processedBlog.body || "";
    const isTitleMatch = String(processedBlog.title || "")
      .toLowerCase()
      .replace(/-/g, " ")
      .includes(String(searchterm).toLowerCase());

    processedBlog.preview_text = getRelevantSnippet(
      source,
      searchterm,
      isTitleMatch
    );
  }

  // Previews never need the full body: keep payloads small.
  delete processedBlog.body;
  delete processedBlog.snippet_source;
  delete processedBlog.plain_text;
  return processedBlog;
}

/** Strips HTML tags/entities for descriptions and RSS summaries. */
export function stripHtml(html = "") {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
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
