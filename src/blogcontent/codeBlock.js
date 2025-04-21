import React, { useState } from "react";

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide the message after 2 seconds
  };

  return (
    <div className="code-block">
      <pre>
        <code>{code}</code>
      </pre>
      <button className="copy-button" onClick={handleCopy}>
        Copy
      </button>
      {copied && <span className="copied-notification">Copied!</span>}
    </div>
  );
}

export default CodeBlock;
