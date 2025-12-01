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

export const useColorScheme = () => {
  const [themeMode, setThemeMode] = useState(null); // Initial state is null
  const [isHydrated, setIsHydrated] = useState(false);

  // Refs to store DarkReader functions once loaded
  const darkReaderFunctionsRef = useRef({ enable: null, disable: null });
  const [darkReaderLoaded, setDarkReaderLoaded] = useState(false);

  // Effect to dynamically load DarkReader on the client
  useEffect(() => {
    // This effect runs only on the client
    if (typeof window !== "undefined") {
      import("darkreader")
        .then((DarkReader) => {
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
  }, []);

  // Function to apply theme using DarkReader
  const applyTheme = useCallback(
    (mode) => {
      if (!darkReaderLoaded || !darkReaderFunctionsRef.current.enable || !darkReaderFunctionsRef.current.disable) {
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

  // Effect for initial theme load from cookies and applying it
  useEffect(() => {
    if (darkReaderLoaded) {
      const savedTheme = Cookies.get(THEME_COOKIE_KEY);
      const initialTheme =
        savedTheme === "dark" || savedTheme === "light"
          ? savedTheme
          : DEFAULT_THEME;

      setThemeMode(initialTheme);
      applyTheme(initialTheme);
      setIsHydrated(true);
    } else if (typeof window === "undefined") {
      setThemeMode(DEFAULT_THEME);
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
      Cookies.set(THEME_COOKIE_KEY, newMode, { expires: 365 });
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