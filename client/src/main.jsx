import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./index.css";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { UnitProvider } from "./context/UnitContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <UnitProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </UnitProvider>
    </ThemeProvider>
  </React.StrictMode>
);
