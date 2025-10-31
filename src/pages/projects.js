// Projects.js
import React from "react";
import projectData from "@/static/ProjectContent.js";

function Projects() {
  const containerStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 20px",
  };

  const projectStyle = {
    marginBottom: "40px",
    paddingBottom: "40px",
    borderBottom: "2px solid #d0d0d0",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0052a3",
    marginBottom: "8px",
  };

  const timeStyle = {
    fontSize: "14px",
    color: "#555",
    fontWeight: "500",
    marginBottom: "12px",
  };

  const descriptionStyle = {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#1a1a1a",
    fontWeight: "400",
  };

  return (
    <div style={containerStyle}>
      {projectData.map((project, index) => (
        <div key={index} style={projectStyle}>
          <h2 style={titleStyle}>{project.title}</h2>
          
          <div style={timeStyle}>{project.time}</div>

          <div
            style={descriptionStyle}
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        </div>
      ))}
    </div>
  );
}

export default Projects;