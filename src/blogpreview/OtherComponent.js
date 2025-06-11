// OtherComponent.js (The new container component)

import React from "react";
import TypeComponent from "./TypeComponent"; // Assuming it's in the same folder
import AboutComponent from "./AboutComponent"; // Assuming it's in the same folder

/**
 * A container component that displays post filtering tags followed by about/contact links.
 * It passes its props down to the TypeComponent for filtering logic.
 */
const OtherComponent = (props) => {
  return (
    <div>
      {/* The TypeComponent handles all the tag filtering logic */}
      <TypeComponent {...props} />

      {/* The AboutComponent displays static contact and website links */}
      <AboutComponent />
    </div>
  );
};

export default OtherComponent;