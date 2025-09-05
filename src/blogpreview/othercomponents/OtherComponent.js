// components/OtherComponent.js

import React from "react";
import LanguageComponent from "./LanguageComponent"; // 1. Import the new LanguageComponent
import TypeComponent from "./TypeComponent";
import AboutComponent from "./AboutComponent";
import SortComponent from "./SortComponent";
import SearchComponent from "./SearchComponent";
import ThemeComponent from "./ThemeComponent";
import LatestCommentComponent from "./LatestCommentComponent";

const OtherComponent = (props) => {
  return (
    <div>
      <SearchComponent />

      <LanguageComponent /> {/* 2. Add the component here, above TypeComponent */}

      <TypeComponent {...props} />
      <SortComponent />
      <ThemeComponent />

      <AboutComponent />
      <LatestCommentComponent />
    </div>
  );
};

export default OtherComponent;