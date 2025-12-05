import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import AuthProvider from "./auth/AuthContext";
import { ThemeProvider } from "./hooks/useTheme";
import { LanguageProvider } from "./hooks/useLanguage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

