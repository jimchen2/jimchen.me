import React from "react";

const links = {
  blog: "https://jimchen.me/",
  github: "https://github.com/jimchen2",
  linkedin: "https://www.linkedin.com/in/jim-chen-588002255/",
  telegram: "https://t.me/Jimchen4214",
  instagram: "https://www.instagram.com/jimchen_1",
  wechat: "https://jimchen.me/weixin.jpg",
  youtube: "https://www.youtube.com/@jimchen4214",
  tiktok: "https://www.tiktok.com/@jimchen.me",
};

const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
);

export default function App() {
  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .portfolio-img {
            flex: 1 1 100% !important;
            width: 100%;
            height: auto !important;
          }
        }
      `}</style>

      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "2rem 1rem",
          fontFamily: "sans-serif",
          minHeight: "100vh",
        }}
      >
        <h1 style={{ marginBottom: "0.25rem" }}>jimchen.me</h1>
        <p style={{ marginBottom: "0.25rem" }}>
          <A href={links.blog}>Blog</A> &nbsp;·&nbsp;
          <A href={links.github}>GitHub</A> &nbsp;·&nbsp;
          <A href={links.linkedin}>LinkedIn</A> &nbsp;·&nbsp;
        </p>
        <p style={{ marginBottom: "1.5rem" }}>
          <A href={links.telegram}>Telegram</A> &nbsp;·&nbsp;
          <A href={links.instagram}>Instagram</A> &nbsp;·&nbsp;
          <A href={links.wechat}>WeChat</A> &nbsp;·&nbsp;
          <A href={links.youtube}>YouTube</A> &nbsp;·&nbsp;
          <A href={links.tiktok}>TikTok</A>
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <img
            src="https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/1.jpeg"
            alt="Thin photo"
            className="portfolio-img"
            style={{
              flex: "1 1 200px",
              height: "330px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <img
            src="https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/2.JPEG"
            alt="Fat photo"
            className="portfolio-img"
            style={{
              flex: "2.5 1 300px",
              height: "330px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </div>
      </div>
    </>
  );
}
