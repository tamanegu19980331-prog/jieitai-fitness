"use client";

import { useState, useEffect } from "react";

type FitnessEntry = {
  id: string;
  date: string;
  pushup: number | null;
  situp: number | null;
  pullup: number | null;
  lateral: number | null;
  grip: number | null;
  jump: number | null;
  run_min: number | null;
  run_sec: number | null;
  weight: number | null;
  body_fat: number | null;
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export default function CalendarPage() {
  const [entries, setEntries] = useState<FitnessEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const deviceId = localStorage.getItem("device-id") || "";
    const stored = localStorage.getItem(`fitness-log-${deviceId}`);
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const entryMap: Record<string, FitnessEntry> = {};
  entries.forEach((e) => { entryMap[e.date] = e; });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const toDateStr = (day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const today = new Date().toISOString().split("T")[0];

  // 連続記録日数
  const dates = Object.keys(entryMap).sort().reverse();
  let streak = 0;
  const todayDate = new Date();
  for (let i = 0; i < dates.length; i++) {
    const d = new Date(dates[i]);
    const diff = Math.floor((todayDate.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === i) streak++;
    else break;
  }

  const selectedEntry = selectedDate ? entryMap[selectedDate] : null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#fff", fontFamily: "sans-serif", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>

        <div style={{ marginBottom: "2rem" }}>
          <p style={{ color: "#22c55e", fontSize: "12px", letterSpacing: "0.15em", margin: "0 0 4px" }}>TRAINING CALENDAR</p>
          <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 4px" }}>訓練カレンダー</h1>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>継続は力なり。毎日記録せよ。</p>
        </div>

        {/* 連続記録 */}
        <div style={{ backgroundColor: "#0f2a1a", border: "1px solid #22c55e", borderRadius: "8px", padding: "1rem 1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "#22c55e", fontSize: "12px", margin: "0 0 2px" }}>現在の連続記録</p>
            <p style={{ fontSize: "28px", fontWeight: "700", margin: 0, color: "#22c55e" }}>{streak}日連続 🔥</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>総記録日数</p>
            <p style={{ fontSize: "22px", fontWeight: "700", margin: 0 }}>{dates.length}日</p>
          </div>
        </div>

        {/* カレンダーヘッダー */}
        <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", overflow: "hidden", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem", borderBottom: "1px solid #222" }}>
            <button onClick={prevMonth} style={{ backgroundColor: "transparent", border: "none", color: "#888", fontSize: "20px", cursor: "pointer" }}>‹</button>
            <p style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>{year}年{month + 1}月</p>
            <button onClick={nextMonth} style={{ backgroundColor: "transparent", border: "none", color: "#888", fontSize: "20px", cursor: "pointer" }}>›</button>
          </div>

          {/* 曜日ヘッダー */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #1a1a1a" }}>
            {WEEKDAYS.map((d, i) => (
              <div key={d} style={{ padding: "8px 0", textAlign: "center", fontSize: "12px", color: i === 0 ? "#ef4444" : i === 6 ? "#3b82f6" : "#666" }}>
                {d}
              </div>
            ))}
          </div>

          {/* カレンダーグリッド */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {/* 空白 */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} style={{ padding: "8px 0", minHeight: "48px" }} />
            ))}

            {/* 日付 */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = toDateStr(day);
              const hasEntry = !!entryMap[dateStr];
              const isToday = dateStr === today;
              const isSelected = dateStr === selectedDate;
              const dayOfWeek = (firstDay + i) % 7;

              return (
                <div key={day} onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  style={{
                    padding: "4px", minHeight: "48px", cursor: "pointer",
                    backgroundColor: isSelected ? "#14532d" : "transparent",
                    borderRadius: "4px",
                    position: "relative",
                  }}>
                  <p style={{
                    fontSize: "13px", margin: "0 0 4px", textAlign: "center",
                    fontWeight: isToday ? "700" : "400",
                    color: isToday ? "#22c55e" : dayOfWeek === 0 ? "#ef4444" : dayOfWeek === 6 ? "#3b82f6" : "#ccc",
                  }}>
                    {day}
                  </p>
                  {hasEntry && (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 選択日の詳細 */}
        {selectedDate && (
          <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ color: "#22c55e", fontSize: "12px", margin: "0 0 1rem", letterSpacing: "0.1em" }}>{selectedDate} の記録</p>
            {selectedEntry ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[
                  { label: "腕立て", value: selectedEntry.pushup, unit: "回" },
                  { label: "腹筋", value: selectedEntry.situp, unit: "回" },
                  { label: "懸垂", value: selectedEntry.pullup, unit: "回" },
                  { label: "反復横跳び", value: selectedEntry.lateral, unit: "回" },
                  { label: "握力", value: selectedEntry.grip, unit: "kg" },
                  { label: "立ち幅跳び", value: selectedEntry.jump, unit: "cm" },
                  { label: "体重", value: selectedEntry.weight, unit: "kg" },
                  { label: "体脂肪率", value: selectedEntry.body_fat, unit: "%" },
                ].filter((item) => item.value !== null).map((item) => (
                  <div key={item.label} style={{ backgroundColor: "#1a1a1a", borderRadius: "6px", padding: "10px 12px" }}>
                    <p style={{ color: "#888", fontSize: "11px", margin: "0 0 2px" }}>{item.label}</p>
                    <p style={{ fontSize: "16px", fontWeight: "700", margin: 0, color: "#22c55e" }}>{item.value}{item.unit}</p>
                  </div>
                ))}
                {selectedEntry.run_min !== null && (
                  <div style={{ backgroundColor: "#1a1a1a", borderRadius: "6px", padding: "10px 12px" }}>
                    <p style={{ color: "#888", fontSize: "11px", margin: "0 0 2px" }}>3km走</p>
                    <p style={{ fontSize: "16px", fontWeight: "700", margin: 0, color: "#22c55e" }}>
                      {selectedEntry.run_min}:{String(selectedEntry.run_sec).padStart(2, "0")}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <p style={{ color: "#444", margin: "0 0 1rem" }}>この日の記録はありません</p>
                <a href="/fitness-log" style={{ color: "#22c55e", fontSize: "14px" }}>記録する →</a>
              </div>
            )}
          </div>
        )}

        {/* 今月のサマリー */}
        <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1.5rem" }}>
          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 1rem", letterSpacing: "0.1em" }}>今月のサマリー</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", textAlign: "center" }}>
            {(() => {
              const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
              const monthEntries = entries.filter((e) => e.date.startsWith(monthStr));
              const avgPushup = monthEntries.filter(e => e.pushup).length > 0
                ? Math.round(monthEntries.reduce((s, e) => s + (e.pushup || 0), 0) / monthEntries.filter(e => e.pushup).length)
                : 0;
              return [
                { label: "記録日数", value: monthEntries.length, unit: "日" },
                { label: "平均腕立て", value: avgPushup, unit: "回" },
                { label: "達成率", value: Math.round((monthEntries.length / daysInMonth) * 100), unit: "%" },
              ];
            })().map((item) => (
              <div key={item.label}>
                <p style={{ color: "#888", fontSize: "11px", margin: "0 0 4px" }}>{item.label}</p>
                <p style={{ fontSize: "22px", fontWeight: "700", margin: "0 0 2px", color: "#22c55e" }}>{item.value}</p>
                <p style={{ color: "#666", fontSize: "11px", margin: 0 }}>{item.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}