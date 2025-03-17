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
  color_blue_1: "#0000ff", // Light blue
  color_blue_2: "#0000ff", // Dark blue
  color_light_gray: "#fffcfc", // Light gray
  color_gray: "#d0d4dc", // Dark gray
  grayscale: false,
  dark: false,
};

export const useColorScheme = () => {
  const getColorSchemeFromCookies = useCallback(() => {
    const savedColors = Cookies.get("colorScheme");
    return savedColors ? JSON.parse(savedColors) : defaultColors;
  }, []);

  const [colors, setColors] = useState(getColorSchemeFromCookies);

  const updateColor = (colorName, colorValue) => {
    setColors((prevColors) => {
      const newColors = {
        ...prevColors,
        [colorName]: colorValue,
      };
      Cookies.set("colorScheme", JSON.stringify(newColors), { expires: 1000 });

      return newColors;
    });
  };

  useEffect(() => {
    setColors(getColorSchemeFromCookies());
  }, [getColorSchemeFromCookies]);

  return { colors, updateColor };
};

const ColorSchemeContext = createContext();

export const ColorSchemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();

  return <ColorSchemeContext.Provider value={colorScheme}>{children}</ColorSchemeContext.Provider>;
};

export const useGlobalColorScheme = () => useContext(ColorSchemeContext);
