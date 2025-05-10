import React from "react";
import Container from "react-bootstrap/Container";
import { useGlobalColorScheme } from "../config/global.js";
import Link from "next/link";
import { FaGithub, FaWeixin, FaTelegram, FaWhatsapp, FaLinkedin, FaEnvelope, FaQq, FaHome } from "react-icons/fa";

const communicationLinks = [
  {
    href: "mailto:jimchen4214@gmail.com",
    Icon: FaEnvelope,
    alt: "Email",
  },
  {
    href: "/weixin.jpg",
    Icon: FaWeixin,
    alt: "WeChat",
  },
  {
    href: "/qq.jpg",
    Icon: FaQq,
    alt: "QQ",
  },
  {
    href: "https://t.me/Jimchen4214",
    Icon: FaTelegram,
    alt: "Telegram",
  },
  {
    href: "/whatsapp.jpg",
    Icon: FaWhatsapp,
    alt: "WhatsApp",
  },
];

const otherLinks = [
  {
    href: "https://github.com/jimchen2",
    Icon: FaGithub,
    alt: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/jim-chen-588002255/",
    Icon: FaLinkedin,
    alt: "LinkedIn",
  },
  {
    href: "https://jimchen.me",
    Icon: FaHome,
    alt: "Website",
  },
];

function About() {
  const { colors } = useGlobalColorScheme();
  const year = new Date().getFullYear();

  const iconStyle = {
    fontSize: "40px",
    margin: "10px 15px",
    color: colors.color_black,
  };

  const externalLinkIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M14 3h7v7h-2V6.41L10.41 15 9 13.59 17.59 5H14V3zM5 5h4v2H5v12h12v-4h2v4c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2z" />
    </svg>
  );

  return (
    <Container
      style={{
        fontFamily: "Ubuntu",
        padding: "40px 20px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: colors.color_black, fontSize: "1.8rem", marginBottom: "10px" }}>Website</h2>

      <div style={{ marginBottom: "40px" }}>
        <Link href="https://github.com/jimchen2/jimchen.me">
          <span style={{ color: colors.color_black, fontSize: "1.3rem", margin: "0 10px" }}>Source{externalLinkIcon}</span>
        </Link>
        <Link href={`${process.env.NEXT_PUBLIC_SITE}/api/rss`}>
          <span style={{ color: colors.color_black, fontSize: "1.3rem", margin: "0 10px" }}>RSS{externalLinkIcon}</span>
        </Link>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: colors.color_black, fontSize: "1.8rem" }}>Communication</h2>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          {communicationLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <link.Icon
                style={iconStyle}
                title={link.alt}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.color_accent)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.color_black)}
              />
            </Link>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: colors.color_black, fontSize: "1.8rem" }}>Other</h2>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          {otherLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <link.Icon
                style={iconStyle}
                title={link.alt}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.color_accent)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.color_black)}
              />
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default About;
