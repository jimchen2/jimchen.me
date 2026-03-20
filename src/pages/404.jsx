import React, { useState, useEffect } from "react";

function Custom404() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://picsum.photos/800/600")
      .then((r) => {
        setImageUrl(r.url);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load image");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "20px", textAlign: "center" }}>
      <pre style={{ fontSize: "2rem", margin: "0 0 2rem 0", whiteSpace: "pre", lineHeight: 1.2 }}>{`
       _  _    ___    _  _   
      | || |  / _ \\  | || |  
      | || |_| | | | | || |_ 
      |__   _| | | | |__   _|
         | | | |_| |    | |  
         |_|  \\___/     |_|  
  `}</pre>

      <div style={{ width: "100%", maxWidth: "800px" }}>
        {loading && <div style={{ padding: "40px", fontSize: "1.125rem" }}>Loading a random image...</div>}
        {error && <div style={{ padding: "40px", fontSize: "1.125rem" }}>{error}</div>}
        {!loading && !error && <img src={imageUrl} alt="Random 404 image" style={{ width: "100%", height: "auto" }} />}
      </div>
      <br />

      <a href="/">Return to Home</a>
    </div>
  );
}

export default Custom404;
