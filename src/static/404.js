import React from "react";

function Page404() {
  const asciiArt404 = `
       _  _    ___    _  _   
      | || |  / _ \\  | || |  
      | || |_| | | | | || |_ 
      |__   _| | | | |__   _|
         | | | |_| |    | |  
         |_|  \\___/     |_|  
                        
      Error 404: Page Not Found
      
      Well hello there, you sexy thing!
      Looks like you've stumbled upon a page that's playing hard to get.
      But don't worry, we find your curiosity incredibly attractive!
      While we're trying to locate this elusive URL, why not try some of these flirty activities:

      1. Wink at your screen and see if the 404 page winks back.
      2. Whisper sweet nothings to your keyboard (we promise we won't judge!).
      3. Take a moment to appreciate your own irresistible charm in the screen's reflection.
      4. Leave a seductive note for the missing page, inviting it to come back soon.

      Remember, darling, sometimes the most alluring things in life are the ones you can't quite reach.
      But don't let that stop you from exploring and enjoying the journey!
      Stay curious, stay sexy, and keep clicking!
  `;

  const styles = {
    container: {
      fontFamily: "Georgia, serif",
      fontSize: "1.2em",
      lineHeight: "1.6",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "40px",
      backgroundColor: "#f8f1f1",
      color: "#333",
      borderRadius: "10px",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "3em",
      fontWeight: "bold",
      marginBottom: "30px",
      textAlign: "center",
      color: "#ff4081",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
    },
    activities: {
      marginTop: "30px",
      paddingLeft: "30px",
    },
    activityItem: {
      marginBottom: "15px",
    },
  };

  return (
    <div style={styles.container}>
      <pre style={styles.title}>{asciiArt404}</pre>
      <div style={styles.activities}>
        <div style={styles.activityItem}>
          1. Wink at your screen and see if the 404 page winks back.
        </div>
        <div style={styles.activityItem}>
          2. Whisper sweet nothings to your keyboard (we promise we won't
          judge!).
        </div>
        <div style={styles.activityItem}>
          3. Take a moment to appreciate your own irresistible charm in the
          screen's reflection.
        </div>
        <div style={styles.activityItem}>
          4. Leave a seductive note for the missing page, inviting it to come
          back soon.
        </div>
      </div>
    </div>
  );
}

export default Page404;
