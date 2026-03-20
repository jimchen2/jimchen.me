import React, { useState, useEffect } from "react";
import Pagination from "@/blogpreview/Pagination.js";
import { Container, Card, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa"; // Imported search icon

function PreviewCard(props) {
  const { searchTerm, date, blogid, previewimage, title, text, wordcount, tags } = props;

  const getHighlightedText = (text, highlight) => {
    if (!highlight || !text) {
      return text;
    }
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? <span key={i} style={{ backgroundColor: "yellow" }}>{part}</span> : part
    );
  };

  const displayDate = date === "Dec 31, 9999" ? "Current" : date;

  let tagsList = [];
  if (Array.isArray(tags)) {
    tagsList = tags;
  } else if (typeof tags === "string") {
    tagsList = tags.split(",").map(t => t.trim()).filter(Boolean);
  }

  return (
    <Container fluid className="my-4" style={{ maxWidth: "100%" }}>
      <Row className="justify-content-center">
        <Col>
          {/* rounded-0 gives it sharp edges */}
          <Card className="border-1 rounded-0">
            <Row className="g-0">
              {/* --- IMAGE COLUMN --- */}
              {previewimage && (
                <Col xs={12} md={4} className="order-md-2">
                  <Card.Img
                    src={previewimage}
                    alt={title}
                    className="d-none d-md-block rounded-0"
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
                    alt={title}
                    className="d-block d-md-none rounded-0"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Col>
              )}

              {/* --- TEXT COLUMN --- */}
              <Col md={previewimage ? 8 : 12} className="order-md-1" style={{ minWidth: 0 }}>
                <Card.Body>
                  <Card.Title className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ fontSize: "0.8rem" }}>
                        {displayDate}
                      </span>
                      <div className="d-flex flex-wrap justify-content-end gap-2" style={{ fontSize: "0.8rem" }}>
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
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: "1.5",
                      fontStyle: "italic",
                      whiteSpace: "normal",
                      overflowWrap: "anywhere", 
                      wordBreak: "break-all",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {getHighlightedText(text, searchTerm)}
                  </Card.Text>

                  {/* --- TAGS SECTION --- */}
                  {tagsList && tagsList.length > 0 && (
                    <div className="mt-3 d-flex flex-wrap gap-2">
                      {tagsList.map((tag, idx) => (
                        <Link
                          key={idx}
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

function BlogPreviewPage({ currentType, data, pagination, searchTerm }) {
  const router = useRouter();
  const displayTag = router.query.type || currentType;

  // --- Search State ---
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");

  // Sync state with URL if it changes externally
  useEffect(() => {
    setLocalSearchTerm(searchTerm || "");
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedTerm = localSearchTerm.trim();
    const query = { ...router.query };

    if (trimmedTerm) {
      query.searchterm = trimmedTerm;
    } else {
      delete query.searchterm;
    }
    
    // Reset to page 1 on search
    delete query.page;

    router.push({
      pathname: router.pathname,
      query: query,
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      
      {/* --- HEADER ROW: TAGS ON LEFT, SEARCH ALIGNED TO THE RIGHT --- */}
      <div className="mb-4 pb-2 border-bottom d-flex align-items-center flex-wrap gap-3">
        {displayTag && (
          <div 
            style={{ 
              fontSize: "1.2rem", 
              fontWeight: "500",
              color: "#495057",
            }}
          >
            Tags: <span style={{ color: "blue", textDecoration: "underline" }}>#{displayTag}</span>
          </div>
        )}

        <form 
          onSubmit={handleSearchSubmit} 
          className="d-flex ms-auto" 
          style={{ maxWidth: "250px", width: "100%" }}
        >
          <input
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

      {data && data.length > 0 ? (
        data.map((post, index) => (
          <div key={index} style={{ marginBottom: "2rem" }}>
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
        <div style={{ textAlign: "center", margin: "5rem 0" }}>No results found.</div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </div>
  );
}

function BlogPage({ data, pagination, type, postTypeArray, sort, searchterm }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <BlogPreviewPage 
      currentType={type} 
      data={data} 
      pagination={pagination} 
      postTypeArray={postTypeArray} 
      currentSort={sort} 
      searchTerm={searchterm} 
    />
  );
}

export default BlogPage;