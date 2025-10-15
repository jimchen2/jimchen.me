import React, { useState, useEffect } from "react";
import { FaTelegram, FaYoutube, FaArchive, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// --- ENHANCED ANALOG CLOCK COMPONENT ---
function AnalogClock({ timeZone }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  // Get current time in the specified timezone
  const localTime = new Date(time.toLocaleString("en-US", { timeZone }));
  const hours = localTime.getHours();
  const minutes = localTime.getMinutes();
  const seconds = localTime.getSeconds();

  // Format digital time
  const digitalTime = localTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Calculate the rotation for each hand
  const secondsDegrees = seconds * 6;
  const minutesDegrees = minutes * 6 + seconds * 0.1;
  const hoursDegrees = (hours % 12) * 30 + minutes * 0.5;

  // --- IMPROVED STYLES FOR THE CLOCK ---
  const clockStyle = {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    border: "5px solid #2c3e50",
    background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
    position: "relative",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15), inset 0 0 20px rgba(0,0,0,0.05)",
  };

  const handStyle = {
    position: "absolute",
    left: "50%",
    bottom: "50%",
    transformOrigin: "bottom center",
    backgroundColor: "#34495e",
    borderRadius: "4px",
    transition: "transform 0.05s linear", // Smooth hand movement
  };

  const hourHandStyle = {
    ...handStyle,
    width: "5px",
    height: "45px",
    transform: `translateX(-50%) rotate(${hoursDegrees}deg)`,
  };

  const minuteHandStyle = {
    ...handStyle,
    width: "4px",
    height: "65px",
    transform: `translateX(-50%) rotate(${minutesDegrees}deg)`,
  };

  const secondHandStyle = {
    ...handStyle,
    width: "2px",
    height: "70px",
    backgroundColor: "#e74c3c", // Vibrant red for second hand
    transform: `translateX(-50%) rotate(${secondsDegrees}deg)`,
  };

  const centerDotStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "12px",
    height: "12px",
    backgroundColor: "#2c3e50",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
  };

  // Enhanced hour markers
  const hourMarkerStyle = (hour) => {
    const angle = hour * 30 - 90;
    const isMainHour = hour % 3 === 0;
    const markerLength = isMainHour ? 12 : 6;
    const markerWidth = isMainHour ? 3 : 2;
    
    return {
      position: "absolute",
      width: `${markerWidth}px`,
      height: `${markerLength}px`,
      backgroundColor: "#34495e",
      top: "5px",
      left: "50%",
      transformOrigin: "center 75px",
      transform: `translateX(-50%) rotate(${angle}deg)`,
    };
  };

  // Improved hour numbers
  const hourNumberStyle = (hour) => {
    const angle = hour * 30 - 90;
    const radius = 60;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    
    return {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      fontSize: "14px",
      fontWeight: "600",
      color: "#2c3e50",
      userSelect: "none",
      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
    };
  };

  const digitalTimeStyle = {
    marginTop: "0.75rem",
    fontSize: "1.1rem",
    fontFamily: "monospace",
    color: "#7f8c8d",
    fontWeight: "500",
    letterSpacing: "1px",
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={clockStyle}>
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div key={`marker-${i}`} style={hourMarkerStyle(i + 1)}></div>
        ))}
        
        {/* Hour numbers */}
        {[12, 3, 6, 9].map((hour) => (
          <div key={`number-${hour}`} style={hourNumberStyle(hour === 12 ? 0 : hour)}>
            {hour}
          </div>
        ))}
        
        <div style={centerDotStyle}></div>
        <div style={hourHandStyle}></div>
        <div style={minuteHandStyle}></div>
        <div style={secondHandStyle}></div>
      </div>
      <div style={digitalTimeStyle}>{digitalTime}</div>
    </div>
  );
}

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
    { name: "Русский язык, медиа и культура (2025)", url: "https://jimchen.me/a/1580c8" },
    { name: "German YouTubers (2025)", url: "https://jimchen.me/a/7d67cb" },
    { name: "My Language Learning Journey", url: "https://jimchen.me/a/9bf4b4" },
    { name: "My Guide to the Global Internet (2025)", url: "https://jimchen.me/a/19b074" },
  ];

  // --- SEPARATED LINKS ---
  const socialMediaLinks = [
    {
      name: "Telegram",
      url: "https://t.me/Jimchen4214",
      icon: FaTelegram,
      color: "#0088cc",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@jimchen4214",
      icon: FaYoutube,
      color: "#FF0000",
    },
    {
      name: "Archive.org",
      url: "https://archive.org/details/@j_c561",
      icon: FaArchive,
      color: "#333333",
    },
  ];

  const externalLinks = [
    {
      name: "Email",
      url: "mailto:jimchen4214@gmail.com",
      icon: FaEnvelope,
      color: "#EA4335",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/jim-chen-588002255/",
      icon: FaLinkedin,
      color: "#0077B5",
    },
    {
      name: "GitHub",
      url: "https://github.com/jimchen2",
      icon: FaGithub,
      color: "#333333",
    },
  ];

  // Data for the clocks
  const clocks = [
    { city: "Лос-Анджелес", timeZone: "America/Los_Angeles" },
    { city: "Москва", timeZone: "Europe/Moscow" },
    { city: "Берлин", timeZone: "Europe/Berlin" },
    { city: "Шанхай", timeZone: "Asia/Shanghai" },
  ];

  const linkStyle = {
    cursor: "pointer",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    transition: "color 0.2s ease",
    textDecoration: "none",
    color: "#2980b9",
  };

  const sectionStyle = {
    marginBottom: "2.5rem",
    padding: "1.5rem",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  };

  const h2Style = {
    fontSize: "1.6rem",
    fontWeight: "700",
    marginBottom: "1.25rem",
    color: "#2c3e50",
    borderBottom: "2px solid #ecf0f1",
    paddingBottom: "0.5rem",
  };

  const socialLinkStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1.25rem",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#34495e",
    transition: "all 0.3s ease",
    fontSize: "1rem",
    border: "1px solid #ecf0f1",
    backgroundColor: "#f9f9f9",
  };

  return (
    <div style={{ 
      fontFamily: "Ubuntu, sans-serif", 
      padding: "3rem 1rem", 
      maxWidth: "900px", 
      margin: "0 auto",
      background: "linear-gradient(to bottom, #f0f4f8, #ffffff)",
    }}>
      <h1 style={{ 
        fontSize: "2.5rem", 
        fontWeight: "700", 
        marginBottom: "2.5rem", 
        textAlign: "center",
        color: "#2c3e50",
        letterSpacing: "1px",
      }}>About Me</h1>

      {/* Portfolio Section - Improved with Thumbnail Grid */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Portfolio</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
        }}>
          {personalPhotos.map((photo, index) => (
            <a
              key={index}
              href={photo.src}
              target="_blank"
              rel="noopener noreferrer"
              title={photo.alt}
              style={{ display: "block" }}
            >
              <img
                src={photo.thumbnailSrc || photo.src} // Use thumbnail if available
                alt={photo.alt}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </a>
          ))}
        </div>
      </div>

      {/* Combined External Links & Social Media Section */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Links & Social Media</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {/* External Links Column */}
          <div style={{ flex: 1, minWidth: "250px" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", fontWeight: "600", color: "#34495e" }}>External Links</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {externalLinks.map((link, index) => {
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
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9f9f9";
                      e.currentTarget.style.color = "#34495e";
                      e.currentTarget.style.borderColor = "#ecf0f1";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Icon size={20} />
                    <span>{link.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Social Media Column */}
          <div style={{ flex: 1, minWidth: "250px" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", fontWeight: "600", color: "#34495e" }}>Social Media</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {socialMediaLinks.map((link, index) => {
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
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9f9f9";
                      e.currentTarget.style.color = "#34495e";
                      e.currentTarget.style.borderColor = "#ecf0f1";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Icon size={20} />
                    <span>{link.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Combined Tech Setup & Global Internet Table */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Tech Setup & Global Internet</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {/* Tech Setup Column */}
          <div style={{ flex: 1, minWidth: "250px" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", fontWeight: "600", color: "#34495e" }}>Tech Setup</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {techSetup.map((item, index) => (
                <li key={index} style={{ marginBottom: "0.75rem" }}>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#e74c3c")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#2980b9")}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Global Internet Column */}
          <div style={{ flex: 1, minWidth: "250px" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", fontWeight: "600", color: "#34495e" }}>Global Internet</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {globalInternet.map((item, index) => (
                <li key={index} style={{ marginBottom: "0.75rem" }}>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#e74c3c")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#2980b9")}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* --- CLOCK SECTION --- */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Local Times</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            gap: "1.5rem",
            flexWrap: "wrap",
            alignItems: "center",
            padding: "1.5rem 0",
          }}
        >
          {clocks.map((clock, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <AnalogClock timeZone={clock.timeZone} />
              <h3 style={{ marginTop: "1rem", fontWeight: "500", fontSize: "1.2rem", color: "#34495e" }}>
                {clock.city}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;