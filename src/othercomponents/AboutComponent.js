// AboutComponent.js
import React from "react";
import { useGlobalColorScheme } from "../config/global.js";
import Link from "next/link";
import {
  FaGithub,
  FaWeixin,
  FaTelegram,
  FaLinkedin,
  FaEnvelope,
  FaRss,
  FaArchive,
  FaMap,
  FaWrench,
  FaMastodon, 
} from "react-icons/fa";
import { TbSourceCode } from "react-icons/tb";

const communicationLinks = [
  { href: "mailto:jimchen4214@gmail.com", Icon: FaEnvelope, alt: "Email" },
  { href: "https://jimchen.me/weixin.jpg", Icon: FaWeixin, alt: "WeChat QR Code" },
  { href: "https://t.me/Jimchen4214", Icon: FaTelegram, alt: "Telegram" },
  { href: "https://mastodon.social/@jimchen2", Icon: FaMastodon, alt: "Mastodon" }, // Fixed Icon
];

const websiteLinks = [
  { href: "https://jimchen.me/api/rss", Icon: FaRss, alt: "RSS Feed" },
  { href: "https://github.com/jimchen2/jimchen.me", Icon: TbSourceCode, alt: "Website Source Code" },
];

const profileLinks = [
  { href: "https://github.com/jimchen2", Icon: FaGithub, alt: "GitHub Profile" },
  { href: "https://www.linkedin.com/in/jim-chen-588002255/", Icon: FaLinkedin, alt: "LinkedIn Profile (CV)" },
];

const utilityLinks = [
  { href: "https://archive.org/details/@j_c561", Icon: FaArchive, alt: "Internet Archive" },
  { href: "https://www.openstreetmap.org/user/jimchen4214", Icon: FaMap, alt: "OpenStreetMap" },
  { href: "https://greasyfork.org/en/users/1430831-jimchen2", Icon: FaWrench, alt: "Greasy Fork" },
];

function AboutComponent() {
  const { colors } = useGlobalColorScheme();
  const defaultColor = "#000"; // Fallback color

  const linkIconStyle = {
    fontSize: "26px",
    margin: "10px",
    color: colors.color_black || defaultColor,
    verticalAlign: "middle",
    transition: "transform 0.2s ease-in-out",
  };

  const renderLinkSection = (title, links) => (
    <div style={{ marginBottom: "2rem", width: "100%" }}>
      <h3
        style={{
          color: colors.color_black || defaultColor,
          fontSize: "1rem",
          fontWeight: "bold",
          paddingLeft: "1rem",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h3>
      <div style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap", padding: "0 0.5rem" }}>
        {links.map((link) => {
          const isExternal = link.href.startsWith("http") || link.href.startsWith("mailto:");
          const isImageDisplay = link.href.endsWith("/weixin.jpg"); // Simplified check

          if (isImageDisplay) {
            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.alt}
                aria-label={link.alt}
                style={{ display: "inline-flex", alignItems: "center" }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <link.Icon style={linkIconStyle} />
              </a>
            );
          }

          return (
            <Link key={link.href} href={link.href} passHref>
              <a
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                title={link.alt}
                aria-label={link.alt}
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
      {renderLinkSection("Website", websiteLinks)}
      {renderLinkSection("Communication", communicationLinks)}
      {renderLinkSection("Profiles", profileLinks)}
      {renderLinkSection("Utility Links", utilityLinks)}
    </div>
  );
}

export default AboutComponent;
