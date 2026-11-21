import { useUnit } from "../../context/UnitContext";

export default function UnitToggle() {
  const { unit, toggleUnit } = useUnit();

  return (
    <button
      className="min-h-[44px] rounded-full border-0 bg-[linear-gradient(135deg,#d18d2d,#d46d83)] px-3 text-sm font-bold text-white"
      onClick={toggleUnit}
      aria-label="Change temperature unit"
    >
      {unit === "C" ? "°C | °F" : "°F | °C"}
    </button>
  );
}
