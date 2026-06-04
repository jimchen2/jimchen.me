import React from "react";

const links = {
  github: "https://github.com/jimchen2",
  linkedin: "https://www.linkedin.com/in/jim-chen-588002255/",
  email: "mailto:jimchen4214@gmail.com",
  telegram: "https://t.me/Jimchen4214",
  instagram: "https://www.instagram.com/hijimchen/",
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
        
        {/* First Line */}
        <p style={{ marginBottom: "0.25rem" }}>
          <A href={links.github}>GitHub</A> &nbsp;·&nbsp;
          <A href={links.linkedin}>LinkedIn</A> &nbsp;·&nbsp;
          <A href={links.email}>jimchen4214@gmail.com</A>
        </p>

        {/* Second Line */}
        <p style={{ marginBottom: "0.25rem" }}>
          <A href={links.youtube}>YouTube</A> &nbsp;·&nbsp;
          <A href={links.tiktok}>TikTok</A>
        </p>

        {/* Third Line */}
        <p style={{ marginBottom: "1.5rem" }}>
          <A href={links.telegram}>Telegram</A> &nbsp;·&nbsp;
          <A href={links.instagram}>Instagram</A> &nbsp;·&nbsp;
          <A href={links.wechat}>WeChat</A>
        </p>
      </div>
    </>
  );
}
