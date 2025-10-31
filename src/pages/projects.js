import React from "react";
import { CardGroup, Card } from "react-bootstrap";
import projectData from "@/static/ProjectContent.js";
import { useGlobalColorScheme } from "@/config/config.js";

function Projects() {
  const { colors } = useGlobalColorScheme();
  
  const cardStyle = {
    minWidth: "30%",
    maxWidth: `max(30%, 300px)`,
  };

  const linkStyle = {
    color: colors.color_blue_2,
    display: "block",
  };

  return (
    <div>
      <br />
      <br />
      <br />

      <CardGroup>
        {projectData.map((project, index) => (
          <Card
            key={index}
            style={{
              ...cardStyle,
              marginLeft: "30px",
              marginTop: "30px",
              filter: colors.grayscale ? "grayscale(100%)" : "none",
            }}
          >
            <Card.Body style={{ backgroundColor: colors.color_white }}>
              <Card.Title style={{ color: colors.color_blue_2 }}>
                {project.title}
              </Card.Title>

              <Card.Text style={{ color: colors.color_black }}>
                <div>{project.time}</div>

                {project.language && (
                  <div style={linkStyle}>Language: {project.language}</div>
                )}
                {project.sourceCode && (
                  <a href={project.sourceCode} style={linkStyle}>
                    Source Code
                  </a>
                )}
                {project.docs && (
                  <a href={project.docs} style={linkStyle}>
                    Read Docs
                  </a>
                )}
                {project.demo && (
                  <a href={project.demo} style={linkStyle}>
                    Live Demo
                  </a>
                )}

                {[...Array(
                  4 -
                    [
                      project.language,
                      project.sourceCode,
                      project.docs,
                      project.demo,
                    ].filter(Boolean).length
                )].map((_, i) => (
                  <br key={i} />
                ))}

                <div
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </CardGroup>
      <br />
      <br />
      <br />
    </div>
  );
}

export default Projects;