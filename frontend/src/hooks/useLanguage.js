import { useState } from "react";
import { translations } from "../i18n";

export function useLanguage() {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "cs");

  const t = translations[lang];

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  return { lang, t, changeLang };
}
