"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("dark-mode");
    if (stored !== null) setDarkMode(stored === "true");
  }, []);

  const toggleMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("dark-mode", String(next));
  };

  return (
    <button onClick={toggleMode}
      style={{ marginLeft: "auto", backgroundColor: "transparent", border: "1px solid #333", borderRadius: "20px", padding: "4px 12px", color: "#888", fontSize: "12px", cursor: "pointer" }}>
      {darkMode ? "☀️ ライト" : "🌙 ダーク"}
    </button>
  );
}