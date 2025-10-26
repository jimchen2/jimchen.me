
import React from "react";
import Link from "next/link";
import { Pagination as BSPagination } from "react-bootstrap";
import { useRouter } from "next/router";

const Pagination = ({ currentPage, totalPages, basePath = "" }) => {
  const router = useRouter();

  // Extract query parameters from current URL
  const { query } = router;
  const currentQuery = { ...query };

  // Function to generate URL with preserved query params
  const getPageUrl = (pageNum) => {
    const newQuery = { ...currentQuery, page: pageNum };
    
    if (pageNum === 1) {
      delete newQuery.page;
    }

    // Convert query object to string
    const queryString = Object.entries(newQuery)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    return `${basePath}${queryString ? `?${queryString}` : ""}`;
  };

  const pageNumbers = [];
  pageNumbers.push(1);

  // Calculate range of pages to show
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  // Add ellipsis after first page if needed
  if (startPage > 2) {
    pageNumbers.push("...");
  }

  // Add pages in the middle
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Add ellipsis before last page if needed
  if (endPage < totalPages - 1 && totalPages > 1) {
    pageNumbers.push("...");
  }

  // Always show last page if it exists
  if (totalPages > 1) {
    pageNumbers.push(totalPages);
  }

  return (
    <BSPagination className="justify-content-center my-4">
      {currentPage > 1 && (
        <Link href={getPageUrl(currentPage - 1)} passHref legacyBehavior>
          <BSPagination.Prev as="a">&lt;</BSPagination.Prev>
        </Link>
      )}

      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return <BSPagination.Ellipsis key={`ellipsis-${index}`} disabled />;
        }

        return (
          <Link key={page} href={getPageUrl(page)} passHref legacyBehavior>
            <BSPagination.Item as="a" active={page === currentPage}>
              {page}
            </BSPagination.Item>
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link href={getPageUrl(currentPage + 1)} passHref legacyBehavior>
          <BSPagination.Next as="a">&gt;</BSPagination.Next>
        </Link>
      )}
    </BSPagination>
  );
};

export default Pagination;