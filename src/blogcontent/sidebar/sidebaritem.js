import { useEffect, useState } from 'react';
import { CustomToggle } from "./sidenavhelper";
import { paddingtop, useGlobalColorScheme } from "@/config/global";
import { scrollToElementWithOffset, formatTextWithNewLines } from "./sidenavhelper";

export const useAddItemToNavbar = (setActiveKey) => {
  const { colors } = useGlobalColorScheme();
  const [tocItems, setTocItems] = useState([]);

  useEffect(() => {
    const headers = Array.from(document.querySelectorAll("h2, h3"));
    let newTocItems = [];
    let lastH2Key = null;
    let isFirstH2 = true; // Flag to check for the first H2

    headers.forEach((header) => {
      const id = header.getAttribute("id");
      let tocText = header.textContent;
      tocText = formatTextWithNewLines(tocText, 25); // Format the text

      const isH2 = header.tagName === "H2";

      if (isH2) {
        if (isFirstH2) {
          isFirstH2 = false; // Skip the first H2
          return;
        }
        lastH2Key = id;
        newTocItems.push({
          key: id,
          content: (
            <CustomToggle
              eventKey={id}
              hasChildren={false}
              setActiveKey={setActiveKey}
            >
              {tocText}
            </CustomToggle>
          ),
          children: [],
        });
      } else if (lastH2Key) {
        newTocItems
          .find((item) => item.key === lastH2Key)
          .children.push(
            <div
              onClick={() => scrollToElementWithOffset(id, -paddingtop + 15)}
              style={{
                paddingLeft: "1rem",
                textDecoration: "none",
                cursor: "pointer",
                color: colors.color_blue,
                backgroundColor: colors.color_white,
                wordWrap: "break-word",
                whiteSpace: "normal",
                overflowY: "auto",
              }}
            >
              {tocText}
            </div>
          );
        newTocItems.find((item) => item.key === lastH2Key).hasChildren = true;
      }
    });

    setTocItems(newTocItems);
  }, [setActiveKey, colors]); // Dependency array

  return tocItems;
};