import React from "react";
import TypeComponent from "./TypeComponent"; // Assuming it's in the same folder
import AboutComponent from "./AboutComponent"; // Assuming it's in the same folder
import SortComponent from "./SortComponent";

const OtherComponent = (props) => {
  return (
    <div>
      {/* The TypeComponent handles all the tag filtering logic */}
      <TypeComponent {...props} />
      <SortComponent />
      <AboutComponent />
    </div>
  );
};

export default OtherComponent;
