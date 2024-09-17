import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import esTranslation from "./locales/es/translation.json";
// import en from './locales/en/translation.json';
// import es from './locales/es/translation.json';
import ru from "./locales/ru/translation.json";
import hi from "./locales/hi/translation.json";
import pt from "./locales/pt/translation.json";
import nl from "./locales/nl/translation.json";
import zh from "./locales/zh/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    es: {
      translation: esTranslation,
    },
    ru: { translation: ru },
    hi: { translation: hi },
    pt: { translation: pt },
    nl: { translation: nl },
    zh: { translation: zh },
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
