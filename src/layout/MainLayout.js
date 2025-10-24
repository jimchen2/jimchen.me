import React, { useState, useEffect } from "react";
import styles from "./MainLayout.module.css";
import Sidebar from "@/layout/sidebar";
import NavigationBar from "./navbar";

const useIsMobile = (breakpoint = 1000) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
};


const MainLayout = ({ children, showSidebar = true }) => {
  const isMobile = useIsMobile();

  return (
    <div className={styles.layoutContainer}>
      <NavigationBar />
      
      <div className={styles.mainContentWrapper}>
        
        {/* --- MODIFICATION HERE --- */}
        {/* Apply a different class when the sidebar is hidden */}
        <main 
          className={
            showSidebar && !isMobile 
              ? styles.pageContent 
              : styles.pageContentFullWidth
          }
        >
          {children}
        </main>
        {/* --- END MODIFICATION --- */}

        {showSidebar && !isMobile && (
          <aside className={styles.sidebarContainer}>
            <Sidebar />
          </aside>
        )}
      </div>

      {showSidebar && isMobile && (
        <div className={styles.mobileSidebarContainer}>
          <Sidebar />
        </div>
      )}
    </div>
  );
};

export default MainLayout;