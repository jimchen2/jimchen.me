import React, { useState, useEffect } from "react";
import Pagination from "@/blogpreview/Pagination.js";
import { Container, Card, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";

/** Escapes user input so it can be embedded in a RegExp safely. */
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function PreviewCard(props) {
  const { searchTerm, date, blogid, previewimage, title, text, wordcount, tags } =
    props;

  const getHighlightedText = (source, highlight) => {
    if (!highlight || !source) return source;
    let parts;
    try {
      parts = source.split(new RegExp(`(${escapeRegExp(highlight)})`, "gi"));
    } catch {
      return source;
    }
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} style={{ backgroundColor: "yellow", color: "inherit" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const displayDate = date === "Dec 31, 9999" ? "Current" : date;

  let tagsList = [];
  if (Array.isArray(tags)) {
    tagsList = tags;
  } else if (typeof tags === "string") {
    tagsList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return (
    <Container fluid className="my-4" style={{ maxWidth: "100%", padding: 0 }}>
      <Row className="justify-content-center m-0">
        <Col className="p-0">
          <Card className="border-1 rounded-0">
            <Row className="g-0">
              {/* --- IMAGE COLUMN (single responsive image) --- */}
              {previewimage && (
                <Col xs={12} md={4} className="order-md-2">
                  <img
                    src={previewimage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="preview-card-img rounded-0"
                  />
                </Col>
              )}

              {/* --- TEXT COLUMN --- */}
              <Col
                md={previewimage ? 8 : 12}
                className="order-md-1"
                style={{ minWidth: 0 }}
              >
                <Card.Body className="d-flex flex-column h-100">
                  <Card.Title className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ fontSize: "0.8rem" }}>{displayDate}</span>
                      <div
                        className="d-flex flex-wrap justify-content-end gap-2"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {wordcount} words
                      </div>
                    </div>
                    {/* Natural link styling, no hover zoom */}
                    <Link
                      href={`/a/${blogid}`}
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        display: "inline-block",
                        color: "blue",
                        textDecoration: "underline",
                      }}
                    >
                      {title.split("-").join(" ")}
                    </Link>
                  </Card.Title>

                  <Card.Text
                    className="preview-text"
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: "1.5",
                      fontStyle: "italic",
                    }}
                  >
                    {getHighlightedText(text, searchTerm)}
                  </Card.Text>

                  {/* --- TAGS SECTION (mt-auto pins them to the card bottom) --- */}
                  {tagsList.length > 0 && (
                    <div className="mt-auto pt-3 d-flex flex-wrap gap-2">
                      {tagsList.map((tag) => (
                        <Link
                          key={tag}
                          href={`/?type=${encodeURIComponent(tag.toLowerCase())}`}
                          style={{
                            fontSize: "0.85rem",
                            color: "blue",
                            textDecoration: "underline",
                          }}
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

/** Groups the tag list into rows of three, like the original layout. */
function chunkTags(types, size = 3) {
  const groups = [];
  for (let i = 0; i < types.length; i += size) {
    groups.push(types.slice(i, i + size));
  }
  return groups;
}

const DEFAULT_TAG_GROUPS = [
  ["ml", "systems", "journal"],
  ["culture", "web", "math"],
];

function BlogPreviewPage({
  currentType,
  data,
  pagination,
  postTypeArray = [],
  searchTerm,
  error,
}) {
  const router = useRouter();

  const isSearchPage = Boolean(searchTerm || router.query.searchterm);
  const displayTag = router.query.type || currentType || null;

  // --- Search State ---
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");

  useEffect(() => {
    setLocalSearchTerm(searchTerm || "");
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedTerm = localSearchTerm.trim();
    const query = { ...router.query };

    if (trimmedTerm) {
      query.searchterm = trimmedTerm;
      // New searches are global: drop any active tag filter.
      delete query.type;
    } else {
      delete query.searchterm;
    }
    delete query.page; // reset to page 1 on search

    router.push({ pathname: router.pathname, query });
  };

  const tagGroups =
    postTypeArray && postTypeArray.length > 0
      ? chunkTags(postTypeArray)
      : DEFAULT_TAG_GROUPS.map((group) => group.map((type) => ({ type })));

  return (
    <Container style={{ maxWidth: "1000px" }} className="mb-5">
      <style jsx>{`
        .preview-card-img {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
        }
        @media (min-width: 768px) {
          .preview-card-img {
            height: 100%;
            max-height: 320px;
          }
        }
        .preview-text {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          overflow-wrap: break-word;
          white-space: normal;
        }
      `}</style>
      <Row className="justify-content-center">
        <Col xs={12}>
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div className="mb-4 pb-2 border-bottom d-flex align-items-center flex-wrap gap-3 mt-4 mt-md-0">
              {displayTag && !isSearchPage && (
                <div style={{ fontWeight: "500" }}>
                  Tags:{" "}
                  <span style={{ color: "blue", textDecoration: "underline" }}>
                    #{displayTag}
                  </span>
                </div>
              )}

              <form
                onSubmit={handleSearchSubmit}
                role="search"
                className="d-flex ms-auto"
                style={{ maxWidth: "250px", width: "100%" }}
              >
                <label htmlFor="blog-search" className="visually-hidden">
                  Search posts
                </label>
                <input
                  id="blog-search"
                  type="search"
                  placeholder="Search posts..."
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  style={{
                    fontSize: "15px",
                    padding: "6px 10px",
                    border: "1px solid #ddd",
                    borderRight: "none",
                    borderRadius: "4px 0 0 4px",
                    outline: "none",
                    width: "100%",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #ddd",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "0 4px 4px 0",
                    cursor: "pointer",
                  }}
                  aria-label="Submit search"
                >
                  <FaSearch size={12} color="#495057" />
                </button>
              </form>
            </div>

            {error && (
              <div
                className="alert alert-warning rounded-0"
                role="alert"
                style={{ border: "1px solid currentColor" }}
              >
                {error} Showing what could be loaded.
              </div>
            )}

            {data && data.length > 0 ? (
              data.map((post) => (
                <div key={post.blogid} style={{ marginBottom: "2rem" }}>
                  <PreviewCard
                    blogid={post.blogid}
                    title={post.title}
                    text={post.preview_text}
                    date={post.date}
                    tags={post.type}
                    wordcount={post.word_count}
                    previewimage={post.preview_image}
                    searchTerm={searchTerm}
                  />
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", margin: "5rem 0" }}>
                {isSearchPage
                  ? `No results for “${searchTerm}”.`
                  : "No posts here yet."}
              </div>
            )}

            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
              />
            )}

            {/* --- FILTER TAGS (hidden on search pages) --- */}
            {!isSearchPage && (
              <div className="mt-5 pt-4 border-top">
                <h5
                  className="mb-3 text-uppercase"
                  style={{ fontSize: "0.9rem", color: "#666", letterSpacing: "1px" }}
                >
                  Filter By Tags
                </h5>

                {tagGroups.map((group, groupIdx) => (
                  <div key={groupIdx} className="mb-2 d-flex flex-wrap gap-3">
                    {group.map((entry) => {
                      const tag = typeof entry === "string" ? entry : entry.type;
                      const count = typeof entry === "string" ? null : entry.count;
                      return (
                        <Link
                          key={tag}
                          href={`/?type=${encodeURIComponent(tag.toLowerCase())}`}
                          style={{
                            fontSize: "1rem",
                            color: "blue",
                            textDecoration: "underline",
                          }}
                        >
                          #{tag}
                          {count != null && (
                            <span
                              style={{
                                color: "#888",
                                textDecoration: "none",
                                fontSize: "0.8rem",
                                marginLeft: "0.25rem",
                              }}
                            >
                              {count}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default BlogPreviewPage;
