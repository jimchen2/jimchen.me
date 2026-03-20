import React, { useState, useEffect } from "react";

function Custom404() {
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
      textAlign: "center",
    },
    title: {
      fontSize: "2rem",
      margin: "0 0 2rem 0",
      whiteSpace: "pre",
      lineHeight: 1.2,
    },
    imageContainer: {
      width: "100%",
      maxWidth: "800px",
      // Removed border-radius and box-shadow for sharp edges (Rule 2)
    },
    image: {
      width: "100%",
      height: "auto",
      display: loading ? "none" : "block",
      // Removed transition for instant state changes (Rule 2)
    },
    loadingText: {
      padding: "40px",
      fontSize: "1.125rem",
      display: loading ? "block" : "none",
    },
    errorText: {
      padding: "40px",
      fontSize: "1.125rem",
    },
    message: {
      marginTop: "2rem",
      fontSize: "1.125rem",
      lineHeight: 1.5,
    },
    link: {
      display: "inline-block",
      marginTop: "1.5rem",
      fontSize: "1rem",
      // Rule 1: Removed custom color, background, hover states, padding, and text-decoration 
      // to rely purely on the browser's natural link styling.
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

export default Custom404;