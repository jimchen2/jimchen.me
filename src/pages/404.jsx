import React, { useState, useEffect } from "react";

function Page404() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const response = await fetch("https://picsum.photos/800/600");
        setImageUrl(response.url);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching random image:", err);
        setError("Failed to load image");
        setLoading(false);
      }
    };

    fetchRandomImage();
  }, []);

  const asciiArt404 = `
       _  _    ___    _  _   
      | || |  / _ \\  | || |  
      | || |_| | | | | || |_ 
      |__   _| | | | |__   _|
         | | | |_| |    | |  
         |_|  \\___/     |_|  
  `;

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
      backgroundColor: "#f7f7f7",
      fontFamily: "'Courier New', Courier, monospace",
      textAlign: "center",
    },
    title: {
      fontSize: "2rem",
      margin: "0 0 2rem 0",
      whiteSpace: "pre",
      lineHeight: 1.2,
      color: "#333",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
    },
    imageContainer: {
      width: "100%",
      maxWidth: "800px",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      backgroundColor: "#fff",
    },
    image: {
      width: "100%",
      height: "auto",
      display: loading ? "none" : "block",
      transition: "opacity 0.3s ease-in",
      opacity: loading ? 0 : 1,
    },
    loadingText: {
      padding: "40px",
      backgroundColor: "#e0e0e0",
      fontSize: "1.125rem",
      fontWeight: "600",
      color: "#555",
      display: loading ? "block" : "none",
    },
    errorText: {
      padding: "40px",
      fontSize: "1.125rem",
      color: "#dc3545",
      fontWeight: "500",
    },
    message: {
      marginTop: "2rem",
      fontSize: "1.125rem",
      color: "#666",
      lineHeight: 1.5,
    },
    link: {
      display: "inline-block",
      marginTop: "1.5rem",
      padding: "0.75rem 1.5rem",
      backgroundColor: "#007bff",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "4px",
      fontSize: "1rem",
      fontWeight: "500",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      ":hover": {
        backgroundColor: "#0056b3",
        transform: "translateY(-2px)",
      },
    },
  };

  return (
    <div style={styles.container}>
      <br />
      <br />

      <pre style={styles.title}>{asciiArt404}</pre>

      <div style={styles.imageContainer}>
        {loading && <div style={styles.loadingText}>Loading a random image...</div>}
        {error && <div style={styles.errorText}>{error}</div>}
        {!loading && !error && <img src={imageUrl} alt="Random 404 image" style={styles.image} />}
      </div>

      <p style={styles.message}>Oops! Looks like you're lost in the digital wilderness.</p>
      <a href="/" style={styles.link}>
        Return to Home
      </a>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default Page404;
