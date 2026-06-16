"use client";

import { useState, useEffect } from "react";
import Avatar, { getRankInfo, calcLevel } from "@/components/Avatar";

type Division = "陸上自衛隊" | "海上自衛隊" | "航空自衛隊";

const DIVISION_ICONS: Record<Division, string> = {
  陸上自衛隊: "🪖",
  海上自衛隊: "⚓",
  航空自衛隊: "✈️",
};

const LEVEL_UP_CONDITIONS = [
  { label: "3日連続記録", check: (s: number) => s >= 3 },
  { label: "7日連続記録", check: (s: number) => s >= 7 },
  { label: "14日連続記録", check: (s: number) => s >= 14 },
  { label: "体力スコア+10回", check: (_: number, diff: number) => diff >= 10 },
  { label: "体力スコア+30回", check: (_: number, diff: number) => diff >= 30 },
  { label: "体重-1kg", check: (_: number, __: number, w: number) => w >= 1 },
  { label: "体重-3kg", check: (_: number, __: number, w: number) => w >= 3 },
  { label: "体重-5kg", check: (_: number, __: number, w: number) => w >= 5 },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [level, setLevel] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [fitnessScore, setFitnessScore] = useState(0);
  const [weightLost, setWeightLost] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("user-profile");
    if (!stored) return;
    const p = JSON.parse(stored);
    setProfile(p);

    // 体力記録ログから計算
    const deviceId = localStorage.getItem("device-id") || "";
    const logs = JSON.parse(localStorage.getItem(`fitness-log-${deviceId}`) || "[]");

    // 連続記録日数
    const dates = logs.map((e: any) => e.date).sort().reverse();
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i]);
      const diff = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === i) streak++;
      else break;
    }
    setStreakDays(streak);

    // 最新の体力スコア
    if (logs.length > 0) {
      const latest = logs[0];
      const score = (latest.pushup || 0) + (latest.situp || 0) + (latest.pullup || 0);
      setFitnessScore(score);

      // 体重減少
      const initialWeight = parseFloat(p.weight || "0");
      const currentWeight = latest.weight || initialWeight;
      setWeightLost(Math.max(0, initialWeight - currentWeight));
    }

    // レベル計算
    const initialScore = parseInt(p.initialScore || "0");
    const scoreDiff = fitnessScore - initialScore;
    const calculated = calcLevel({ streakDays: streak, fitnessScore, initialScore: parseInt(p.initialScore || "0"), weightLost });
    setLevel(calculated);
  }, [fitnessScore]);

  if (!profile) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#fff", fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#888", marginBottom: "1rem" }}>プロフィールがありません</p>
          <a href="/onboarding" style={{ color: "#22c55e", fontSize: "14px" }}>入隊テストを受ける →</a>
        </div>
      </div>
    );
  }

  const division = profile.division as Division || "陸上自衛隊";
  const rankInfo = getRankInfo(division, level);
  const nextRankInfo = getRankInfo(division, Math.min(level + 1, 7));
  const initialScore = parseInt(profile.initialScore || "0");
  const scoreDiff = fitnessScore - initialScore;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#fff", fontFamily: "sans-serif", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>

        <div style={{ marginBottom: "2rem" }}>
          <p style={{ color: "#22c55e", fontSize: "12px", letterSpacing: "0.15em", margin: "0 0 4px" }}>MY PROFILE</p>
          <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 4px" }}>隊員プロフィール</h1>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>記録を続けて階級を上げろ</p>
        </div>

        {/* アバター */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Avatar level={level} color={rankInfo.color} animate={true} />
          <p style={{ fontSize: "13px", color: "#888", margin: "8px 0 4px" }}>{DIVISION_ICONS[division]} {division}</p>
          <p style={{ fontSize: "26px", fontWeight: "700", color: rankInfo.color, margin: "0 0 4px" }}>{rankInfo.stars} {rankInfo.name}</p>
          <p style={{ color: "#666", fontSize: "12px", margin: 0 }}>次の階級：{nextRankInfo.name}</p>
        </div>

        {/* ステータス */}
        <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 1rem", letterSpacing: "0.1em" }}>現在のステータス</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", textAlign: "center" }}>
            {[
              { label: "連続記録", value: streakDays, unit: "日" },
              { label: "体力向上", value: scoreDiff > 0 ? "+" + scoreDiff : scoreDiff, unit: "回" },
              { label: "体重減少", value: weightLost.toFixed(1), unit: "kg" },
            ].map((item) => (
              <div key={item.label} style={{ backgroundColor: "#1a1a1a", borderRadius: "6px", padding: "12px" }}>
                <p style={{ color: "#888", fontSize: "11px", margin: "0 0 4px" }}>{item.label}</p>
                <p style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 2px", color: rankInfo.color }}>{item.value}</p>
                <p style={{ color: "#666", fontSize: "11px", margin: 0 }}>{item.unit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 階級アップ条件 */}
        <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 1rem", letterSpacing: "0.1em" }}>階級アップ条件</p>
          {LEVEL_UP_CONDITIONS.map((cond, i) => {
            const cleared = i < level;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px" }}>{cleared ? "✅" : "⬜"}</span>
                <span style={{ fontSize: "13px", color: cleared ? "#22c55e" : "#666" }}>{cond.label}</span>
              </div>
            );
          })}
        </div>

        {/* 基本情報 */}
        <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 1rem", letterSpacing: "0.1em" }}>基本情報</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { label: "年齢", value: profile.age + "歳" },
              { label: "体重", value: profile.weight + "kg" },
              { label: "身長", value: profile.height + "cm" },
              { label: "目標カロリー", value: (profile.tdee - 500).toLocaleString() + "kcal" },
            ].map((item) => (
              <div key={item.label} style={{ backgroundColor: "#1a1a1a", borderRadius: "6px", padding: "10px 12px" }}>
                <p style={{ color: "#888", fontSize: "11px", margin: "0 0 2px" }}>{item.label}</p>
                <p style={{ fontSize: "15px", fontWeight: "600", margin: 0 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <a href="/fitness-log"
          style={{ display: "block", width: "100%", backgroundColor: "#22c55e", color: "#000", border: "none", borderRadius: "6px", padding: "14px", fontSize: "16px", fontWeight: "700", cursor: "pointer", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}>
          体力を記録して階級アップ →
        </a>
      </div>
    </div>
  );
}