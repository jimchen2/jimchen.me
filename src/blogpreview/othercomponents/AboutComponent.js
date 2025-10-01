// AboutComponent.js

import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { FaGithub, FaWeixin, FaTelegram, FaLinkedin, FaEnvelope, FaGoodreads, FaYoutube } from "react-icons/fa";
import { SiInternetarchive, SiTampermonkey } from "react-icons/si";

function AboutComponent() {
  const { t } = useTranslation("common");

  // Define links inside the component to access the 't' function
  const profileLinks = [
    {
      href: "https://github.com/jimchen2",
      Icon: FaGithub,
      alt: t("about.profile.github_alt"),
      name: t("about.linkNames.github"),
    },
    {
      href: "https://www.linkedin.com/in/jim-chen-588002255/",
      Icon: FaLinkedin,
      alt: t("about.profile.linkedin_alt"),
      name: t("about.linkNames.linkedin"),
    },
    {
      href: "mailto:jimchen4214@gmail.com",
      Icon: FaEnvelope,
      alt: t("about.contact.email_alt"),
      name: t("about.linkNames.email"),
    },
    {
      href: "https://t.me/Jimchen4214",
      Icon: FaTelegram,
      alt: t("about.contact.telegram_alt"),
      name: t("about.linkNames.telegram"),
    },
  ];

  const utilityLinks = [
    {
      href: "https://www.youtube.com/@jimchen4214",
      Icon: FaYoutube,
      alt: t("about.profile.youtube_alt"),
      name: t("about.linkNames.youtube"),
    },
    {
      href: "https://archive.org/details/@j_c561",
      Icon: SiInternetarchive,
      alt: t("about.utility.archive_alt"),
      name: t("about.linkNames.archive"),
    },
  ];

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
            display: "flex",
            alignItems: "center",
            padding: "10px",
            borderRadius: "5px",
            textDecoration: "none",
            color: "inherit",
            transition: "background-color 0.2s ease-in-out",
            marginBottom: "5px",
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
              <div key={link.href} title={link.alt} style={{ ...linkItemStyle, cursor: "pointer" }}>
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
      {renderLinkSection(t("about.profile.title"), profileLinks)}
      {renderLinkSection(t("about.utility.title"), utilityLinks)}
    </div>
  );
}

export default AboutComponent;
