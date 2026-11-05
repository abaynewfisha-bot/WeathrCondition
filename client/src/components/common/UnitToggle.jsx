import { useUnit } from "../../context/UnitContext";

export default function UnitToggle() {
  const { unit, toggleUnit } = useUnit();

  return (
    <button className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-transparent px-3 py-[9px] text-[var(--text)] hover:border-[var(--accent)]" onClick={toggleUnit} aria-label="Change temperature unit">
      {unit === "C" ? "°C | °F" : "°F | °C"}
    </button>
  );
}
