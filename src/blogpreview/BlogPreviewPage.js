import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Pagination from "./Pagination";
import styles from "./BlogPreviewPage.module.css";
import { formatTitle } from "@/lib/format";

const SORT_OPTIONS = [
  { value: "date_latest", label: "Newest first" },
  { value: "date_oldest", label: "Oldest first" },
  { value: "most_words", label: "Longest" },
  { value: "least_words", label: "Shortest" },
];

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Highlights the active search term inside a preview snippet. */
function HighlightedText({ text = "", term }) {
  if (!term) return text;

  const parts = String(text).split(new RegExp(`(${escapeRegExp(term)})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === String(term).toLowerCase() ? (
      // eslint-disable-next-line react/no-array-index-key -- parts come from a split, order is stable
      <mark key={index}>{part}</mark>
    ) : (
      part
    ),
  );
}

function PreviewCard({ post, searchTerm }) {
  const tags = Array.isArray(post.type)
    ? post.type
    : String(post.type || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

  return (
    <li className={styles.card}>
      {post.preview_image && (
        // eslint-disable-next-line @next/next/no-img-element -- preview images live on an external bucket
        <img
          className={styles.cardThumb}
          src={post.preview_image}
          alt=""
          loading="lazy"
          decoding="async"
          width={400}
          height={250}
        />
      )}

      <div className={styles.cardBody}>
        <p className={styles.cardMeta}>
          <span>{post.date}</span>
          {post.word_count ? <span>{post.word_count} words</span> : null}
        </p>

        <h2 className={styles.cardTitle}>
          <Link href={`/a/${post.blogid}`}>{formatTitle(post.title)}</Link>
        </h2>

        <p className={styles.cardText}>
          <HighlightedText text={post.preview_text} term={searchTerm} />
        </p>

        {tags.length > 0 && (
          <p className={styles.cardTags}>
            {tags.map((tag) => (
              <Link
                key={tag}
                className={styles.cardTag}
                href={`/?type=${encodeURIComponent(String(tag).toLowerCase())}`}
              >
                #{tag}
              </Link>
            ))}
          </p>
        )}
      </div>
    </li>
  );
}

export default function BlogPreviewPage({
  currentType,
  data = [],
  pagination = {},
  postTypeArray = [],
  currentSort,
  searchTerm,
  demo = false,
}) {
  const router = useRouter();

  const isSearchPage = Boolean(searchTerm);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");

  useEffect(() => {
    setLocalSearchTerm(searchTerm || "");
  }, [searchTerm]);

  const pushQuery = (changes) => {
    const query = { ...router.query, ...changes };
    Object.keys(query).forEach((key) => {
      if (query[key] === undefined || query[key] === null || query[key] === "") delete query[key];
    });
    delete query.page;
    router.push({ pathname: router.pathname, query });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const term = localSearchTerm.trim();
    // A new search always clears the tag filter so results are global.
    pushQuery({ searchterm: term || undefined, type: undefined });
  };

  return (
    <div className={styles.page}>
      <h1 className="visually-hidden">Jim Chen&apos;s Blog</h1>

      {demo && (
        <p className={styles.notice}>
          Showing example posts from <code>content/posts</code>. Add a <code>POSTGRESQL_URL</code>{" "}
          environment variable to load posts from the database instead.
        </p>
      )}

      <div className={styles.toolbar}>
        {currentType && !isSearchPage ? (
          <p className={styles.toolbarLabel}>
            Tag: <strong>#{currentType}</strong>{" "}
            <Link href="/" className={styles.filterLink}>
              (clear)
            </Link>
          </p>
        ) : (
          <p className={styles.toolbarLabel}>
            {pagination.totalItems ? `${pagination.totalItems} posts` : "Posts"}
          </p>
        )}

        <div className={styles.tools}>
          <label className="visually-hidden" htmlFor="post-search">
            Search posts
          </label>
          <form className={styles.search} onSubmit={handleSearchSubmit} role="search">
            <input
              id="post-search"
              className={styles.searchInput}
              type="search"
              placeholder="Search posts…"
              value={localSearchTerm}
              onChange={(event) => setLocalSearchTerm(event.target.value)}
            />
            <button className={styles.searchButton} type="submit" aria-label="Search">
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a6.5 6.5 0 0 1-.017.016ZM6.5 11a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" />
              </svg>
            </button>
          </form>

          <label className="visually-hidden" htmlFor="post-sort">
            Sort posts
          </label>
          <select
            id="post-sort"
            className={styles.sortSelect}
            value={currentSort || "date_latest"}
            onChange={(event) => pushQuery({ sort: event.target.value })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {data.length > 0 ? (
        <ul className={styles.list}>
          {data.map((post) => (
            <PreviewCard key={post.blogid} post={post} searchTerm={searchTerm} />
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No posts found.</p>
      )}

      <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />

      {!isSearchPage && postTypeArray.length > 0 && (
        <section className={styles.filters} aria-label="Filter by tag">
          <h2 className={styles.filtersTitle}>Filter by tag</h2>
          <div className={styles.filterRow}>
            {postTypeArray.map((entry) => (
              <Link
                key={entry.type}
                className={styles.filterLink}
                href={`/?type=${encodeURIComponent(entry.type)}`}
              >
                #{entry.type}
                {entry.count ? <span className={styles.filterCount}>{entry.count}</span> : null}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
