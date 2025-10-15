// SocialLinks.js (renamed for clarity)

import React from "react";
import Link from "next/link";
import { FaGithub, FaTelegram, FaLinkedin, FaEnvelope } from "react-icons/fa";

const socialLinks = [
  { href: "https://github.com/jimchen2", Icon: FaGithub, alt: "GitHub Profile" },
  {
    href: "https://www.linkedin.com/in/jim-chen-588002255/",
    Icon: FaLinkedin,
    alt: "LinkedIn Profile (CV)",
  },
  { href: "mailto:jimchen4214@gmail.com", Icon: FaEnvelope, alt: "Email" },
  { href: "https://t.me/Jimchen4214", Icon: FaTelegram, alt: "Telegram" },
];

function SocialLinks() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // Or 'flex-start'
        alignItems: "center",
        gap: "1.5rem", // Adjust space between icons
        padding: "1rem 0",
      }}
    >
      {socialLinks.map(({ href, Icon, alt }) => (
        <Link key={href} href={href} passHref legacyBehavior>
          <a
            target="_blank"
            rel="noopener noreferrer"
            title={alt} // Good for accessibility
            style={{
              color: "inherit", // Inherits color from parent
              fontSize: "1.5rem", // Adjust icon size
              transition: "opacity 0.2s ease-in-out",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = 0.7)}
            onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
          >
            <Icon />
          </a>
        </Link>
      ))}
    </div>
  );
}

export default SocialLinks;
