import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setShowConfirmLogout(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = (): void => {
    setIsProfileOpen(!isProfileOpen);
    setShowConfirmLogout(false);
  };

  const handleSignOut = async (): Promise<void> => {
    if (!showConfirmLogout) {
      setShowConfirmLogout(true);
      return;
    }

    setIsSigningOut(true);

    try {
      // Get token from localStorage - use the same key as login
      const token = localStorage.getItem("access_token");

      if (token) {
        // Optional: Call backend logout endpoint if you have one
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.log("Logout API call failed, proceeding with client-side logout");
        }
      }

      // Clear all client-side storage - include ALL keys you use
      localStorage.removeItem("access_token");
      localStorage.removeItem("token"); // Remove both just in case
      localStorage.removeItem("user");
      localStorage.removeItem("theme");
      sessionStorage.clear();

      // Clear all cookies
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      });

      // Show success message
      toast.success("Signed out successfully!", {
        duration: 3000,
        style: {
          background: isDark ? "#1f2937" : "#f0f9ff",
          border: isDark ? "1px solid #374151" : "1px solid #bae6fd",
          color: isDark ? "#f9fafb" : "#0c4a6e",
          padding: "12px 16px",
        },
      });

      // Close dropdown and redirect after delay
      setIsProfileOpen(false);
      setShowConfirmLogout(false);

      // Force a complete page reload and redirect to login
      setTimeout(() => {
        window.location.href = "/login";  // Use window.location.href for full reload
      }, 1000);

    } catch (error) {
      console.error("Sign out error:", error);

      // Force clear everything and redirect
      localStorage.clear();
      sessionStorage.clear();

      toast.error("Signed out with warnings", {
        duration: 3000,
        style: {
          background: isDark ? "#7f1d1d" : "#fef2f2",
          border: isDark ? "1px solid #991b1b" : "1px solid #fecaca",
          color: isDark ? "#fecaca" : "#7f1d1d",
          padding: "12px 16px",
        },
      });

      setIsProfileOpen(false);
      setShowConfirmLogout(false);

      // Force redirect
      window.location.href = "/login";
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleViewProfile = (): void => {
    navigate("/profile");
    setIsProfileOpen(false);
    setShowConfirmLogout(false);
  };

  const handleBackToHome = (): void => {
    navigate("/");
    setIsProfileOpen(false);
    setShowConfirmLogout(false);
  };

  const handleNewChat = (): void => {
    // Add your new chat logic here
    console.log("Creating new chat...");
    toast.success("New chat started!", {
      duration: 2000,
      style: {
        background: isDark ? "#1f2937" : "#f0f9ff",
        border: isDark ? "1px solid #374151" : "1px solid #bae6fd",
        color: isDark ? "#f9fafb" : "#0c4a6e",
      },
    });
  };

  const handleNotifications = (): void => {
    // Add your notifications logic here
    console.log("Opening notifications...");
    navigate("/notifications");
  };

  const cancelLogout = (): void => {
    setShowConfirmLogout(false);
  };

  return (
    <>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'font-sans',
          style: {
            background: isDark ? "#1f2937" : "#ffffff",
            border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
            color: isDark ? "#f9fafb" : "#111827",
            padding: "12px 16px",
          },
        }}
      />

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
              onClick={handleNewChat}
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
              onClick={handleNotifications}
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

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={handleProfileClick}
                className="
                  flex items-center gap-2
                  pl-3 md:pl-4
                  border-l border-gray-200 dark:border-gray-700
                  hover:opacity-90
                  transition-opacity duration-200
                "
                aria-label="Profile menu"
                aria-expanded={isProfileOpen}
                disabled={isSigningOut}
              >
                <div className="
                  p-2 rounded-full
                  bg-linear-to-r from-blue-500 to-purple-600
                  cursor-pointer
                  hover:scale-105
                  transition-transform duration-200
                  relative
                ">
                  <span className="text-white text-lg">👤</span>
                </div>
                {/* Chevron icon */}
                <span className={`
                  text-gray-500 dark:text-gray-400 text-xs
                  transition-transform duration-200
                  ${isProfileOpen ? 'rotate-180' : ''}
                `}>
                  ▼
                </span>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="
                  absolute right-0 mt-2 w-56
                  rounded-lg shadow-xl
                  bg-white dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  overflow-hidden
                  z-50
                  animate-fadeIn
                ">
                  {/* Dropdown Header (User Info) */}
                  <div className="
                    px-4 py-3
                    border-b border-gray-100 dark:border-gray-700
                    bg-gray-50 dark:bg-gray-900
                  ">
                    <p className="
                      text-sm font-medium
                      text-gray-900 dark:text-white
                    ">
                      John Doe
                    </p>
                    <p className="
                      text-xs
                      text-gray-500 dark:text-gray-400
                      truncate
                    ">
                      john.doe@example.com
                    </p>
                  </div>

                  {/* Dropdown Items */}
                  <div className="py-1">
                    {/* Back to Home */}
                    <button
                      onClick={handleBackToHome}
                      className="
                        w-full
                        flex items-center gap-3
                        px-4 py-3
                        text-sm
                        text-gray-700 dark:text-gray-300
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        transition-colors duration-150
                        text-left
                      "
                    >
                      <span className="text-blue-500 dark:text-blue-400">🏠</span>
                      <span>Back to Home</span>
                    </button>

                    {/* View Profile */}
                    <button
                      onClick={handleViewProfile}
                      className="
                        w-full
                        flex items-center gap-3
                        px-4 py-3
                        text-sm
                        text-gray-700 dark:text-gray-300
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        transition-colors duration-150
                        text-left
                      "
                    >
                      <span className="text-green-500 dark:text-green-400">👤</span>
                      <span>View Profile</span>
                    </button>

                    {/* Logout Section */}
                    {!showConfirmLogout ? (
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="
                          w-full
                          flex items-center gap-3
                          px-4 py-3
                          text-sm
                          text-red-600 dark:text-red-400
                          hover:bg-red-50 dark:hover:bg-red-900/20
                          transition-colors duration-150
                          text-left
                          disabled:opacity-50 disabled:cursor-not-allowed
                        "
                      >
                        <span>🚪</span>
                        <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
                      </button>
                    ) : (
                      <div className="
                        p-3
                        border-t border-gray-100 dark:border-gray-700
                        bg-red-50 dark:bg-red-900/10
                      ">
                        <p className="
                          text-sm font-medium
                          text-red-700 dark:text-red-300
                          mb-2
                        ">
                          Confirm Sign Out?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="
                              flex-1
                              px-3 py-2
                              text-xs font-medium
                              bg-red-600 text-white
                              rounded-md
                              hover:bg-red-700
                              transition-colors duration-150
                              disabled:opacity-50 disabled:cursor-not-allowed
                            "
                          >
                            {isSigningOut ? "Signing out..." : "Yes"}
                          </button>
                          <button
                            onClick={cancelLogout}
                            disabled={isSigningOut}
                            className="
                              flex-1
                              px-3 py-2
                              text-xs font-medium
                              bg-gray-200 dark:bg-gray-700
                              text-gray-700 dark:text-gray-300
                              rounded-md
                              hover:bg-gray-300 dark:hover:bg-gray-600
                              transition-colors duration-150
                              disabled:opacity-50
                            "
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}