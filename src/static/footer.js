import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useGlobalColorScheme } from "../config/global.js";
import Image from "next/image"; // Add this import
import Link from 'next/link';

const ICON_SIZE = 35;

const socialLinks = [
  {
    href: "https://github.com/jimchen2",
    imgSrc: "/github-icon.png", // Change to absolute path
    alt: "GitHub", // Add alt text
  },
  {
    href: "https://archive.org/details/@jimchen4214",
    imgSrc: "/internetarchive.png",
    alt: "Internet Archive",
  },
  {
    href: "https://jimchen.me/qq.jpg",
    imgSrc: "/qq-removebg-preview.png",
    alt: "QQ",
  },
  {
    href: "https://jimchen.me/w.JPG",
    imgSrc: "/wechat-icon.png",
    alt: "WeChat",
  },
];

function Footer() {
  const { colors } = useGlobalColorScheme();
  const year = new Date().getFullYear();

  const linkStyle = {
    color: colors.color_blue,
    textDecoration: "underline",
  };

  const imageStyle = {
    height: ICON_SIZE,
    filter: colors.grayscale ? "grayscale(100%)" : "none",
  };

  const externalLinkIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ verticalAlign: "middle", marginLeft: "0px" }}>
      <path d="M14 3h7v7h-2V6.41L10.41 15 9 13.59 17.59 5H14V3zM5 5h4v2H5v12h12v-4h2v4c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2z" />
    </svg>
  );

  const CopyrightSection = ({ year, linkStyle }) => (
    <div>
      <span style={{ color: colors.color_black }}>Copyright © Jim Chen {year}</span>,<span style={{ margin: "2px" }}></span>
      <a href="https://github.com/jimchen2/My-Website" style={linkStyle}>
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
        <IconLinks imageStyle={imageStyle} linkStyle={linkStyle} />
      </Container>
    </Navbar>
  );
}

const IconLinks = ({ imageStyle, linkStyle }) => (
  <div className="justify-content-end">
    {socialLinks.map((link) => (
      <a key={link.href} href={link.href} style={linkStyle}>
        <Image src={link.imgSrc} alt={link.alt} width={ICON_SIZE} height={ICON_SIZE} style={imageStyle} />
      </a>
    ))}
  </div>
);

export default Footer;
