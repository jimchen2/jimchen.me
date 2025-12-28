import React, { useState } from "react";
import * as data from "../layout/static/aboutData";

const s = {
  page: {
    minHeight: "100vh",
    padding: "2rem 1rem 3rem",
    background: "#f7f8fc",
    fontFamily: "'Poppins', 'Space Grotesk', sans-serif",
  },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "1rem" },
  card: {
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    marginBottom: "2rem",
  },
  bar: { background: "linear-gradient(135deg, #93c5fd 0%, #6ee7b7 100%)", height: "6px" },
  gradient: {
    background: "linear-gradient(135deg, #60a5fa 0%, #34d399 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "inline-block",
  },
  header: { display: "flex", alignItems: "center", marginBottom: "1rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
};

const Card = ({ children }) => (
  <div style={s.card}>
    <div style={s.bar} />
    <div style={{ padding: "2rem" }}>{children}</div>
  </div>
);

const Header = ({ emoji, title }) => (
  <div style={s.header}>
    <span style={{ fontSize: "1.8rem", marginRight: "0.8rem" }}>{emoji}</span>
    <h3 style={{ ...s.gradient, fontSize: "1.25rem", fontWeight: "700", margin: 0 }}>{title}</h3>
  </div>
);

const Link = ({ item }) => {
  const [h, setH] = useState(false);

  // Check if item has multiple links (for combined culture blogs)
  if (item.links) {
    return (
      <li style={{ marginBottom: "1rem" }}>
        {item.links.map((link, idx) => (
          <div key={idx} style={{ marginBottom: idx < item.links.length - 1 ? "0.5rem" : "0" }}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#60a5fa",
                textDecoration: "none",
                display: "inline-block",
                paddingLeft: "1.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                transition: "all 0.3s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#34d399";
                e.currentTarget.style.paddingLeft = "2rem";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#60a5fa";
                e.currentTarget.style.paddingLeft = "1.5rem";
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "0",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.2rem",
                }}
              >
                →
              </span>
              {link.name}
            </a>
          </div>
        ))}
        {item.description && (
          <p style={{ margin: "0.5rem 0 0 1.5rem", fontSize: "0.9rem", color: "#475569", fontWeight: "500" }}>
            {item.description}
          </p>
        )}
      </li>
    );
  }

  // Original single link behavior
  return (
    <li style={{ marginBottom: "1rem" }}>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: h ? "#34d399" : "#60a5fa",
          textDecoration: "none",
          display: "inline-flex",
          paddingLeft: h ? "2rem" : "1.5rem",
          fontSize: "1rem",
          fontWeight: "600",
          transition: "all 0.3s",
          position: "relative",
        }}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
      >
        <span
          style={{ position: "absolute", left: "0", top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem" }}
        >
          →
        </span>
        {item.name}
      </a>
      {item.description && (
        <p style={{ margin: "0.25rem 0 0 1.5rem", fontSize: "0.9rem", color: "#475569", fontWeight: "500" }}>
          {item.description}
        </p>
      )}
    </li>
  );
};

const Photo = ({ photo }) => {
  const [h, setH] = useState(false);
  return (
    <a
      href={photo.src}
      target="_blank"
      rel="noopener noreferrer"
      title={photo.alt}
      style={{
        position: "relative",
        display: "block",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: h ? "0 12px 30px rgba(96, 165, 250, 0.3)" : "0 4px 15px rgba(0, 0, 0, 0.1)",
        transform: h ? "translateY(-8px) scale(1.02)" : "translateY(0)",
        transition: "all 0.3s",
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <img
        src={photo.thumb || photo.src} // Use thumb if available, fallback to src
        alt={photo.alt}
        loading="lazy"
        style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(147, 197, 253, 0.3), rgba(110, 231, 183, 0.3))",
          opacity: h ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
    </a>
  );
};

export default function AboutPage() {
  return (
    <div style={s.page}>
      <div style={s.container}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                ...s.gradient,
                fontSize: "2.5rem",
                fontWeight: "700",
                letterSpacing: "-0.5px",
                marginBottom: "1.5rem",
              }}
            >
              {data.introHeading}
            </h1>
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "1.05rem",
              color: "#334155",
              fontWeight: "500",
            }}
          >
            {data.introductionPoints.map((p, i) => (
              <li key={i} style={{ marginBottom: "0.5rem" }}>
                {p}
              </li>
            ))}
          </ul>
          <hr style={{ margin: "1.5rem 0", border: "none", borderTop: "1px solid #e2e8f0" }} />


          {/* OTHER FACTS SECTION - NOW COLLAPSIBLE */}
          <details>
            <summary
              style={{
                fontWeight: "700",
                marginBottom: "1rem",
                color: "#334155",
                cursor: "pointer",
                fontSize: "1.17em",
              }}
            >
              Other Facts:
            </summary>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: "1.05rem",
                color: "#334155",
                fontWeight: "500",
              }}
            >
              {data.otherFacts.map((f, i) => (
                <li key={i} style={{ marginBottom: "0.5rem" }}>
                  {f}
                </li>
              ))}
            </ul>
          </details>
        </Card>

        <Card>
          <Header emoji="📸" title={data.photosHeading} />
          <p style={{ marginBottom: "1.5rem", color: "#475569", fontSize: "1.05rem", fontWeight: "500" }}>
            {data.photosDescription}
          </p>
          <div style={s.grid}>
            {data.personalPhotos.map((p, i) => (
              <Photo key={i} photo={p} />
            ))}
          </div>
        </Card>

        <div style={s.twoCol}>
          <Card>
            <Header emoji="⚙️" title={data.techSetupHeading} />
            <p style={{ marginBottom: "1.5rem", color: "#475569", fontSize: "0.98rem", fontWeight: "500" }}>
              {data.techSetupDescription}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {data.techSetup.map((item, i) => (
                <Link key={i} item={item} />
              ))}
            </ul>
          </Card>
          <Card>
            <Header emoji="🌍" title={data.culturesHeading} />
            <p style={{ marginBottom: "1.5rem", color: "#475569", fontSize: "0.98rem", fontWeight: "500" }}>
              {data.culturesDescription}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {data.globalInternet.map((item, i) => (
                <Link key={i} item={item} />
              ))}
            </ul>
          </Card>
        </div>

        <Card>
          <Header emoji="🔗" title={data.connectHeading} />
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "1.05rem",
              color: "#475569",
              lineHeight: "1.6",
              fontWeight: "500",
            }}
          >
            {data.connectIntroPoints.map((p, i) => (
              <li key={i} style={{ marginBottom: "1rem" }}>
                {p}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}