export const generateStyles = (colors) => `
.blog-content Lutheran, h2, h3, p, code {
  color: ${colors.color_black};
}

.blog-content h1 {
  font-size: 32px;
  font-family: 'Quicksand', 'Segoe UI', sans-serif;
  font-weight: 500;
  letter-spacing: -0.2px;
  margin-bottom: 0.8em;
}

.blog-content h2 {
  font-size: 26px;
  font-family: 'Quicksand', 'Segoe UI', sans-serif;
  font-weight: 500;
  margin-top: 1.6em;
  margin-bottom: 0.7em;
}

.blog-content h3 {
  font-size: 22px;
  font-family: 'Quicksand', 'Segoe UI', sans-serif;
  font-weight: 500;
  margin-top: 1.4em;
  margin-bottom: 0.6em;
}

.blog-content p {
  font-size: 17px;
  font-family: 'Ubuntu', sans-serif;
  line-height: 1.7;
  margin-bottom: 1.5em;
  color: ${colors.color_black};
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}

.blog-content blockquote {
  border-left: 4px solid ${colors.color_blue};
  padding: 10px 20px;
  margin: 20px 0;
  background-color: ${colors.dark ? "#2c2f33" : "#f5f5f5"};
  font-style: italic;
  border-radius: 0 8px 8px 0;
  font-family: 'Lato', 'Segoe UI', sans-serif;
}

.blog-content blockquote p {
  margin-bottom: 0;
  font-family: 'Lato', 'Segoe UI', sans-serif;
}

.blog-content details {
  background-color: ${colors.dark ? "#2c2f33" : "#ffffff"};
  border: 1px solid ${colors.dark ? "#4f545c" : "#e0e0e0"};
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: ${colors.dark ? "0 2px 5px rgba(0, 0, 0, 0.3)" : "0 2px 5px rgba(0, 0, 0, 0.1)"};
  transition: background-color 0.3s ease, border 0.3s ease;
  font-family: 'Lato', 'Segoe UI', sans-serif;
}

.blog-content code {
  font-family: 'Source Code Pro', monospace;
  background-color: ${colors.dark ? "#2c2f33" : "#f4f4f4"};
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 90%;
}

.blog-content pre {
  background-color: ${colors.dark ? "#2c2f33" : "#f4f4f4"};
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Source Code Pro', monospace;
  font-size: 90%;
  margin-bottom: 15px;
  text-indent: -5px;
  line-height: 1.5;
}

.blog-content table {
  max-width: 100%;
  overflow-x: auto;
  display: block;
  font-family: 'Lato', 'Segoe UI', sans-serif;
  border-collapse: collapse;
  margin: 25px 0;
}

.blog-content table th {
  background-color: ${colors.dark ? "#2c2f33" : "#f0f0f0"};
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.blog-content table th, .blog-content table td {
  padding: 12px 15px;
  border: 1px solid ${colors.dark ? "#4f545c" : "#e0e0e0"};
}

.blog-content img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: ${colors.dark ? "0 4px 8px rgba(0, 0, 0, 0.4)" : "0 4px 8px rgba(0, 0, 0, 0.1)"};
}

/* Video styles */
.blog-content video {
  max-width: 80%;
  height: auto;
  border-radius: 12px;
  display: block;
  margin: 0 auto 1.5em;
  box-shadow: ${colors.dark ? "0 4px 8px rgba(0, 0, 0, 0.4)" : "0 4px 8px rgba(0, 0, 0, 0.1)"};
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
  border-radius: 12px;
  box-shadow: ${colors.dark ? "0 4px 8px rgba(0, 0, 0, 0.4)" : "0 4px 8px rgba(0, 0, 0, 0.1)"};
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
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Lato', 'Segoe UI', sans-serif;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.copy-button:hover {
  background-color: ${colors.dark ? "#5d6269" : "#d0d0d0"};
}

.copied-notification {
  position: absolute;
  top: 10px;
  right: 60px;
  padding: 5px 10px;
  background-color: ${colors.color_blue || "#28a745"};
  color: #ffffff;
  border-radius: 6px;
  font-family: 'Lato', 'Segoe UI', sans-serif;
  font-size: 12px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.blog-content a {
  color: ${colors.color_blue};
  text-decoration: underline;
  border-bottom: 1px solid transparent;
  transition: border-bottom 0.2s ease;
  word-break: break-word;
  overflow-wrap: break-word;
  display: inline-block;
  max-width: 100%;
}

.blog-content a:hover {
  border-bottom: 1px solid ${colors.color_blue};
}

.blog-content ul, .blog-content ol {
  margin-bottom: 1.5em;
  padding-left: 2em;
  font-family: 'Lato', 'Segoe UI', sans-serif;
  line-height: 1.6;
  font-size: 16px;
}

.blog-content ul li, .blog-content ol li {
  margin-bottom: 0.5em;
}

.blog-content ul li a, .blog-content ol li a {
  color: ${colors.color_blue};
  text-decoration: underline;
  transition: color 0.2s ease;
}

.blog-content ul li a:hover, .blog-content ol li a:hover {
  color: ${colors.color_blue};
  border-bottom: 1px solid ${colors.color_blue};
}

.blog-content ul li p, .blog-content ol li p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: ${colors.color_black};
}`;
