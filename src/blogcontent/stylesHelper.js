export const generateStyles = (colors) => `
  h1, h2, h3, p, code {
    color: ${colors.color_black};

  }

  h1, h2 {
    font-size: 28px;
    line-height: 1.3;
    font-family:  Arial, sans-serif;

  }

  h3 {
    font-size: 22px;
    line-height: 1.4;
    font-family: Arial, sans-serif;
  }

  p, code {
    font-size: 16px;
    line-height: 1.6;
  }

  details {
    background-color: ${colors.dark ? "#2c2f33" : "#ffffff"};
    border: 1px solid ${colors.dark ? "#4f545c" : "#e0e0e0"};
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    box-shadow: ${colors.dark ? "0 2px 5px rgba(0, 0, 0, 0.3)" : "0 2px 5px rgba(0, 0, 0, 0.1)"};
    transition: background-color 0.3s ease, border 0.3s ease;
  }

  code {
    font-family: 'Source Code Pro', monospace;
    background-color: ${colors.dark ? "#2c2f33" : "#f4f4f4"};
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 90%;
  }

  pre {
    background-color: ${colors.dark ? "#2c2f33" : "#f4f4f4"};
    padding: 10px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Sourcd Code Pro', monospace;
    font-size: 90%;
    margin-bottom: 15px;
    text-indent: -5px;
  }
  .blog-content img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }

  /* Video styles */
  .blog-content video {
    max-width: 80%;
    height: auto;
    border-radius: 8px;
    display: block;
    margin: 0 auto 1.5em;
  }

  /* Video wrapper for better responsiveness */
  .blog-content .video-wrapper {
    position: relative;
    width: 80%;
    margin: 0 auto 1.5em;
  }
  /* Hide figcaption or other caption elements */
  .blog-content figcaption {
    display: none;
  }


  .blog-content iframe {
    width: 80%;
    border: none;
  }
  .blog-content p {
    color: ${colors.color_black};
    margin-bottom: 1.5em;
  }
  .code-block {
    position: relative;
  }

  .copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px 10px;
    background-color: ${colors.dark ? "#4f545c" : "#e0e0e0"};
    color: ${colors.dark ? "#ffffff" : "#000000"};
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .copied-notification {
    position: absolute;
    top: 10px;
    right: 60px;
    padding: 5px 10px;
    background-color: ${colors.color_blue || "#28a745"};
    color: #ffffff;
    border-radius: 4px;
  }`;
