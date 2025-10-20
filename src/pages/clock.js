import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// --- Data for this page ---
const cities = [
  { name: "Лос-Анджелес", timezone: "America/Los_Angeles" },
  { name: "Шанхай", timezone: "Asia/Shanghai" },
  { name: "Москва", timezone: "Europe/Moscow" },
  { name: "Берлин", timezone: "Europe/Berlin" },
];

function AnalogClock({ timezone, cityName }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get time in the specific timezone
  const timeString = time.toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  // Calculate angles
  const secondAngle = seconds * 6 - 90;
  const minuteAngle = minutes * 6 + seconds * 0.1 - 90;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5 - 90;

  const size = 160;
  const center = size / 2;
  const clockRadius = size * 0.42;

  return (
    <div style={{ textAlign: "center", padding: "10px" }}>
      {/* Clock */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <svg width={size} height={size} style={{ display: "block" }}>
          {/* Clock face with gradient */}
          <defs>
            <linearGradient id={`grad-${timezone}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#f8f9fa", stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          <circle
            cx={center}
            cy={center}
            r={clockRadius}
            fill={`url(#grad-${timezone})`}
            stroke="#e0e6ed"
            strokeWidth="3"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
          />

          {/* Hour markers */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const isMainHour = i % 3 === 0;
            const markerLength = isMainHour ? 10 : 6;
            const markerWidth = isMainHour ? 2.5 : 1.5;
            const startRadius = clockRadius - markerLength;

            return (
              <line
                key={i}
                x1={center + startRadius * Math.cos(angle)}
                y1={center + startRadius * Math.sin(angle)}
                x2={center + clockRadius * Math.cos(angle)}
                y2={center + clockRadius * Math.sin(angle)}
                stroke="#cbd5e0"
                strokeWidth={markerWidth}
                strokeLinecap="round"
              />
            );
          })}

          {/* Hour hand */}
          <line
            x1={center}
            y1={center}
            x2={center + clockRadius * 0.5 * Math.cos((hourAngle * Math.PI) / 180)}
            y2={center + clockRadius * 0.5 * Math.sin((hourAngle * Math.PI) / 180)}
            stroke="#2c3e50"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Minute hand */}
          <line
            x1={center}
            y1={center}
            x2={center + clockRadius * 0.7 * Math.cos((minuteAngle * Math.PI) / 180)}
            y2={center + clockRadius * 0.7 * Math.sin((minuteAngle * Math.PI) / 180)}
            stroke="#34495e"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Second hand */}
          <line
            x1={center}
            y1={center}
            x2={center + clockRadius * 0.75 * Math.cos((secondAngle * Math.PI) / 180)}
            y2={center + clockRadius * 0.75 * Math.sin((secondAngle * Math.PI) / 180)}
            stroke="#e74c3c"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Center dot */}
          <circle cx={center} cy={center} r="5" fill="#2c3e50" />
          <circle cx={center} cy={center} r="3" fill="#e74c3c" />
        </svg>
      </div>

      {/* City name below clock */}
      <h5
        style={{
          color: "#2c3e50",
          fontWeight: "600",
          marginTop: "15px",
          fontSize: "1.1rem",
        }}
      >
        {cityName}
      </h5>
    </div>
  );
}

function ClockPage() {
  return (
    <Container
      style={{
        fontFamily: "Ubuntu, sans-serif",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "40px",
        maxWidth: "800px",
      }}
    >
      <Row className="justify-content-center g-4">
        {cities.map((city, index) => (
          <Col xs={6} sm={6} md={3} key={index} className="d-flex justify-content-center">
            <AnalogClock timezone={city.timezone} cityName={city.name} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ClockPage;