import React from "react";
import styles from "./MainLayout.module.css";
import NavigationBar from "./navbar";

const MainLayout = ({ children, showSidebar = true }) => {
  return (
    <div className={styles.layoutContainer}>
      <NavigationBar />

      <div className={styles.mainContentWrapper}>
        <main className={styles.pageContentFullWidth}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;