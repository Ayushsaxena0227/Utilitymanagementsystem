import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      const rootDiv = document.getElementById("root");
      rootDiv.classList.add("dark-mode");
      rootDiv.classList.remove("light-mode");

      // document.body.classList.add("dark-mode");
      // document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      const rootDiv = document.getElementById("root");
      rootDiv.classList.add("light-mode");
      rootDiv.classList.remove("dark-mode");
      // document.body.classList.add("light-mode");
      // document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevTheme) => !prevTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
