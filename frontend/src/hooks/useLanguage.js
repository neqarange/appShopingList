import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../i18n";

const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "cs");

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const changeLang = (newLang) => setLang(newLang);

  const t = translations[lang] || translations.cs;

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
