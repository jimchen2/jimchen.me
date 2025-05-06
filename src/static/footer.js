import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import { useGlobalColorScheme } from "../config/global.js";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FaWeixin } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";

const socialLinks = [
  {
    href: "https://github.com/jimchen2",
    Icon: FaGithub,
    alt: "GitHub",
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

  const iconStyle = {
    fontSize: "30",
    margin: "0 5px",
    minHeight: "30px",
  };

  const externalLinkIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ verticalAlign: "middle", marginLeft: "0px" }}>
      <path d="M14 3h7v7h-2V6.41L10.41 15 9 13.59 17.59 5H14V3zM5 5h4v2H5v12h12v-4h2v4c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2z" />
    </svg>
  );

  const CopyrightSection = ({ year }) => (
    <span style={{ color: colors.color_black, display: "inline-flex", flexWrap: "wrap", alignItems: "center", fontSize: "15px" }}>
      <span>Copyright © {year} Jim Chen,</span>
      <Link href="https://github.com/jimchen2/jimchen.me">
        <span style={{ marginLeft: "3px" }}>Source Code{externalLinkIcon}</span>
      </Link>
      ,
      <Link href={`${process.env.NEXT_PUBLIC_SITE}/api/rss`}>
        <span style={{ marginLeft: "3px" }}>RSS{externalLinkIcon}</span>
      </Link>
    </span>
  );

  const IconLinks = ({ iconStyle }) => (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      {socialLinks.map((link) => (
        <Link key={link.href} href={link.href}>
          <link.Icon style={iconStyle} title={link.alt} />
        </Link>
      ))}
    </div>
  );

  return (
    <Navbar style={{ backgroundColor: colors.color_gray, fontFamily: "Ubuntu" }}>
      <Container>
        <Row className="w-100 align-items-center">
          <Col xs={12} md={8} className="d-flex">
            <span style={{ marginLeft: window.innerWidth > 768 ? "15%" : "0" }}>
              <CopyrightSection year={year} />
            </span>
          </Col>
          <Col xs={12} md={4} className="d-flex justify-content-md-end">
            <IconLinks iconStyle={iconStyle} />
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default Footer;
