import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

const IPAddressModule = (() => {
  let globalIpAddress = "unknown"; // Default IP address encapsulated inside the module

  function setIpAddress(ip) {
    globalIpAddress = ip;
  }

  function getIpAddress() {
    return globalIpAddress;
  }

  // Export the public interface
  return {
    setIpAddress,
    getIpAddress,
  };
})();

export const setIpAddress = IPAddressModule.setIpAddress;
export const getIpAddress = IPAddressModule.getIpAddress;

export let paddingtop = 80;

const defaultColors = {
  color_white: "#ffffff",
  color_black: "#000000",
  color_blue_2: "#000000", // Dark blue
  color_light_gray: "#fffcfc", // Light gray
  color_gray: "#d0d4dc", // Dark gray
  grayscale: false,
  dark: false,
};

export const useColorScheme = () => {
  // Initialize with null to indicate loading state
  const [colors, setColors] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const getColorSchemeFromCookies = useCallback(() => {
    if (typeof window === 'undefined') {
      // Return default colors during SSR
      return defaultColors;
    }
    const savedColors = Cookies.get("colorScheme");
    return savedColors ? JSON.parse(savedColors) : defaultColors;
  }, []);

  // Only run on client-side mount
  useEffect(() => {
    const initialColors = getColorSchemeFromCookies();
    setColors(initialColors);
    setIsHydrated(true);
  }, [getColorSchemeFromCookies]);

  const updateColor = (colorName, colorValue) => {
    setColors((prevColors) => {
      if (!prevColors) return prevColors; // Don't update until hydrated
      const newColors = {
        ...prevColors,
        [colorName]: colorValue,
      };
      Cookies.set("colorScheme", JSON.stringify(newColors), { expires: 1000 });
      return newColors;
    });
  };

  // Return null colors until hydration is complete
  return { 
    colors: colors || defaultColors, 
    updateColor,
    isHydrated 
  };
};

const ColorSchemeContext = createContext();

export const ColorSchemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();

  // Optionally render nothing or a loading state until hydrated
  if (!colorScheme.isHydrated) {
    return null; // or a loading component
  }

  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useGlobalColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error('useGlobalColorScheme must be used within a ColorSchemeProvider');
  }
  return context;
};