import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

const THEME_COOKIE_KEY = "themeMode";
const DEFAULT_THEME = "light";
const THEMES = ["light", "dark", "brutalist"];

export const useColorScheme = () => {
  const [themeMode, setThemeMode] = useState(DEFAULT_THEME);
  const [isHydrated, setIsHydrated] = useState(false);
  const [darkReader, setDarkReader] = useState(null);

  useEffect(() => {
    const savedTheme = Cookies.get(THEME_COOKIE_KEY);
    if (THEMES.includes(savedTheme)) setThemeMode(savedTheme);
    setIsHydrated(true);

    let cancelled = false;
    import("darkreader")
      .then((module) => {
        if (!cancelled) setDarkReader(module);
      })
      .catch((err) => console.error("Failed to load DarkReader dynamically:", err));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    document.documentElement.dataset.theme = themeMode;
    return () => { delete document.documentElement.dataset.theme; };
  }, [themeMode, isHydrated]);

  useEffect(() => {
    if (!isHydrated || !darkReader) return;
    if (themeMode === "dark") {
      darkReader.enable({ brightness: 100, contrast: 90, sepia: 10 });
      return () => darkReader.disable();
    }
    darkReader.disable();
  }, [themeMode, isHydrated, darkReader]);

  const changeThemeMode = useCallback((mode) => {
    if (!THEMES.includes(mode)) return;
    setThemeMode(mode);
    Cookies.set(THEME_COOKIE_KEY, mode, { expires: 365 });
  }, []);

  return { themeMode, changeThemeMode, isHydrated };
};

const ColorSchemeContext = createContext(undefined);

export const ColorSchemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useGlobalColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error("useGlobalColorScheme must be used within a ColorSchemeProvider");
  }
  return context;
};
