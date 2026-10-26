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
    <aside className="sidebar">
      <nav className="sidebar-nav" aria-label="Main navigation">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
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
