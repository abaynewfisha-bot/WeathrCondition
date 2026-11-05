import { useUnit } from "../../context/UnitContext";

export default function UnitToggle() {
  const { unit, toggleUnit } = useUnit();

  return (
    <button
      className="min-h-[38px] rounded-xl border border-[#344860] bg-transparent px-3 text-sm text-[#c8d3e2] hover:border-[#ffa52f]"
      onClick={toggleUnit}
      aria-label="Change temperature unit"
    >
      {unit === "C" ? "°C | °F" : "°F | °C"}
    </button>
  );
}
