import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Cookies from "js-cookie";

// --- Theme Management with DarkReader ---
const THEME_COOKIE_KEY = "themeMode";
const DEFAULT_THEME = "light"; // 'light' or 'dark'

const readCookieTheme = () => {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const saved = Cookies.get(THEME_COOKIE_KEY);
    return saved === "dark" || saved === "light" ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

export const useColorScheme = () => {
  // Read the cookie synchronously on the client so the switcher and the
  // navbar render the right theme on the very first client paint.
  const [themeMode, setThemeMode] = useState(readCookieTheme);
  const [isHydrated, setIsHydrated] = useState(false);

  // Refs to store DarkReader functions once loaded
  const darkReaderFunctionsRef = useRef({ enable: null, disable: null });
  const [darkReaderLoaded, setDarkReaderLoaded] = useState(false);

  // Keep a CSS hook in sync so global styles can react before DarkReader
  // finishes loading (avoids a white flash on dark-mode reloads).
  useEffect(() => {
    if (typeof document !== "undefined" && themeMode) {
      document.documentElement.setAttribute("data-theme", themeMode);
    }
  }, [themeMode]);

  // Effect to dynamically load DarkReader on the client
  useEffect(() => {
    let cancelled = false;
    if (typeof window !== "undefined") {
      import("darkreader")
        .then((DarkReader) => {
          if (cancelled) return;
          darkReaderFunctionsRef.current = {
            enable: DarkReader.enable,
            disable: DarkReader.disable,
          };
          setDarkReaderLoaded(true); // Signal that DarkReader functions are ready
        })
        .catch((err) =>
          console.error("Failed to load DarkReader dynamically:", err)
        );
    }
    return () => {
      cancelled = true;
    };
  }, []);

  // Function to apply theme using DarkReader
  const applyTheme = useCallback(
    (mode) => {
      if (
        !darkReaderLoaded ||
        !darkReaderFunctionsRef.current.enable ||
        !darkReaderFunctionsRef.current.disable
      ) {
        // DarkReader not loaded yet, or failed to load
        return;
      }
      if (mode === "dark") {
        darkReaderFunctionsRef.current.enable({
          brightness: 100,
          contrast: 90,
          sepia: 10,
        });
      } else {
        darkReaderFunctionsRef.current.disable();
      }
    },
    [darkReaderLoaded]
  );

  // Apply the stored theme once DarkReader is ready
  useEffect(() => {
    if (darkReaderLoaded) {
      const current = readCookieTheme();
      setThemeMode(current);
      applyTheme(current);
      setIsHydrated(true);
    }
  }, [darkReaderLoaded, applyTheme]);

  const toggleThemeMode = useCallback(() => {
    if (!darkReaderLoaded) {
      console.warn("DarkReader not loaded yet, cannot toggle theme.");
      return;
    }

    setThemeMode((prevMode) => {
      const currentActualMode = prevMode || DEFAULT_THEME;
      const newMode = currentActualMode === "light" ? "dark" : "light";
      applyTheme(newMode);
      try {
        Cookies.set(THEME_COOKIE_KEY, newMode, { expires: 365 });
      } catch {
        /* private mode etc. */
      }
      return newMode;
    });
  }, [applyTheme, darkReaderLoaded]);

  return {
    themeMode: themeMode || DEFAULT_THEME,
    toggleThemeMode,
    isHydrated,
  };
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
    throw new Error(
      "useGlobalColorScheme must be used within a ColorSchemeProvider"
    );
  }
  return context;
};
