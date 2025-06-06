import React from "react";
import Container from "react-bootstrap/Container";
import { useGlobalColorScheme } from "../config/global.js";
import Link from "next/link";
import { FaGithub, FaWeixin, FaTelegram, FaLinkedin, FaEnvelope, FaQq, FaHome, FaRss, FaArchive } from "react-icons/fa";
import { TbSourceCode } from "react-icons/tb";

const communicationLinks = [
  {
    href: "mailto:jimchen4214@gmail.com",
    Icon: FaEnvelope,
    alt: "Email",
  },
  {
    href: "https://jimchen.me/weixin.jpg",
    Icon: FaWeixin,
    alt: "WeChat",
  },
  {
    href: "https://t.me/Jimchen4214",
    Icon: FaTelegram,
    alt: "Telegram",
  },
];

// New "Website" specific links
const websiteLinks = [
  {
    href: "https://jimchen.me/api/rss",
    Icon: FaRss,
    alt: "RSS Feed",
  },
  {
    href: "https://github.com/jimchen2/jimchen.me",
    Icon: TbSourceCode,
    alt: "Website Source Code",
  },
];

// "Other" links, now refined
const otherLinks = [
  {
    href: "https://github.com/jimchen2",
    Icon: FaGithub,
    alt: "GitHub Profile",
  },
  {
    href: "https://www.linkedin.com/in/jim-chen-588002255/",
    Icon: FaLinkedin,
    alt: "LinkedIn Profile (CV)",
  },
];

function About() {
  const { colors } = useGlobalColorScheme();

  const linkIconStyle = {
    fontSize: "30px",
    margin: "15px",
    color: colors.color_black,
    verticalAlign: "middle",
    transition: "transform 0.2s ease-in-out", // Added for subtle hover effect
  };

  // Helper to render link sections
  const renderLinkSection = (title, links) => (
    <div style={{ marginBottom: "40px", width: "100%", maxWidth: "600px" }}>
      <h2 style={{ color: colors.color_black, fontSize: "1.5rem", fontWeight: "300" }}>{title}</h2>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {links.map((link) => {
          // Determine if the link is external
          const isExternal = link.href.startsWith("http") || link.href.startsWith("mailto:");
          // Determine if the link is to an image to be displayed (not navigated to)
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
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")} // Hover effect
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset hover effect
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
    <Container
      style={{
        fontFamily: "Ubuntu, sans-serif", // Added sans-serif fallback
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingTop: "20px", // Changed from marginTop to paddingTop for container
        paddingBottom: "20px",
      }}
    >
      {renderLinkSection("Website", websiteLinks)}
      {renderLinkSection("Communication", communicationLinks)}
      {renderLinkSection("Other Links", otherLinks)}
    </Container>
  );
}

export default About;
