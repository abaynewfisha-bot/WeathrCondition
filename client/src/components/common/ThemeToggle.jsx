import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-transparent bg-transparent text-[#ffa52f] hover:border-[#293a52]"
      onClick={toggleTheme}
      title="Toggle light and dark theme"
      aria-label="Toggle theme"
      aria-pressed={theme === "light"}
    >
      {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
