import React from "react";
import { FaEnvelope, FaLinkedin, FaGithub, FaTelegram, FaInstagram, FaWeixin, FaYoutube, FaTiktok } from "react-icons/fa";

const PHOTOS = [1,2,3,4,5].map(n => ({
  src: `https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/${n}.${n===1?"jpeg":"JPEG"}`,
  thumb: `https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/thumbs/${n}-thumb.jpeg`,
}));

const LINKS = [
  { label: "Profile", items: [
    { name: "Email", url: "mailto:jimchen4214@gmail.com", icon: FaEnvelope, color: "#EA4335" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/jim-chen-588002255/", icon: FaLinkedin, color: "#0077B5" },
    { name: "GitHub", url: "https://github.com/jimchen2", icon: FaGithub, color: "#333" },
  ]},
  { label: "Contact", items: [
    { name: "Telegram", url: "https://t.me/Jimchen4214", icon: FaTelegram, color: "#0088cc" },
    { name: "Instagram", url: "https://www.instagram.com/jimchen_1", icon: FaInstagram, color: "#E4405F" },
    { name: "WeChat", url: "https://jimchen.me/weixin.jpg", icon: FaWeixin, color: "#07C160" },
  ]},
  { label: "Social", items: [
    { name: "YouTube", url: "https://www.youtube.com/@jimchen4214", icon: FaYoutube, color: "#FF0000" },
    { name: "TikTok", url: "https://www.tiktok.com/@jimchen.me", icon: FaTiktok, color: "#000" },
  ]},
];

export default function AboutPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f7f8fc", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ flex: 1, maxWidth: 1200, margin: "2rem auto", padding: "0 1rem", width: "100%" }}>
        <div style={{ background: "white", border: "1px solid #e2e8f0", padding: "2rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>📸 A Glimpse Into My Life</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
            {PHOTOS.map((p, i) => (
              <a key={i} href={p.src} target="_blank" rel="noopener noreferrer">
                <img src={p.thumb} alt={`Photo ${i+1}`} loading="lazy" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ background: "#e9ecef", padding: "1.5rem 2rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", maxWidth: 1200, margin: "0 auto", justifyContent: "space-between" }}>
          {LINKS.map(({ label, items }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", color: "#5a6068" }}>{label}</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {items.map(({ name, url, icon: Icon, color }) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer" title={name}
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 8, background: color, color: "#fff" }}>
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
