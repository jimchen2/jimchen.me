import React from "react";
import Container from "react-bootstrap/Container";
import { useGlobalColorScheme } from "../config/global.js";
import Link from "next/link";
import { FaGithub, FaWeixin, FaTelegram, FaWhatsapp, FaLinkedin, FaEnvelope, FaQq, FaHome, FaRss } from "react-icons/fa";
import { TbSourceCode } from "react-icons/tb";

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

  const linkIconStyle = {
    fontSize: "24px",
    margin: "0 10px",
    color: colors.color_black,
    verticalAlign: "middle",
  };

  return (
    <Container
      style={{
        fontFamily: "Ubuntu",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: colors.color_black, fontSize: "1.5rem", marginBottom: "10px" }}>Website</h2>

      <div style={{ marginBottom: "40px" }}>
        <Link href="https://github.com/jimchen2/jimchen.me">
          <TbSourceCode
            style={linkIconStyle}
            title="Source Code"
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.color_accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.color_black)}
          />
        </Link>
        <Link href={`${process.env.NEXT_PUBLIC_SITE}/api/rss`}>
          <FaRss
            style={linkIconStyle}
            title="RSS Feed"
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.color_accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.color_black)}
          />
        </Link>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: colors.color_black, fontSize: "1.5rem" }}>Communication</h2>
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
        <h2 style={{ color: colors.color_black, fontSize: "1.5rem" }}>Other</h2>
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