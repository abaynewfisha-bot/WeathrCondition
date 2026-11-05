import { CloudSun, LocateFixed } from "lucide-react";
import CitySearchBar from "../search/CitySearchBar";
import UnitToggle from "../common/UnitToggle";
import ThemeToggle from "../common/ThemeToggle";

export default function Navbar({ onSelectCity, onLocate }) {
  return (
    <header className="sticky top-0 z-[500] flex min-h-[82px] flex-wrap items-center gap-3 border-b border-[var(--border)] bg-[var(--bg)] px-[18px] py-3 min-[681px]:flex-nowrap min-[681px]:gap-6 min-[681px]:px-7">
      <a className="flex shrink-0 items-center gap-3 whitespace-nowrap text-[21px] font-extrabold min-[681px]:text-[25px]" href="/" aria-label="WeatherWorld home">
        <CloudSun className="text-[var(--accent)]" size={29} />
        <span>WeatherWorld</span>
      </a>

      <div className="order-last w-full min-[681px]:order-none min-[681px]:flex-1">
        <CitySearchBar onSelect={onSelectCity} />
      </div>

      <div className="order-3 flex w-full items-center justify-end gap-2 min-[681px]:order-none min-[681px]:w-auto">
        <UnitToggle />
        <button
          className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-transparent px-3 py-[9px] text-[var(--text)] hover:border-[var(--accent)]"
          title="Use my current location"
          aria-label="Use my current location"
          onClick={onLocate}
        >
          <LocateFixed size={20} />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
