import { MapPin } from "lucide-react";
import CitySearchBar from "../search/CitySearchBar";
import ThemeToggle from "../common/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({
  onSelectCity,
  onLocate,
  cityName = "Nairobi",
  countryName = "Kenya",
  locationLoading = false
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

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
          {locationLoading ? "Finding location..." : `${cityName}, ${countryName}`}
        </button>
        <ThemeToggle />
        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            title={`Log out ${user.name}`}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 text-sm font-bold text-[var(--text)]"
          >
            <LogOut size={17} />
            <span className="hidden min-[681px]:inline">Logout</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 text-sm font-bold text-[var(--text)]"
          >
            <LogIn size={17} />
            <span className="hidden min-[681px]:inline">Login</span>
          </button>
        )}
      </div>
    </header>
  );
}
