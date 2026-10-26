// UnitContext
import { createContext, useContext, useState } from "react";

const UnitContext = createContext(null);

export function UnitProvider({ children }) {
  const [unit, setUnit] = useState("C");

  const toggleUnit = () => {
    setUnit((current) => current === "C" ? "F" : "C");
  };

  return (
    <UnitContext.Provider value={{ unit, setUnit, toggleUnit }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  const context = useContext(UnitContext);

  if (!context) {
    throw new Error("useUnit must be used inside UnitProvider");
  }

  return context;
}
