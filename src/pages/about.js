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
  const languageIcons = [
    { text: "zh", proficiency: "native" },
    { text: "en", proficiency: "proficient" },
    { text: "ру", proficiency: "intermediate" },
    { text: "de", proficiency: "beginner" },
  ];

  const LanguageIcon = ({ text, proficiency }) => {
    return (
      <div
        style={{
          margin: "15px",
          width: "100px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "30px",
            fontWeight: "400",
          }}
        >
          {text}
        </div>
        <div
          style={{
            fontSize: "1rem",
            margin: "0",
          }}
        >
          {proficiency}
        </div>
      </div>
    );
  };

  const linkIconStyle = {
    fontSize: "30px",
    margin: "15px",
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
        marginTop: "20px",
      }}
    >
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: colors.color_black, fontSize: "1.5rem", fontWeight: "300" }}>Website</h2>
        <Link href="https://github.com/jimchen2/jimchen.me">
          <TbSourceCode style={linkIconStyle} title="Source Code" />
        </Link>
        <Link href={`${process.env.NEXT_PUBLIC_SITE}/api/rss`}>
          <FaRss style={linkIconStyle} title="RSS Feed" />
        </Link>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: colors.color_black, fontSize: "1.5rem", fontWeight: "300" }}>Communication</h2>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          {communicationLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <link.Icon style={linkIconStyle} title={link.alt} />
            </Link>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: colors.color_black, fontSize: "1.5rem", fontWeight: "300" }}>Other</h2>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          {otherLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <link.Icon style={linkIconStyle} title={link.alt} />
            </Link>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: colors.color_black, fontSize: "1.5rem", fontWeight: "300" }}>Languages</h2>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          {languageIcons.map((lang) => (
            <LanguageIcon text={lang.text} proficiency={lang.proficiency} />
          ))}
        </div>
      </div>
    </Container>
  );
}

export default About;
