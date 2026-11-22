// UnitContext
import { createContext, useCallback, useContext, useState } from "react";

const UnitContext = createContext(null);

export function UnitProvider({ children }) {
  const [unit, setUnitState] = useState(
    () => localStorage.getItem("weatherworld_unit") || "C"
  );

  const setUnit = useCallback((value) => {
    const next = value === "F" ? "F" : "C";
    setUnitState(next);
    localStorage.setItem("weatherworld_unit", next);
  }, []);

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
