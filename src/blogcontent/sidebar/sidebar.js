import React from "react";
import { Accordion, Card, Col } from "react-bootstrap";
import { paddingtop, useGlobalColorScheme } from "@/config/global";
import { useAddItemToNavbar } from "./sidebaritem";

const SideNav = () => {
  const [activeKey, setActiveKey] = React.useState(null);
  const { colors } = useGlobalColorScheme();

  const tocItems = useAddItemToNavbar(setActiveKey);

  const cardHeaderStyle = {
    wordWrap: "break-word",
    whiteSpace: "normal",
    cursor: "pointer",
  };

  return (
    <Col
      lg={2.5}
      xl={2.5}
      style={{
        position: "fixed",
        top: `${paddingtop}px`,
        left: "50px",
        height: "100vh",
        overflowY: "auto",
        padding: "10px",
        boxSizing: "border-box",
        paddingBottom: "150px",
      }}
    >
      <Accordion activeKey={activeKey}>
        {tocItems.map((item, index) => (
          <Card key={`card-${item.key}-${index}`} style={{ backgroundColor: colors.color_white }}>
            {React.cloneElement(item.content, {
              key: `content-${item.key}-${index}`,
              hasChildren: item.hasChildren,
              setActiveKey: setActiveKey,
              isActive: activeKey === item.key,
              style: cardHeaderStyle,
            })}
            {item.hasChildren && (
              <Accordion.Collapse eventKey={item.key} key={`collapse-${item.key}-${index}`}>
                <Card.Body key={`body-${item.key}-${index}`}>
                  {React.Children.map(item.children, (child, childIndex) =>
                    React.cloneElement(child, {
                      key: `child-${item.key}-${childIndex}`,
                    })
                  )}
                </Card.Body>
              </Accordion.Collapse>
            )}
          </Card>
        ))}
      </Accordion>
    </Col>
  );
};

export { SideNav };
