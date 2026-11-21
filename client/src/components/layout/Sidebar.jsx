import { NavLink } from "react-router-dom";
import { Bell, CloudSun, Heart, Home, Map } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/map", label: "Map", icon: Map },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/alerts", label: "Alerts", icon: Bell }
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
    </aside>
  );
}
