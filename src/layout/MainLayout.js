import React from "react";

import styles from "./MainLayout.module.css";
import NavigationBar from "./navbar";

const MainLayout = ({ children }) => (
  <div className={styles.layoutContainer}>
    <a className="skip-link" href="#main">
      Skip to content
    </a>

    <NavigationBar />

    <div className={styles.mainContentWrapper}>
      <main id="main" className={styles.pageContentFullWidth}>
        {children}
      </main>
    </div>
  </div>
);

export default MainLayout;
