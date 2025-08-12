// AboutComponent.js

import React from "react";
import Link from "next/link";
import { FaGithub, FaWeixin, FaTelegram, FaLinkedin, FaEnvelope, FaGoodreads, FaYoutube } from "react-icons/fa";
import { SiInternetarchive } from "react-icons/si";
import { SiOpenstreetmap } from "react-icons/si";
import { SiTampermonkey } from "react-icons/si";
import { SiHuggingface } from "react-icons/si";

// 2 profile links for the top section
const profileLinks = [
  { href: "https://github.com/jimchen2", Icon: FaGithub, alt: "GitHub Profile" },
  { href: "https://www.linkedin.com/in/jim-chen-588002255/", Icon: FaLinkedin, alt: "LinkedIn Profile (CV)" },
];

// 4 social media/communication links for the middle section
const socialLinks = [
  { href: "mailto:jimchen4214@gmail.com", Icon: FaEnvelope, alt: "Email" },
  { href: "https://t.me/Jimchen4214", Icon: FaTelegram, alt: "Telegram" },
  { href: "https://jimchen.me/weixin.jpg", Icon: FaWeixin, alt: "WeChat" },
  { href: "https://www.youtube.com/@jimchen4214", Icon: FaYoutube, alt: "YouTube Channel" },
];

// 5 utility links for the bottom section (no change)
const utilityLinks = [
  { href: "https://archive.org/details/@j_c561", Icon: SiInternetarchive, alt: "Internet Archive" },
  { href: "https://umap.openstreetmap.fr/en/user/jimchen2/", Icon: SiOpenstreetmap, alt: "Umap" },
  { href: "https://greasyfork.org/en/users/1430831-jimchen2", Icon: SiTampermonkey, alt: "Greasy Fork" },
  { href: "https://huggingface.co/jimchen2", Icon: SiHuggingface, alt: "Hugging Face Profile" },
  { href: "https://www.goodreads.com/user/show/154371677-jim-chen", Icon: FaGoodreads, alt: "Goodreads Profile" },
];

function AboutComponent() {
  const linkIconStyle = {
    fontSize: "26px",
    margin: "10px",
    verticalAlign: "middle",
    transition: "transform 0.2s ease-in-out",
  };

  const renderLinkSection = (title, links) => (
    <div style={{ marginBottom: "2rem", width: "100%" }}>
      <h3 style={{ fontSize: "1rem", fontWeight: "bold", paddingLeft: "1rem", marginBottom: "0.5rem" }}>{title}</h3>
      <div style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap", padding: "0 0.5rem" }}>
        {links.map((link) => {
          const isExternal = link.href.startsWith("http") || link.href.startsWith("mailto:");
          const isImageDisplay = ["/weixin.jpg", "/qq.jpg"].includes(link.href);

          if (isImageDisplay) {
            return (
              <span key={link.href} title={link.alt}>
                <link.Icon style={linkIconStyle} />
              </span>
            );
          }

          return (
            <Link key={link.href} href={link.href} passHref legacyBehavior>
              <a
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                title={link.alt}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <link.Icon style={linkIconStyle} />
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "Ubuntu, sans-serif", paddingTop: "1rem" }}>
      {renderLinkSection("Profile", profileLinks)}
      {renderLinkSection("Social Media", socialLinks)}
      {renderLinkSection("Utilities", utilityLinks)}
    </div>
  );
}

export default AboutComponent;
