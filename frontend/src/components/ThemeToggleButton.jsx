import React from "react";
import { useTheme } from "../context/Themecontext";
import "../styles/ThemeToggleButton.css";

const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="theme-toggle-button">
      {isDarkMode ? "🌙" : "🌞"}
    </button>
  );
};

export default ThemeToggleButton;
