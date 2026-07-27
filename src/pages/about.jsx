import React from "react";

const links = {
  github: "https://github.com/jimchen2",
  linkedin: "https://www.linkedin.com/in/jim-chen-588002255/",
  email: "mailto:jimchen4214@gmail.com",
  phone: "tel:4793169630",
  telegram: "https://t.me/Jimchen4214",
  instagram: "https://www.instagram.com/hijimchen/",
  wechat: "https://jimchen.me/weixin.jpg",
  youtube: "https://www.youtube.com/@jimchen4214",
  tiktok: "https://www.tiktok.com/@jimchen.me",
};

const images = {
  vertical1:
    "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/public_images/profile/photo_2026.jpg",
  vertical2:
    "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/public_images/profile/6091230C-A9C0-4E20-81D4-E4DD82B7150B.jpeg",
  horizontal:
    "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/public_images/profile/2.jpeg",
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
        body {
          margin: 0;
          color: #1a1a1a;
          background-color: #fcfbf9;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
          font-size: 1.15rem;
          line-height: 1.7;
          letter-spacing: -0.01em;
        }

        a {
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 500;
          padding: 2px 4px;
          margin: 0 -4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        a:hover {
          background-color: #eaeaea;
          color: #000;
        }

        .label {
          color: #666;
          font-weight: 400;
        }

        .dot {
          color: #ccc;
          margin: 0 6px;
          user-select: none;
        }

        .image-gallery {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 2.5rem;
        }

        .vertical-container {
          display: flex;
          gap: 16px;
        }

        .vertical-container img,
        .horizontal-container img {
          width: 100%;
          height: auto;
          object-fit: cover;
          border-radius: 12px;
          transition: transform 0.3s ease;
        }

        .vertical-container img:hover,
        .horizontal-container img:hover {
          transform: scale(1.01);
        }

        .vertical-container img {
          width: 50%;
        }

        @media (max-width: 600px) {
          .vertical-container {
            flex-direction: column;
          }
          .vertical-container img {
            width: 100%;
          }
        }
      `}</style>

      <div
        style={{
          maxWidth: "650px",
          margin: "0 auto",
          padding: "4rem 1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            letterSpacing: "-0.03em",
            marginBottom: "0.75rem",
            marginTop: 0,
          }}
        >
          Jim Chen
        </h1>

        {/* Location & Origin */}
        <p style={{ margin: "0.4rem 0" }}>
          📍Fayetteville, Arkansas{" "}
          <span className="dot">•</span> <span className="label">From:</span>{" "}
          Shanghai 🇨🇳
        </p>

        {/* Direct Contact */}
        <p style={{ margin: "0.4rem 0" }}>
         <span className="label">Email:</span>{" "}
          <A href={links.email}>jimchen4214@gmail.com</A>
        </p>
        <p style={{ margin: "0.4rem 0" }}>
          📱 <span className="label">Phone:</span>{" "}
          <A href={links.phone}>479-316-9630</A>
        </p>

        {/* Professional Links */}
        <p style={{ margin: "0.4rem 0" }}>
          💻 <span className="label">Work:</span>{" "}
          <A href={links.github}>GitHub</A>
          <span className="dot">•</span>
          <A href={links.linkedin}>LinkedIn</A>
        </p>

        {/* Video Platforms */}
        <p style={{ margin: "0.4rem 0" }}>
          🎥 <span className="label">Videos:</span>{" "}
          <A href={links.youtube}>YouTube</A>
          <span className="dot">•</span>
          <A href={links.tiktok}>TikTok</A>
        </p>

        {/* Social / Messaging */}
        <p style={{ margin: "0.4rem 0" }}>
          💬 <span className="label">Social:</span>{" "}
          <A href={links.instagram}>Instagram</A>
          <span className="dot">•</span>
          <A href={links.telegram}>Telegram</A>
          <span className="dot">•</span>
          <A href={links.wechat}>WeChat</A>
        </p>

        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="vertical-container">
            <img src={images.vertical1} alt="Profile Vertical 1" />
            <img src={images.vertical2} alt="Profile Vertical 2" />
          </div>
          <div className="horizontal-container">
            <img src={images.horizontal} alt="Profile Horizontal" />
          </div>
        </div>
      </div>
    </>
  );
}
