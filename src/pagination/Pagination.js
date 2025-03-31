import React from "react";
import Link from "next/link";
import { Pagination as BSPagination } from "react-bootstrap";
import { useGlobalColorScheme } from "../config/global.js";

const Pagination = ({ currentPage, totalPages, basePath = "/page" }) => {
  const { colors } = useGlobalColorScheme();

  const pageNumbers = [];
  pageNumbers.push(1);

  // Calculate range of pages to show
  let startPage = Math.max(2, currentPage - 2);
  let endPage = Math.min(totalPages - 1, currentPage + 2);

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

  // Custom styles using the colors
  const paginationStyles = {
    "--bs-pagination-color": colors.color_black,
    "--bs-pagination-bg": colors.color_white,
    "--bs-pagination-active-bg": colors.color_black,
    "--bs-pagination-active-color": colors.color_white,
    "--bs-pagination-hover-color": colors.color_black,
    "--bs-pagination-hover-bg": colors.color_gray,
    "--bs-pagination-disabled-bg": colors.color_white,
  };

  return (
    <BSPagination className="justify-content-center my-4" style={paginationStyles}>
      {currentPage > 1 && (
        <Link href={`${basePath}/${currentPage - 1}`} passHref legacyBehavior>
          <BSPagination.Prev as="a">&lt; Prev</BSPagination.Prev>
        </Link>
      )}

      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return <BSPagination.Ellipsis key={`ellipsis-${index}`} disabled />;
        }

        return (
          <Link key={page} href={`${basePath}/${page}`} passHref legacyBehavior>
            <BSPagination.Item as="a" active={page === currentPage}>
              {page}
            </BSPagination.Item>
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link href={`${basePath}/${currentPage + 1}`} passHref legacyBehavior>
          <BSPagination.Next as="a">Next &gt;</BSPagination.Next>
        </Link>
      )}
    </BSPagination>
  );
};

export default Pagination;
