import React from "react";

function PortfolioComponent() {
  // Define personal photo links
  const personalPhotos = [
    {
      src: "https://pub-0be4bc99725a45ac9b3be7ebcdc45895.r2.dev/portfolio/1.jpeg",
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
          Portfolio
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
                  Photo {index + 1}
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
