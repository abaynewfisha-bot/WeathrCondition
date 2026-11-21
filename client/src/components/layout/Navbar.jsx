import { MapPin } from "lucide-react";
import CitySearchBar from "../search/CitySearchBar";
import ThemeToggle from "../common/ThemeToggle";

export default function Navbar({ onSelectCity, onLocate, cityName = "Nairobi" }) {
  return (
    <header className="sticky top-0 z-[500] flex min-h-[68px] flex-wrap items-center gap-3 border-b border-[var(--border)] bg-[var(--bg)] px-[18px] py-3 min-[681px]:min-h-[78px] min-[681px]:flex-nowrap min-[681px]:gap-4 min-[681px]:px-5">
      <div className="order-last w-full min-[681px]:order-none min-[681px]:max-w-[680px] min-[681px]:flex-1">
        <CitySearchBar onSelect={onSelectCity} />
      </div>

      <div className="order-3 flex w-full items-center justify-end gap-2 min-[681px]:order-none min-[681px]:w-auto">
        <button
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#7771bb,#393b87)] px-4 py-[9px] text-sm font-bold text-white"
          title="Use my current location"
          aria-label="Use my current location"
          onClick={onLocate}
        >
          <MapPin size={18} fill="white" />
          {cityName}, Kenya
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
