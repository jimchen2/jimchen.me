// components/OtherComponent.js

import React from "react";
import LanguageComponent from "./LanguageComponent";
import TypeComponent from "./TypeComponent";
import AboutComponent from "./AboutComponent";
import PortfolioComponent from "./PortfolioComponent"; // Import PortfolioComponent
import SortComponent from "./SortComponent";
import SearchComponent from "./SearchComponent";
import ThemeComponent from "./ThemeComponent";
import LatestCommentComponent from "./LatestCommentComponent";

const OtherComponent = (props) => {
  return (
    <div>
      <SearchComponent />

      <LanguageComponent />

      <TypeComponent {...props} />
      <SortComponent />
      <ThemeComponent />

      <AboutComponent />
      <PortfolioComponent /> {/* Add PortfolioComponent after AboutComponent */}
      <LatestCommentComponent />
    </div>
  );
};

export default OtherComponent;