import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef, // Added useRef
} from "react";
import Cookies from "js-cookie";

// --- IP Address Module (Unchanged) ---
const IPAddressModule = (() => {
  let globalIpAddress = "unknown";
  function setIpAddress(ip) {
    globalIpAddress = ip;
  }
  function getIpAddress() {
    return globalIpAddress;
  }
  return {
    setIpAddress,
    getIpAddress,
  };
})();

export const setIpAddress = IPAddressModule.setIpAddress;
export const getIpAddress = IPAddressModule.getIpAddress;

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
  }, []); // Empty dependency array means it runs once on mount (client-side)

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
    [darkReaderLoaded] // Re-create if darkReaderLoaded changes
  );

  // Effect for initial theme load from cookies and applying it
  useEffect(() => {
    // This effect now depends on darkReaderLoaded
    if (darkReaderLoaded) { // Ensures DarkReader is available
      const savedTheme = Cookies.get(THEME_COOKIE_KEY);
      const initialTheme =
        savedTheme === "dark" || savedTheme === "light"
          ? savedTheme
          : DEFAULT_THEME;

      setThemeMode(initialTheme); // Set state first
      applyTheme(initialTheme); // Then apply visual theme
      setIsHydrated(true); // Now we are truly hydrated with the correct theme
    } else if (typeof window === "undefined") {
      // For SSR, set a default themeMode so components can render.
      // Actual DarkReader application happens client-side.
      setThemeMode(DEFAULT_THEME);
    }
    // If darkReader isn't loaded yet on the client, this effect will re-run when darkReaderLoaded becomes true.
  }, [darkReaderLoaded, applyTheme]);

  const toggleThemeMode = useCallback(() => {
    if (!darkReaderLoaded) {
      console.warn("DarkReader not loaded yet, cannot toggle theme.");
      return;
    }

    setThemeMode((prevMode) => {
      // Ensure prevMode is not null if component renders before hydration completes fully
      const currentActualMode = prevMode || DEFAULT_THEME; // Use default if prevMode is null
      const newMode = currentActualMode === "light" ? "dark" : "light";
      applyTheme(newMode);
      Cookies.set(THEME_COOKIE_KEY, newMode, { expires: 365 });
      return newMode;
    });
  }, [applyTheme, darkReaderLoaded]);

  return {
    themeMode: themeMode || DEFAULT_THEME, // Provide a fallback during initial null state or SSR
    toggleThemeMode,
    isHydrated,
  };
};

const ColorSchemeContext = createContext(undefined);

export const ColorSchemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();

  // The provider itself just passes down the value.
  // Consumers (like Layout) can use `isHydrated` to manage rendering if needed.
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