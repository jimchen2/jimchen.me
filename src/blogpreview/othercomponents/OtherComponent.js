// components/OtherComponent.js

import React from "react";
import TypeComponent from "./TypeComponent";
import AboutComponent from "./AboutComponent";
import SortComponent from "./SortComponent";
import SearchComponent from "./SearchComponent";
import ThemeComponent from "./ThemeComponent"; // 1. Import the new ThemeComponent
import PortfolioComponent from "./PortfolioComponent";

const OtherComponent = (props) => {
  return (
    <div>
      <SearchComponent />

      <TypeComponent {...props} />
      <SortComponent />
      <ThemeComponent />

      <AboutComponent />
      <PortfolioComponent />
    </div>
  );
};

export default OtherComponent;
