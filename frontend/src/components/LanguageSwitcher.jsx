import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/LanguageSwitcher.css";
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="language-switcher">
      <button onClick={toggleDropdown} className="dropdown-toggle">
        Select Language &#9662;
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={() => changeLanguage("en")}>English</li>
          <li onClick={() => changeLanguage("es")}>Spanish</li>
          <li onClick={() => changeLanguage("ru")}>Russian</li>
          <li onClick={() => changeLanguage("hi")}>Hindi</li>
          <li onClick={() => changeLanguage("zh")}>Chinese</li>
          <li onClick={() => changeLanguage("nl")}>Dutch</li>
          <li onClick={() => changeLanguage("pt")}>Portuguese</li>
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
