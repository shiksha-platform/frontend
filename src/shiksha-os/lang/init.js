import { lazy } from "react";
import en from "./en.json";
import hi from "./hi.json";

const tryRequire = (path) => {
  try {
    return require(`${path}`);
  } catch (err) {
    return {};
  }
};
const en_override = tryRequire("./en_override.json");
const hi_override = tryRequire("./hi_override.json");

const init = {
  resources: {
    en: {
      translation: { ...en, ...(en_override ? en_override : {}) },
    },
    hi: {
      translation: { ...hi, ...(hi_override ? hi_override : {}) },
    },
  },
  lng: localStorage.getItem("lang"),
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
};

export default init;
