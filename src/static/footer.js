import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useGlobalColorScheme } from "../config/global.js";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { SiInternetarchive } from "react-icons/si";
import { MdEmail } from "react-icons/md";
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
    href: "https://archive.org/details/@jimchen4214",
    Icon: SiInternetarchive,
    alt: "Internet Archive",
  },
  {
    href: "https://cdn.jimchen.me/1d460c338efc24b84334f46f56159d30/email.png",
    Icon: MdEmail,
    alt: "Email",
  },
  {
    href: "https://cdn.jimchen.me/1d460c338efc24b84334f46f56159d30/qq.jpg",
    Icon: FaQq,
    alt: "QQ",
  },
  {
    href: "https://cdn.jimchen.me/1d460c338efc24b84334f46f56159d30/w.jpg",
    Icon: FaWeixin,
    alt: "WeChat",
  },
  {
    href: "https://cdn.jimchen.me/1d460c338efc24b84334f46f56159d30/telegram.jpg",
    Icon: FaTelegram,
    alt: "Telegram",
  },
];

function Footer() {
  const { colors } = useGlobalColorScheme();
  const year = new Date().getFullYear();

  const linkStyle = {
    textDecoration: "underline",
  };

  const iconStyle = {
    fontSize: 30,
    color: colors.color_black,
    filter: colors.grayscale ? "grayscale(100%)" : "none",
    margin: "3",
  };

  const externalLinkIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ verticalAlign: "middle", marginLeft: "0px" }}>
      <path d="M14 3h7v7h-2V6.41L10.41 15 9 13.59 17.59 5H14V3zM5 5h4v2H5v12h12v-4h2v4c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2z" />
    </svg>
  );

  const CopyrightSection = ({ year, linkStyle }) => (
    <div>
      <span style={{ color: colors.color_black }}>Copyright © Jim Chen {year}</span>,<span style={{ margin: "2px" }}></span>
      <a href="https://github.com/jimchen2/My-Website-new" style={linkStyle}>
        Source{externalLinkIcon}
      </a>
      ,<span style={{ margin: "2px" }}></span>
      <Link href={`${process.env.NEXT_PUBLIC_SITE}/api/rss`} style={linkStyle}>
        {" "}
        RSS{externalLinkIcon}
      </Link>
    </div>
  );

  return (
    <Navbar fixed="bottom" expand="lg" style={{ backgroundColor: colors.color_gray, fontSize: "15px" }}>
      <Container style={{ height: "100%" }}>
        <CopyrightSection year={year} linkStyle={linkStyle} />
        <IconLinks iconStyle={iconStyle} linkStyle={linkStyle} />
      </Container>
    </Navbar>
  );
}

const IconLinks = ({ iconStyle, linkStyle }) => (
  <div className="justify-content-end">
    {socialLinks.map((link) => (
      <a key={link.href} href={link.href} style={linkStyle}>
        <link.Icon style={iconStyle} title={link.alt} />
      </a>
    ))}
  </div>
);

export default Footer;