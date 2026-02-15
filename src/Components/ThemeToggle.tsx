import { useTheme } from "../Context/ThemeContext";

export default function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full
      bg-gray-200 dark:bg-gray-800 shadow-md
      hover:scale-105 transition-all"
    >
      {isDark ? "🌞" : "🌙"}
    </button>
  );
}
