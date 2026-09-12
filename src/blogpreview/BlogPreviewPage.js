import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Card, Row, Col } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import Pagination from "@/blogpreview/Pagination.js";
import { displayTitle, escapeRegExp } from "@/lib/display";

const LINK_STYLE = { color: "blue", textDecoration: "underline" };

function PreviewCard(props) {
  const { searchTerm, date, blogid, previewimage, title, text, wordcount, tags } = props;

  const highlightPattern = useMemo(() => {
    const term = searchTerm?.trim();
    if (!term) return null;
    // The raw term is user input; escaping keeps "[" or "(" from throwing.
    try {
      return new RegExp(`(${escapeRegExp(term)})`, "gi");
    } catch {
      return null;
    }
  }, [searchTerm]);

  const body = text || "";
  // `split` with a capturing group interleaves the matches at odd indices.
  const renderedText = highlightPattern
    ? body.split(highlightPattern).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i}>{part}</mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )
    : body;

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
              {previewimage && (
                <Col xs={12} md={4} className="order-md-2">
                  <Card.Img
                    src={previewimage}
                    alt={displayTitle(title)}
                    className="d-none d-md-block rounded-0"
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      maxWidth: "640px",
                      maxHeight: "320px",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Img
                    src={previewimage}
                    alt={displayTitle(title)}
                    className="d-block d-md-none rounded-0"
                    loading="lazy"
                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  />
                </Col>
              )}

              <Col md={previewimage ? 8 : 12} className="order-md-1" style={{ minWidth: 0 }}>
                <Card.Body className="d-flex flex-column h-100">
                  <Card.Title className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      {/* Already formatted server-side; evergreen posts read "Current". */}
                      <span style={{ fontSize: "0.8rem" }}>{date}</span>
                      <div
                        className="d-flex flex-wrap justify-content-end gap-2"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {wordcount} words
                      </div>
                    </div>
                    <Link
                      href={`/a/${blogid}`}
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        display: "inline-block",
                        ...LINK_STYLE,
                      }}
                    >
                      {displayTitle(title)}
                    </Link>
                  </Card.Title>

                  <Card.Text
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: "1.5",
                      fontStyle: "italic",
                      whiteSpace: "normal",
                      overflowWrap: "anywhere",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {renderedText}
                  </Card.Text>

                  {tagsList.length > 0 && (
                    <div className="mt-auto pt-3 d-flex flex-wrap gap-2">
                      {tagsList.map((tag) => (
                        <Link
                          key={tag}
                          href={`/?type=${encodeURIComponent(tag.toLowerCase())}`}
                          style={{ fontSize: "0.85rem", ...LINK_STYLE }}
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

function SearchForm({ initialTerm }) {
  const router = useRouter();
  const [term, setTerm] = useState(initialTerm || "");

  useEffect(() => {
    setTerm(initialTerm || "");
  }, [initialTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = term.trim();
    const query = { ...router.query };

    if (trimmed) {
      query.searchterm = trimmed;
      // A search is global, so drop the tag filter.
      delete query.type;
    } else {
      delete query.searchterm;
    }
    delete query.page;

    router.push({ pathname: router.pathname, query });
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="d-flex ms-auto"
      style={{ maxWidth: "250px", width: "100%" }}
    >
      <label htmlFor="post-search" className="visually-hidden">
        Search posts
      </label>
      <input
        id="post-search"
        type="search"
        placeholder="Search posts..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
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
  );
}

/**
 * Tags come from the data, so the footer never advertises a tag that has no
 * posts behind it. Split into two rows for the layout, longest-first.
 */
function TagFooter({ types }) {
  if (!types || types.length === 0) return null;

  const splitAt = Math.ceil(types.length / 2);
  const groups = [types.slice(0, splitAt), types.slice(splitAt)].filter(
    (group) => group.length > 0,
  );

  return (
    <div className="mt-5 pt-4 border-top">
      <h5
        className="mb-3 text-uppercase"
        style={{ fontSize: "0.9rem", color: "#666", letterSpacing: "1px" }}
      >
        Filter By Tags
      </h5>

      {groups.map((group, groupIdx) => (
        <div key={groupIdx} className="mb-2 d-flex flex-wrap gap-2">
          {group.map((tag) => (
            <Link
              key={tag.type}
              href={`/?type=${encodeURIComponent(tag.type.toLowerCase())}`}
              style={{ fontSize: "1rem", ...LINK_STYLE }}
            >
              #{tag.type}
              <span style={{ color: "#666", fontSize: "0.85rem" }}> ({tag.count})</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function BlogPreviewPage({
  currentType,
  data,
  pagination,
  postTypeArray,
  searchTerm,
  error,
}) {
  const router = useRouter();
  const isSearchPage = Boolean(searchTerm || router.query.searchterm);
  const displayTag = router.query.type || currentType || null;

  return (
    <Container style={{ maxWidth: "1000px" }} className="mb-5">
      <Row className="justify-content-center">
        <Col xs={12}>
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div className="mb-4 pb-2 border-bottom d-flex align-items-center flex-wrap gap-3 mt-4 mt-md-0">
              {displayTag && !isSearchPage && (
                <div style={{ fontWeight: "500" }}>
                  Tags:{" "}
                  <span style={LINK_STYLE}>#{displayTag}</span>
                </div>
              )}

              <SearchForm initialTerm={searchTerm} />
            </div>

            {error && (
              <div
                role="alert"
                style={{ margin: "2rem 0", padding: "1rem", border: "1px solid #ddd" }}
              >
                {error}
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
                {isSearchPage ? "No results found." : "No posts yet."}
              </div>
            )}

            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
              />
            )}

            {!isSearchPage && <TagFooter types={postTypeArray} />}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
