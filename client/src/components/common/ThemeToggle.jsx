import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="inline-flex min-h-[44px] min-w-[74px] items-center justify-center gap-1 rounded-full border-0 bg-[linear-gradient(135deg,#f7bb42,#ed78a5)] text-white"
      onClick={toggleTheme}
      title="Toggle light and dark theme"
      aria-label="Toggle theme"
      aria-pressed={theme === "light"}
    >
      {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
