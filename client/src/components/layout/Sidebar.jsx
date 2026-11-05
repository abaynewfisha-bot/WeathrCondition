import { NavLink } from "react-router-dom";
import { Bell, Heart, Home, Map } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/map", label: "Map", icon: Map },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/alerts", label: "Alerts", icon: Bell }
];

export default function Sidebar() {
  return (
    <aside className="border-b border-[var(--border)] px-3 py-2 min-[681px]:border-b-0 min-[681px]:border-r min-[681px]:px-[14px] min-[681px]:py-5">
      <nav className="flex gap-2 overflow-x-auto min-[681px]:sticky min-[681px]:top-[100px] min-[681px]:grid min-[681px]:overflow-visible">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-[13px] rounded-[14px] px-3 py-[10px] text-[var(--muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--text)] min-[681px]:px-[15px] min-[681px]:py-[13px] ${
                isActive
                  ? "bg-[var(--active-nav)] text-[var(--accent)]"
                  : ""
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
