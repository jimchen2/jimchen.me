import React from "react";
import Link from "next/link";
import SearchComponent from "./SearchComponent";
// Remove this import
// import PortfolioComponent from "./PortfolioComponent";

const OtherComponent = () => {
  return (
    <div>
      <SearchComponent />

      <div
        style={{
          padding: "1rem",
          border: "1px solid #eee",
          borderRadius: "8px",
          margin: "0 1rem 1rem 1rem",
          textAlign: "center",
        }}
      >
        <Link href="/tags" legacyBehavior>
          <a style={{ textDecoration: "none", fontWeight: "bold", color: "#0070f3" }}>View All Tags</a>
        </Link>
      </div>

      {/* Link to comments */}
      <div
        style={{
          padding: "1rem",
          border: "1px solid #eee",
          borderRadius: "8px",
          margin: "0 1rem 1rem 1rem",
          textAlign: "center",
        }}
      >
        <Link href="/comments" legacyBehavior>
          <a style={{ textDecoration: "none", fontWeight: "bold", color: "#0070f3" }}>View Comments</a>
        </Link>
      </div>

      {/* New link to About Me page */}
      <div
        style={{
          padding: "1rem",
          border: "1px solid #eee",
          borderRadius: "8px",
          margin: "0 1rem 1rem 1rem",
          textAlign: "center",
        }}
      >
        <Link href="/about" legacyBehavior>
          <a style={{ textDecoration: "none", fontWeight: "bold", color: "#0070f3" }}>About Me</a>
        </Link>
      </div>

    </div>
  );
};

export default OtherComponent;
