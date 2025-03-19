export const generateCommonStyles = (colors) => `
  h1, h2, h3, p, code { color: ${colors.color_black}; }
  h1, h2 { font-size: 28px; font-weight: bold; line-height: 1.3; }
  h3 { font-size: 22px; font-weight: bold; line-height: 1.4; }
  p, code { font-size: 16px; line-height: 1.6; }

  details {
    background-color: ${colors.dark ? "#2c2f33" : "#ffffff"};
    border: 1px solid ${colors.dark ? "#4f545c" : "#e0e0e0"};
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    box-shadow: ${
      colors.dark
        ? "0 2px 5px rgba(0, 0, 0, 0.3)"
        : "0 2px 5px rgba(0, 0, 0, 0.1)"
    };
    transition: background-color 0.3s ease, border 0.3s ease;
  }

  summary {
    font-weight: bold;
    cursor: pointer;
    color: ${colors.dark ? "#ffffff" : "#000000"};
    display: flex;
    align-items: center;
  }

  details[open] summary::after, details:not([open]) summary::after {
    margin-left: auto;
    content: "${colors.dark ? "\\25B2" : "\\25BC"}";
    font-size: 12px;
    color: ${colors.dark ? "#ffffff" : "#000000"};
  }

  details[open] summary::after {
    content: "${colors.dark ? "\\25BC" : "\\25B2"}";
  }

  code {
    font-family: 'Fira Code', monospace;
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
    font-family: 'Fira Code', monospace;
    font-size: 90%;
    margin-bottom: 15px;
  }
`;

export const generateThemeStyles = (colors) => `
  code, pre { background-color: ${colors.dark ? "#2c2f33" : "#f4f4f4"}; }
  code { font-family: 'Fira Code', monospace; }
`;

export function generateAdditionalStyles(colors) {
  return `
    .blog-content img { max-width: 100%; height: auto; border-radius: 8px; }
    .blog-content iframe { width: 80%; border: none; }
    .blog-content a { color: ${
      colors.color_blue_2
    }; text-decoration: none; border-bottom: 2px solid ${
    colors.color_blue_2
  }; transition: color 0.3s ease, border-bottom-color 0.3s ease; }
    .blog-content p { color: ${colors.color_black}; margin-bottom: 1.5em; }
    ${colors.grayscale ? ".blog-content { filter: grayscale(100%); }" : ""}

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
      background-color: ${colors.color_green || '#28a745'};
      color: #ffffff;
      border-radius: 4px;
    }
  `;
}