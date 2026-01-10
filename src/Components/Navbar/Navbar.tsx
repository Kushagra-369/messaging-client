import { useTheme } from "../../Context/ThemeContext";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className={`${isDark ? 'dark' : ''} transition-colors duration-200`}>
      <div
        className="
          flex items-center justify-between
          px-4 py-3 md:px-6
          border-b
          bg-white dark:bg-gray-900
          border-gray-200 dark:border-gray-700
          shadow-sm dark:shadow-gray-800/20
        "
      >
        {/* Left - Brand */}
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-2xl md:text-2xl">💬</span>
          <span className="
            text-lg md:text-xl font-semibold
            text-gray-800 dark:text-white
            tracking-tight
          ">
            ChatApp
          </span>
        </div>

        {/* Center - Search */}
        <div className="flex-1 flex justify-center max-w-2xl mx-4">
          <div className="relative w-full md:w-3/4">
            <input
              type="text"
              placeholder="Search chats..."
              className="
                w-full
                px-4 py-2 pl-10
                rounded-lg
                border
                bg-gray-50 dark:bg-gray-800
                border-gray-300 dark:border-gray-600
                text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2
                focus:ring-blue-500 dark:focus:ring-blue-400
                focus:border-transparent
                transition-all duration-200
              "
            />
            <span className="
              absolute left-3 top-1/2 transform -translate-y-1/2
              text-gray-400 dark:text-gray-500
            ">
              🔍
            </span>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Add Chat Button */}
          <button
            className="
              p-2 rounded-lg
              hover:bg-gray-100 dark:hover:bg-gray-800
              text-gray-700 dark:text-gray-300
              hover:text-blue-600 dark:hover:text-blue-400
              transition-all duration-200
              relative group
            "
            title="New Chat"
          >
            <span className="text-xl">➕</span>
            <span className="
              absolute -bottom-8 left-1/2 transform -translate-x-1/2
              px-2 py-1 text-xs
              bg-gray-800 dark:bg-gray-700 text-white
              rounded opacity-0 group-hover:opacity-100
              transition-opacity duration-200 whitespace-nowrap
            ">
              New Chat
            </span>
          </button>

          {/* Notifications Button */}
          <button
            className="
              p-2 rounded-lg
              hover:bg-gray-100 dark:hover:bg-gray-800
              text-gray-700 dark:text-gray-300
              hover:text-yellow-600 dark:hover:text-yellow-400
              transition-all duration-200
              relative group
            "
            title="Notifications"
          >
            <span className="text-xl">🔔</span>
            <div className="
              absolute -top-1 -right-1
              w-2 h-2
              bg-red-500 rounded-full
              animate-pulse
            " />
            <span className="
              absolute -bottom-8 left-1/2 transform -translate-x-1/2
              px-2 py-1 text-xs
              bg-gray-800 dark:bg-gray-700 text-white
              rounded opacity-0 group-hover:opacity-100
              transition-opacity duration-200 whitespace-nowrap
            ">
              Notifications
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="
              p-2 rounded-lg
              hover:bg-gray-100 dark:hover:bg-gray-800
              text-gray-700 dark:text-gray-300
              hover:text-orange-500 dark:hover:text-yellow-300
              transition-all duration-200
              relative group
            "
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="text-xl transition-transform duration-300 hover:rotate-12">
              {isDark ? "🌙" : "☀️"}
            </span>
            <span className="
              absolute -bottom-8 left-1/2 transform -translate-x-1/2
              px-2 py-1 text-xs
              bg-gray-800 dark:bg-gray-700 text-white
              rounded opacity-0 group-hover:opacity-100
              transition-opacity duration-200 whitespace-nowrap
            ">
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          {/* Profile */}
          <div className="
            flex items-center gap-2
            pl-3 md:pl-4
            border-l border-gray-200 dark:border-gray-700
          ">
            <div className="
              p-2 rounded-full
              bg-linear-to-r from-blue-500 to-purple-600
              cursor-pointer
              hover:scale-105
              transition-transform duration-200
              relative group
            ">
              <span className="text-white text-lg">👤</span>
              <span className="
                absolute -bottom-8 left-1/2 transform -translate-x-1/2
                px-2 py-1 text-xs
                bg-gray-800 dark:bg-gray-700 text-white
                rounded opacity-0 group-hover:opacity-100
                transition-opacity duration-200 whitespace-nowrap
              ">
                Profile
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}