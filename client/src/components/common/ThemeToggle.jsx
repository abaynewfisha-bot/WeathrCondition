import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-transparent px-3 py-[9px] text-[var(--text)] hover:border-[var(--accent)]"
      onClick={toggleTheme}
      title="Toggle light and dark theme"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
