import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

import styles from "./Pagination.module.css";

function buildPageList(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_value, index) => index + 1);
  }

  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push("start-ellipsis");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < totalPages - 1) pages.push("end-ellipsis");

  pages.push(totalPages);
  return pages;
}

export default function Pagination({ currentPage = 1, totalPages = 1 }) {
  const router = useRouter();

  const pages = useMemo(() => buildPageList(currentPage, totalPages), [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const hrefFor = (page) => {
    const query = { ...router.query };
    if (page <= 1) {
      delete query.page;
    } else {
      query.page = String(page);
    }
    return { pathname: router.pathname, query };
  };

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      {currentPage > 1 && (
        <Link className={styles.link} href={hrefFor(currentPage - 1)} rel="prev">
          ← Previous
        </Link>
      )}

      {pages.map((page) =>
        typeof page === "number" ? (
          <Link
            key={page}
            className={page === currentPage ? `${styles.link} ${styles.active}` : styles.link}
            href={hrefFor(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        ) : (
          <span key={page} className={styles.ellipsis} aria-hidden="true">
            …
          </span>
        ),
      )}

      {currentPage < totalPages && (
        <Link className={styles.link} href={hrefFor(currentPage + 1)} rel="next">
          Next →
        </Link>
      )}
    </nav>
  );
}
