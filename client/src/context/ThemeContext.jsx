// ThemeContext
import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeStore";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("weatherworld_theme") || "dark"
  );

  useEffect(() => {
    const resolvedTheme =
      theme === "system"
        ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
        : theme;
    document.body.classList.toggle("light-theme", resolvedTheme === "light");
    localStorage.setItem("weatherworld_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => current === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

