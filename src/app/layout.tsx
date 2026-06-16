import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "自衛隊式AIコーチ",
  description: "自衛隊式トレーニングでダイエット・体力向上",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <nav style={{ display: "flex", gap: "16px", padding: "12px 20px", borderBottom: "1px solid #333", backgroundColor: "#111", alignItems: "center", flexWrap: "wrap" }}>
          <a href="/onboarding" style={{ color: "#4ade80" }}>🪖 入隊テスト</a>
          <a href="/profile" style={{ color: "#4ade80" }}>👤 マイプロフィール</a>
          <a href="/coach" style={{ color: "#4ade80" }}>🏋️ トレーニングメニュー</a>
          <a href="/weekly" style={{ color: "#4ade80" }}>📋 週間メニュー</a>
          <a href="/fitness-test" style={{ color: "#4ade80" }}>🥇 体力試験ガイド</a>
          <a href="/fitness-log" style={{ color: "#4ade80" }}>📊 体力記録ログ</a>
          <a href="/calendar" style={{ color: "#4ade80" }}>📅 訓練カレンダー</a>
          <a href="/chat" style={{ color: "#4ade80" }}>💬 鬼教官に相談</a>
          <ThemeToggle />
        </nav>
        {children}
      </body>
    </html>
  );
}