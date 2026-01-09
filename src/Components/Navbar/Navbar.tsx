import { useTheme } from "../../Context/ThemeContext";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "22px" }}>💬</span>
        <span style={{ fontSize: "18px", fontWeight: 600 }}>
          ChatApp
        </span>
      </div>

      {/* Center */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search chats..."
          style={{
            width: "60%",
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Right */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button style={iconBtn}>➕</button>
        <button style={iconBtn}>🔔</button>

        {/* Theme Toggle */}
        <button style={iconBtn} onClick={toggleTheme}>
          {isDark ? "🌙" : "☀️"}
        </button>

        <div style={{ fontSize: "20px" }}>👤</div>
      </div>
    </div>
  );
}

const iconBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "18px",
};
