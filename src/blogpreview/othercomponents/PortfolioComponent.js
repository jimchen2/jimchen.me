// PortfolioComponent.js

import React from "react";
import { useTranslation } from "next-i18next";

function PortfolioComponent() {
  const { t } = useTranslation("common");

  // Define personal photo links
  const personalPhotos = [
    {
      src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/1.jpeg",
      alt: t("portfolio.photo1_alt"),
    },
    {
      src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/2.JPEG",
      alt: t("portfolio.photo2_alt"),
    },
    {
      src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/3.JPEG",
      alt: t("portfolio.photo3_alt"),
    },
    {
      src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/4.JPEG",
      alt: t("portfolio.photo4_alt"),
    },
    {
      src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/5.JPEG",
      alt: t("portfolio.photo5_alt"),
    },
    {
      src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/6.jpg",
      alt: t("portfolio.photo6_alt"),
    },
  ];

  const linkStyle = {
    cursor: "pointer",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    transition: "color 0.2s",
    textDecoration: "underline",
  };

  return (
    <div style={{ fontFamily: "Ubuntu, sans-serif" }}>
      <div style={{ marginBottom: "1rem", width: "100%" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            paddingLeft: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          {t("portfolio.title")}
        </h3>
        
        {/* Container for the personal photos */}
        <div style={{ padding: "0 1rem" }}>
          {/* First photo with small thumbnail */}
          <div style={{ marginBottom: "0.5rem" }}>
            <a
              href={personalPhotos[0].src}
              target="_blank"
              rel="noopener noreferrer"
              title={personalPhotos[0].alt}
              style={{
                display: "inline-block",
              }}
            >
              <img
                src={personalPhotos[0].src}
                alt={personalPhotos[0].alt}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            </a>
          </div>

          {/* All photos as inline links */}
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "0.2rem 0.5rem",
            fontSize: "0.9rem",
            lineHeight: "1.5",
          }}>
            {personalPhotos.map((photo, index) => (
              <React.Fragment key={index}>
                <a
                  href={photo.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={photo.alt}
                  style={linkStyle}
                >
                  {t(`portfolio.photo${index + 1}_name`)}
                </a>
                {index < personalPhotos.length - 1 && <span aria-hidden="true">/</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioComponent;