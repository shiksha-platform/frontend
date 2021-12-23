import en from "./en.json";
import hi from "./hi.json";
const init = {
  resources: {
    en: {
      translation: en,
    },
    hi: {
      translation: hi,
    },
  },
  lng: localStorage.getItem("lang"),
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
};

export default init;
