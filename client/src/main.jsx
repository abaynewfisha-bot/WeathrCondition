import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./index.css";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { UnitProvider } from "./context/UnitContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <UnitProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UnitProvider>
    </ThemeProvider>
  </React.StrictMode>
);
