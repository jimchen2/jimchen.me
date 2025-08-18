// AboutComponent.js

import React from "react";
import Link from "next/link";
import { FaGithub, FaWeixin, FaTelegram, FaLinkedin, FaEnvelope, FaGoodreads, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { SiInternetarchive, SiOpenstreetmap, SiTampermonkey, SiHuggingface, SiBitwarden } from "react-icons/si";

// 2 profile links for the top section
const profileLinks = [
  { href: "https://github.com/jimchen2", Icon: FaGithub, alt: "GitHub Profile", name: "GitHub" },
  { href: "https://www.linkedin.com/in/jim-chen-588002255/", Icon: FaLinkedin, alt: "LinkedIn Profile (CV)", name: "LinkedIn" },
  { href: "https://www.youtube.com/@jimchen4214", Icon: FaYoutube, alt: "YouTube Channel", name: "YouTube" },
];

// 4 social media/communication links for the middle section
const socialLinks = [
  { href: "mailto:jimchen4214@gmail.com", Icon: FaEnvelope, alt: "Email", name: "Email" },
  { href: "https://t.me/Jimchen4214", Icon: FaTelegram, alt: "Telegram", name: "Telegram" },
  { href: "https://wa.me/qr/7DODSHY3VJN3K1", Icon: FaWhatsapp, alt: "WhatsApp", name: "WhatsApp" },
  { href: "https://jimchen.me/weixin.jpg", Icon: FaWeixin, alt: "WeChat", name: "WeChat" },
];

// 5 utility links for the bottom section
const utilityLinks = [
  { href: "https://archive.org/details/@j_c561", Icon: SiInternetarchive, alt: "Internet Archive", name: "Internet Archive" },
  { href: "https://umap.openstreetmap.fr/en/user/jimchen2/", Icon: SiOpenstreetmap, alt: "Umap", name: "Umap" },
  { href: "https://greasyfork.org/en/users/1430831-jimchen2", Icon: SiTampermonkey, alt: "Greasy Fork", name: "Greasy Fork" },
  { href: "https://huggingface.co/jimchen2", Icon: SiHuggingface, alt: "Hugging Face Profile", name: "Hugging Face" },
  { href: "https://www.goodreads.com/user/show/154371677-jim-chen", Icon: FaGoodreads, alt: "Goodreads Profile", name: "Goodreads" },
  { href: "https://bitwarden.com/", Icon: SiBitwarden, alt: "Bitwarden Password Manager", name: "Bitwarden" },
];

function AboutComponent() {
  const renderLinkSection = (title, links) => (
    <div style={{ marginBottom: "2rem", width: "100%" }}>
      <h3 style={{ fontSize: "1rem", fontWeight: "bold", paddingLeft: "1rem", marginBottom: "0.5rem" }}>{title}</h3>
      {/* Container for the list of links */}
      <div style={{ padding: "0 0.5rem" }}>
        {links.map((link) => {
          const isExternal = link.href.startsWith("http") || link.href.startsWith("mailto:");
          const isImageDisplay = ["/weixin.jpg", "/qq.jpg"].includes(link.href);

          // Style for each line item in the list
          const linkItemStyle = {
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            borderRadius: '5px',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'background-color 0.2s ease-in-out',
            marginBottom: '5px',
          };

          // Style for the icon
          const iconStyle = {
            fontSize: "24px",
            marginRight: "12px", // Space between icon and text
            flexShrink: 0, // Prevents icon from shrinking
          };

          // Style for the name text
          const nameStyle = {
            fontSize: "14px",
          };

          const content = (
            <>
              <link.Icon style={iconStyle} />
              <span style={nameStyle}>{link.name}</span>
            </>
          );

          if (isImageDisplay) {
            return (
              <div key={link.href} title={link.alt} style={{...linkItemStyle, cursor: 'pointer'}}>
                {content}
              </div>
            );
          }

          return (
            <Link key={link.href} href={link.href} passHref legacyBehavior>
              <a
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                title={link.alt}
                style={linkItemStyle}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {content}
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
      {renderLinkSection("Contact", socialLinks)}
      {renderLinkSection("Utility Links", utilityLinks)}
    </div>
  );
}

export default AboutComponent;