"use client";

import { useState } from "react";

type Goal = {
  id: string;
  label: string;
  icon: string;
  description: string;
};

type Division = "陸上自衛隊" | "海上自衛隊" | "航空自衛隊";

const GOALS: Goal[] = [
  { id: "aging", label: "年齢の衰えを取り戻したい", icon: "⏰", description: "関節に優しく、基礎体力を回復するメニュー" },
  { id: "habit", label: "運動習慣を身につけたい", icon: "📅", description: "無理なく続けられる入門者向けメニュー" },
  { id: "bulk", label: "細い体を太くしたい", icon: "💪", description: "筋肉量を増やすバルクアップメニュー" },
  { id: "attractive", label: "モテるような体を作りたい", icon: "🔥", description: "見た目を整える逆三角形ボディメニュー" },
  { id: "fat", label: "体脂肪を減らしてぽっこりお腹を引き締めたい", icon: "🏃", description: "有酸素＋体幹で脂肪燃焼メニュー" },
  { id: "abs", label: "腹筋を割りたい", icon: "⚡", description: "腹筋に特化した集中強化メニュー" },
  { id: "stamina", label: "体力をつけたい", icon: "🎯", description: "持久力・全身体力アップメニュー" },
];

const DIVISION_ICONS: Record<Division, string> = {
  陸上自衛隊: "🪖",
  海上自衛隊: "⚓",
  航空自衛隊: "✈️",
};

type DayMenu = {
  day: string;
  focus: string;
  exercises: { name: string; sets: string; reps: string; rest: string }[];
  note: string;
};

export default function WeeklyPage() {
  const [goal, setGoal] = useState<string>("");
  const [division, setDivision] = useState<Division>("陸上自衛隊");
  const [menu, setMenu] = useState<DayMenu[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!goal) return;
    setLoading(true);
    setMenu(null);

    const selectedGoal = GOALS.find((g) => g.id === goal);

    try {
      const res = await fetch("/api/weekly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: selectedGoal?.label, division }),
      });
      const data = await res.json();
      setMenu(data.menu);
    } catch {
      console.error("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const DAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#fff", fontFamily: "sans-serif", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        <div style={{ marginBottom: "2rem" }}>
          <p style={{ color: "#22c55e", fontSize: "12px", letterSpacing: "0.15em", margin: "0 0 4px" }}>WEEKLY MENU</p>
          <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 8px" }}>1週間トレーニングメニュー</h1>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>目標と部隊を選んでメニューを策定する</p>        </div>

        {/* 目標選択 */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 8px" }}>目標を選べ</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {GOALS.map((g) => (
              <button key={g.id} onClick={() => setGoal(g.id)}
                style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid", textAlign: "left", cursor: "pointer", borderColor: goal === g.id ? "#22c55e" : "#333", backgroundColor: goal === g.id ? "#14532d" : "#111" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "20px" }}>{g.icon}</span>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 2px", color: goal === g.id ? "#22c55e" : "#fff" }}>{g.label}</p>
                    <p style={{ fontSize: "12px", margin: 0, color: "#666" }}>{g.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 部隊選択 */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 8px" }}>所属部隊</p>
          <div style={{ display: "flex", gap: "8px" }}>
            {(["陸上自衛隊", "海上自衛隊", "航空自衛隊"] as Division[]).map((d) => (
              <button key={d} onClick={() => setDivision(d)}
                style={{ flex: 1, padding: "10px 6px", borderRadius: "6px", border: "1px solid", cursor: "pointer", fontSize: "12px", textAlign: "center", borderColor: division === d ? "#22c55e" : "#333", backgroundColor: division === d ? "#14532d" : "#1a1a1a", color: division === d ? "#22c55e" : "#888" }}>
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>{DIVISION_ICONS[d]}</div>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* 生成ボタン */}
        <button onClick={handleGenerate} disabled={!goal || loading}
          style={{ width: "100%", backgroundColor: !goal || loading ? "#1a1a1a" : "#22c55e", color: !goal || loading ? "#555" : "#000", border: "none", borderRadius: "6px", padding: "14px", fontSize: "16px", fontWeight: "700", cursor: !goal || loading ? "not-allowed" : "pointer", marginBottom: "2rem" }}>
          {loading ? "作戦立案中..." : "▶ 1週間メニューを生成"}
        </button>

        {/* メニュー表示 */}
        {menu && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {menu.map((day, i) => (
              <div key={i} style={{ backgroundColor: "#111", border: `1px solid ${expandedDay === i ? "#22c55e" : "#222"}`, borderRadius: "8px", overflow: "hidden" }}>
                <div onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: expandedDay === i ? "#14532d" : "#1a1a1a", border: `1px solid ${expandedDay === i ? "#22c55e" : "#333"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: expandedDay === i ? "#22c55e" : "#888" }}>
                      {DAY_LABELS[i]}
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 2px" }}>{day.day}</p>
                      <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>{day.focus}</p>
                    </div>
                  </div>
                  <span style={{ color: "#666", fontSize: "18px" }}>{expandedDay === i ? "▲" : "▼"}</span>
                </div>

                {expandedDay === i && (
                  <div style={{ padding: "0 1.5rem 1.5rem", borderTop: "1px solid #1a1a1a" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "1rem" }}>
                      {day.exercises.map((ex, j) => (
                        <div key={j} style={{ backgroundColor: "#1a1a1a", borderRadius: "6px", padding: "12px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <p style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 4px" }}>{ex.name}</p>
                            <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>休憩 {ex.rest}</p>
                          </div>
                          <p style={{ fontSize: "13px", color: "#22c55e", margin: 0 }}>{ex.sets}セット × {ex.reps}</p>
                        </div>
                      ))}
                    </div>
                    {day.note && (
                      <div style={{ marginTop: "12px", backgroundColor: "#0f2a1a", borderRadius: "6px", padding: "10px 12px" }}>
                        <p style={{ fontSize: "12px", color: "#22c55e", margin: "0 0 2px" }}>教官メモ</p>
                        <p style={{ fontSize: "13px", color: "#a8c4a0", margin: 0 }}>{day.note}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}