import React from "react";
import * as data from "../layout/static/aboutData";

const s = {
  page: {
    minHeight: "100vh",
    padding: "2rem 1rem 3rem",
    background: "#f7f8fc",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "1rem" },
  card: {
    background: "white",
    borderRadius: "0",
    border: "1px solid #e2e8f0",
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
    <span style={{ fontSize: "2rem", marginRight: "0.8rem" }}>{emoji}</span>
    <h3 style={{ ...s.gradient, fontSize: "1.4rem", fontWeight: "700", margin: 0 }}>{title}</h3>
  </div>
);

const Link = ({ item }) => {
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
                display: "inline-block",
                fontSize: "1.15rem",
                fontWeight: "600",
              }}
            >
              {link.name}
            </a>
          </div>
        ))}
        {item.description && (
          <p style={{ margin: "0.5rem 0 0 0", fontSize: "1.1rem", color: "#475569", fontWeight: "600" }}>
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
          display: "inline-flex",
          fontSize: "1.15rem",
          fontWeight: "600",
        }}
      >
        {item.name}
      </a>
      {item.description && (
        <p style={{ margin: "0.25rem 0 0 0", fontSize: "1.05rem", color: "#475569", fontWeight: "600" }}>
          {item.description}
        </p>
      )}
    </li>
  );
};

const Photo = ({ photo }) => {
  return (
    <a
      href={photo.src}
      target="_blank"
      rel="noopener noreferrer"
      title={photo.alt}
      style={{
        display: "block",
        borderRadius: "0",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}
    >
      <img
        src={photo.thumb || photo.src}
        alt={photo.alt}
        loading="lazy"
        style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
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
                fontSize: "2.8rem",
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
              fontSize: "1.2rem",
              color: "#334155",
              fontWeight: "600",
            }}
          >
            {data.introductionPoints.map((p, i) => (
              <li key={i} style={{ marginBottom: "0.5rem" }}>
                {p}
              </li>
            ))}
          </ul>
          <hr style={{ margin: "1.5rem 0", border: "none", borderTop: "1px solid #e2e8f0" }} />
        </Card>

        <Card>
          <Header emoji="📸" title={data.photosHeading} />
          <p style={{ marginBottom: "1.5rem", color: "#475569", fontSize: "1.2rem", fontWeight: "600" }}>
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
            <p style={{ marginBottom: "1.5rem", color: "#475569", fontSize: "1.1rem", fontWeight: "600" }}>
              {data.techSetupDescription}
            </p>
            <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", margin: 0 }}>
              {data.techSetup.map((item, i) => (
                <Link key={i} item={item} />
              ))}
            </ul>
          </Card>
          <Card>
            <Header emoji="🌍" title={data.culturesHeading} />
            <p style={{ marginBottom: "1.5rem", color: "#475569", fontSize: "1.1rem", fontWeight: "600" }}>
              {data.culturesDescription}
            </p>
            <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", margin: 0 }}>
              {data.globalInternet.map((item, i) => (
                <Link key={i} item={item} />
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
