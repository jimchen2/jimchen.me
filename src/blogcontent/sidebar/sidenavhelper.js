import { Card } from "react-bootstrap";
import { paddingtop, useGlobalColorScheme } from "@/config/global";

export const scrollToElementWithOffset = (id, offset) => {
  const element = document.getElementById(id);
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  } else {
    console.error(`No element with id '${id}' was found.`);
  }
};

export function CustomToggle({ children, eventKey, hasChildren, setActiveKey, isActive }) {
  const { colors } = useGlobalColorScheme();

  const onClick = () => {
    setActiveKey(isActive ? null : eventKey); // Toggle active state
    scrollToElementWithOffset(eventKey, -paddingtop + 15);
  };

  const activeStyle = isActive ? { backgroundColor: colors.color_blue, color: colors.color_white } : { backgroundColor: colors.color_white, color: colors.color_blue };

  return (
    <Card.Header onClick={onClick} style={{ cursor: "pointer", ...activeStyle }}>
      <span
        style={{
          fontWeight: 500,
          textDecoration: "none",
          wordWrap: "break-word", // Add this line
          whiteSpace: "normal", // And this line
          overflowY: "auto",
        }}
      >
        {children}
      </span>
    </Card.Header>
  );
}

export const formatTextWithNewLines = (text, maxLineLength = 25) => {
  const words = text.split(" ");
  let formattedText = [];
  let currentLine = "";
  let currentLineLength = 0;

  words.forEach((word) => {
    if (currentLineLength + word.length > maxLineLength) {
      formattedText.push(currentLine);
      formattedText.push(<br />); // Insert JSX line break
      currentLine = "";
      currentLineLength = 0;
    }

    currentLine += (currentLineLength > 0 ? " " : "") + word;
    currentLineLength += word.length + 1; // Account for the space
  });

  if (currentLine) {
    formattedText.push(currentLine); // Add the last line if any
  }

  return formattedText;
};
