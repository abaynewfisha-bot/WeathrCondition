import { NavLink } from "react-router-dom";
import { CloudSun, Heart, Home, Info, Map, MapPin, Settings } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/city/Nairobi", label: "Cities", icon: MapPin },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/map", label: "Map", icon: Map },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/about", label: "About", icon: Info }
];

export default function Sidebar() {
  return (
    <aside className="relative z-[600] flex min-h-[68px] flex-col border-b border-[#293a52] bg-[linear-gradient(180deg,#183b90_0%,#27358a_62%,#1b4d86_100%)] px-3 py-2 min-[681px]:min-h-screen min-[681px]:border-b-0 min-[681px]:border-r min-[681px]:px-[14px] min-[681px]:py-5">
      <a href="/" className="mb-5 hidden flex-col items-center justify-center rounded-[16px] bg-[#0b2d75]/45 px-3 py-5 text-center text-white no-underline min-[681px]:flex" aria-label="WeatherWorld home">
        <CloudSun size={56} className="mb-1 text-[#ffd45a]" strokeWidth={1.7} />
        <span className="text-[22px] font-extrabold leading-tight">WeatherWorld</span>
        <span className="mt-2 text-xs italic leading-4 text-[#cbdcff]">Know the Weather,<br />Plan Your Day</span>
      </a>

      <nav className="flex gap-2 overflow-x-auto min-[681px]:grid min-[681px]:overflow-visible" aria-label="Main navigation">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-[13px] rounded-[14px] px-3 py-[10px] text-[#d7e4ff] no-underline transition-colors hover:bg-white/10 hover:text-white min-[681px]:px-[15px] min-[681px]:py-[13px] ${
                isActive ? "bg-[#3e69cc] text-white" : ""
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto hidden min-[681px]:block">
        <div className="mx-auto mb-3 flex h-[125px] w-[125px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_55%_45%,#63b8ff_0_20%,#1d72a8_21%_38%,#1a3e70_39%_48%,#4dadd7_49%_58%,transparent_59%)] shadow-[0_-8px_25px_rgba(255,255,255,.12)]" aria-label="World globe illustration">
          <span className="h-[72px] w-[72px] rounded-full border border-white/20 bg-[linear-gradient(145deg,#58a9d8,#1d5d88)] shadow-inner" />
        </div>
        <div className="rounded-[14px] px-3 py-3 text-center text-sm font-medium leading-5 text-[#d8e7ff]">
          Live Weather<br />Worldwide 🌤
        </div>
      </div>
    </aside>
  );
}
