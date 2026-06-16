"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ backgroundColor: darkMode ? "#0a0a0a" : "#f5f5f5", color: darkMode ? "#fff" : "#111", transition: "background-color 0.3s, color 0.3s" }}>
        <nav style={{ display: "flex", gap: "16px", padding: "12px 20px", borderBottom: `1px solid ${darkMode ? "#333" : "#ddd"}`, backgroundColor: darkMode ? "#111" : "#fff", alignItems: "center", flexWrap: "wrap" }}>
          <a href="/onboarding" style={{ color: "#4ade80" }}>🪖 入隊テスト</a>
          <a href="/profile" style={{ color: "#4ade80" }}>👤 マイプロフィール</a>
          <a href="/coach" style={{ color: "#4ade80" }}>🏋️ トレーニングメニュー</a>
          <a href="/weekly" style={{ color: "#4ade80" }}>📋 週間メニュー</a>
          <a href="/fitness-test" style={{ color: "#4ade80" }}>🥇 体力試験ガイド</a>
          <a href="/fitness-log" style={{ color: "#4ade80" }}>📊 体力記録ログ</a>
          <a href="/calendar" style={{ color: "#4ade80" }}>📅 訓練カレンダー</a>
          <a href="/chat" style={{ color: "#4ade80" }}>💬 鬼教官に相談</a>
          <button onClick={toggleMode}
            style={{ marginLeft: "auto", backgroundColor: "transparent", border: `1px solid ${darkMode ? "#333" : "#ddd"}`, borderRadius: "20px", padding: "4px 12px", color: darkMode ? "#888" : "#555", fontSize: "12px", cursor: "pointer" }}>
            {darkMode ? "☀️ ライト" : "🌙 ダーク"}
          </button>
        </nav>
        {children}
      </body>
    </html>
  );
}