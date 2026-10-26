import { CloudSun, LocateFixed } from "lucide-react";
import CitySearchBar from "../search/CitySearchBar";
import UnitToggle from "../common/UnitToggle";
import ThemeToggle from "../common/ThemeToggle";

export default function Navbar({ onSelectCity, onLocate }) {
  return (
    <header className="topbar">
      <a className="brand" href="/" aria-label="WeatherWorld home">
        <CloudSun className="brand-icon" size={29} />
        <span>WeatherWorld</span>
      </a>

      <CitySearchBar onSelect={onSelectCity} />

      <div className="topbar-actions">
        <UnitToggle />
        <button
          className="icon-button"
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
