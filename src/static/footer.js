import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useGlobalColorScheme } from "../config/global.js";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FaQq } from "react-icons/fa";
import { FaWeixin } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";

const socialLinks = [
  {
    href: "https://github.com/jimchen2",
    Icon: FaGithub,
    alt: "GitHub",
  },
  {
    href: "/qq.jpg",
    Icon: FaQq,
    alt: "QQ",
  },
  {
    href: "/weixin.jpg",
    Icon: FaWeixin,
    alt: "WeChat",
  },
  {
    href: "https://t.me/Jimchen4214",
    Icon: FaTelegram,
    alt: "Telegram",
  },
];

function Footer() {
  const { colors } = useGlobalColorScheme();
  const year = new Date().getFullYear();

  const linkStyle = {
    textDecoration: "none",
    color: colors.color_black,
  };

  const iconStyle = {
    fontSize: 25,
    color: colors.color_black,
    filter: colors.grayscale ? "grayscale(100%)" : "none",
    margin: "5",
  };

  const externalLinkIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ verticalAlign: "middle", marginLeft: "0px" }}>
      <path d="M14 3h7v7h-2V6.41L10.41 15 9 13.59 17.59 5H14V3zM5 5h4v2H5v12h12v-4h2v4c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2z" />
    </svg>
  );

  const CopyrightSection = ({ year, linkStyle }) => (
    <div>
      <span style={{ color: colors.color_black }}>Copyright © {year} Jim Chen,</span>
      <Link href="https://github.com/jimchen2/jimchen.me" style={linkStyle}>
        <span> Source{externalLinkIcon}</span>
      </Link>
      ,
      <Link href={`${process.env.NEXT_PUBLIC_SITE}/api/rss`} style={linkStyle}>
        <span> RSS{externalLinkIcon}</span>
      </Link>
    </div>
  );

  return (
    <Navbar expand="lg" style={{ backgroundColor: colors.color_gray }}>
      <Container style={{ height: "100%" }}>
        <CopyrightSection year={year} linkStyle={linkStyle} />
        <IconLinks iconStyle={iconStyle} />
      </Container>
    </Navbar>
  );
}

const IconLinks = ({ iconStyle }) => (
  <div className="justify-content-end">
    {socialLinks.map((link) => (
      <Link key={link.href} href={link.href}>
        <link.Icon style={iconStyle} title={link.alt} />
      </Link>
    ))}
  </div>
);

export default Footer;
