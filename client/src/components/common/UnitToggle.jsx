import { useUnit } from "../../context/UnitContext";

export default function UnitToggle() {
  const { unit, toggleUnit } = useUnit();

  return (
    <button className="unit-toggle" onClick={toggleUnit} aria-label="Change temperature unit">
      {unit === "C" ? "°C | °F" : "°F | °C"}
    </button>
  );
}
