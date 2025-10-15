import React from "react";
import { 
  FaTelegram, 
  FaYoutube, 
  FaArchive, 
  FaEnvelope, 
  FaLinkedin, 
  FaGithub 
} from "react-icons/fa";

function AboutPage() {
  const personalPhotos = [
    {
      src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/1.jpeg",
      thumbnailSrc: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/146c34.jpeg",
      alt: "Personal photo 1",
    },
    {
      src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/2.JPEG",
      alt: "Personal photo 2",
    },
    {
      src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/3.JPEG",
      alt: "Personal photo 3",
    },
    {
      src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/4.JPEG",
      alt: "Personal photo 4",
    },
    {
      src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/5.JPEG",
      alt: "Personal photo 5",
    },
    {
      src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/6.jpg",
      alt: "Personal photo 6",
    },
  ];

  const techSetup = [
    { name: "jimchen2/dconf-dump", url: "https://github.com/jimchen2/dconf-dump" },
    { name: "jimchen2/jimchen.me", url: "https://github.com/jimchen2/jimchen.me" },
    { name: "jimchen2/userscripts", url: "https://github.com/jimchen2/userscripts" },
  ];

  const globalInternet = [
    { name: "Русский язык, медиа и культура", url: "https://jimchen.me/a/1580c8" },
    { name: "German YouTubers", url: "https://jimchen.me/a/7d67cb" },
    { name: "My Language Learning Journey", url: "https://jimchen.me/a/9bf4b4" },
    { name: "My Guide to the Global Internet", url: "https://jimchen.me/a/19b074" },
  ];

  const philosophy = [
    { name: "My Personal Philosophy", url: "https://archive.org/details/my-personal-philosophy-2025" },
  ];

  const socialLinks = [
    { 
      name: "Telegram", 
      url: "https://t.me/Jimchen4214", 
      icon: FaTelegram, 
      color: "#0088cc" 
    },
    { 
      name: "YouTube", 
      url: "https://www.youtube.com/@jimchen4214", 
      icon: FaYoutube, 
      color: "#FF0000" 
    },
    { 
      name: "Archive.org", 
      url: "https://archive.org/details/@j_c561", 
      icon: FaArchive, 
      color: "#333333" 
    },
    { 
      name: "Email", 
      url: "mailto:jimchen4214@gmail.com", 
      icon: FaEnvelope, 
      color: "#EA4335" 
    },
    { 
      name: "LinkedIn", 
      url: "https://www.linkedin.com/in/jim-chen-588002255/", 
      icon: FaLinkedin, 
      color: "#0077B5" 
    },
    { 
      name: "GitHub", 
      url: "https://github.com/jimchen2", 
      icon: FaGithub, 
      color: "#333333" 
    },
  ];

  const linkStyle = {
    cursor: "pointer",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    transition: "color 0.2s",
    textDecoration: "underline",
  };

  const sectionStyle = {
    marginBottom: "2rem",
  };

  const h2Style = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  };

  const socialLinkStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    textDecoration: "none",
    color: "#333",
    transition: "all 0.3s ease",
    fontSize: "0.9rem",
    border: "1px solid #e0e0e0",
  };

  return (
    <div style={{ fontFamily: "Ubuntu, sans-serif", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>About Me</h1>

      {/* Social & Contact Section */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Social & Contact</h2>
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "0.75rem",
          marginBottom: "1rem" 
        }}>
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={socialLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = link.color;
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = link.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#333";
                  e.currentTarget.style.borderColor = "#e0e0e0";
                }}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Portfolio Section */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Portfolio</h2>
        <div style={{ marginBottom: "1rem" }}>
          <a
            href={personalPhotos[0].src}
            target="_blank"
            rel="noopener noreferrer"
            title={personalPhotos[0].alt}
            style={{ display: "inline-block" }}
          >
            <img
              src={personalPhotos[0].thumbnailSrc}
              alt={personalPhotos[0].alt}
              loading="lazy"
              width="200"
              height="300"
              style={{
                width: "200px",
                height: "300px",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />
          </a>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.2rem 0.5rem",
            fontSize: "0.9rem",
            lineHeight: "1.5",
          }}
        >
          {personalPhotos.map((photo, index) => (
            <React.Fragment key={index}>
              <a href={photo.src} target="_blank" rel="noopener noreferrer" title={photo.alt} style={linkStyle}>
                Photo {index + 1}
              </a>
              {index < personalPhotos.length - 1 && <span aria-hidden="true">/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tech Setup Section */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Tech Setup</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {techSetup.map((item, index) => (
            <li key={index} style={{ marginBottom: "0.5rem" }}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Global Internet Section */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Global Internet</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {globalInternet.map((item, index) => (
            <li key={index} style={{ marginBottom: "0.5rem" }}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Philosophy Section */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Philosophy</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {philosophy.map((item, index) => (
            <li key={index} style={{ marginBottom: "0.5rem" }}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AboutPage;