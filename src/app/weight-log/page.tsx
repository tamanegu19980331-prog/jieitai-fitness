"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type WeightEntry = {
  id: string;
  date: string;
  weight: number;
  body_fat: number | null;
};

type Goal = {
  jobType: string;
  targetWeight: number | null;
  targetDate: string;
};

const JOB_STANDARDS: Record<string, { pushup: number; situp: number; pullup: number; run: string }> = {
  自衛隊: { pushup: 20, situp: 30, pullup: 5, run: "13:30" },
  消防士: { pushup: 30, situp: 30, pullup: 8, run: "12:00" },
  警察官: { pushup: 25, situp: 25, pullup: 6, run: "13:00" },
};

export default function WeightLogPage() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [weight, setWeight] = useState<string>("");
  const [bodyFat, setBodyFat] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [saved, setSaved] = useState<boolean>(false);
  const [goal, setGoal] = useState<Goal>({ jobType: "消防士", targetWeight: null, targetDate: "" });
  const [goalSaved, setGoalSaved] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("weight-entries");
    if (stored) setEntries(JSON.parse(stored));
    const storedGoal = localStorage.getItem("weight-goal");
    if (storedGoal) setGoal(JSON.parse(storedGoal));
  }, []);

  const handleSubmit = () => {
    if (!weight) return;
    const entry: WeightEntry = {
      id: Date.now().toString(),
      date,
      weight: parseFloat(weight),
      body_fat: bodyFat ? parseFloat(bodyFat) : null,
    };
    const updated = [entry, ...entries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 90);
    localStorage.setItem("weight-entries", JSON.stringify(updated));
    setEntries(updated);
    setWeight("");
    setBodyFat("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    localStorage.setItem("weight-entries", JSON.stringify(updated));
    setEntries(updated);
  };

  const handleGoalSave = () => {
    localStorage.setItem("weight-goal", JSON.stringify(goal));
    setGoalSaved(true);
    setTimeout(() => setGoalSaved(false), 2000);
  };

  const chartData = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30)
    .map((e) => ({ date: e.date.slice(5), weight: e.weight }));

  const latest = entries[0];
  const prev = entries[1];
  const rawDiff = latest && prev ? latest.weight - prev.weight : null;
  const diff = rawDiff !== null ? rawDiff.toFixed(1) : null;
  const diffColor = diff === null ? "#888" : parseFloat(diff) < 0 ? "#22c55e" : parseFloat(diff) > 0 ? "#ef4444" : "#888";
  const diffLabel = diff !== null ? (parseFloat(diff) > 0 ? "+" + diff + " kg" : diff + " kg") : "---";

  const daysLeft = goal.targetDate ? Math.max(0, Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : null;
  const weightToLose = latest && goal.targetWeight ? (latest.weight - goal.targetWeight).toFixed(1) : null;
  const dailyDeficit = weightToLose && daysLeft && daysLeft > 0 ? (parseFloat(weightToLose) * 7700 / daysLeft).toFixed(0) : null;

  const standards = JOB_STANDARDS[goal.jobType];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#ffffff", fontFamily: "sans-serif", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        <div style={{ marginBottom: "2rem" }}>
          <p style={{ color: "#22c55e", fontSize: "12px", letterSpacing: "0.15em", margin: "0 0 4px" }}>WEIGHT LOG</p>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px" }}>戦闘重量ログ</h1>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>毎日記録せよ。任務は継続にある。</p>
        </div>

        {latest && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "2rem" }}>
            <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1rem" }}>
              <p style={{ color: "#888", fontSize: "12px", margin: "0 0 6px" }}>現在の重量</p>
              <p style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>{latest.weight} kg</p>
            </div>
            <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1rem" }}>
              <p style={{ color: "#888", fontSize: "12px", margin: "0 0 6px" }}>前回比</p>
              <p style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: diffColor }}>{diffLabel}</p>
            </div>
            <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1rem" }}>
              <p style={{ color: "#888", fontSize: "12px", margin: "0 0 6px" }}>脂肪率</p>
              <p style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>{latest.body_fat ? latest.body_fat + " %" : "---"}</p>
            </div>
          </div>
        )}

        {/* 目標設定セクション */}
        <div style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
          <p style={{ color: "#22c55e", fontSize: "12px", letterSpacing: "0.1em", margin: "0 0 1rem" }}>作戦目標を設定せよ</p>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>職種</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {["自衛隊", "消防士", "警察官"].map((job) => (
                <button key={job} onClick={() => setGoal({ ...goal, jobType: job })}
                  style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid", borderColor: goal.jobType === job ? "#22c55e" : "#333", backgroundColor: goal.jobType === job ? "#14532d" : "#1a1a1a", color: goal.jobType === job ? "#22c55e" : "#888", fontSize: "14px", cursor: "pointer" }}>
                  {job}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1rem" }}>
            <div>
              <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>目標体重 (kg)</label>
              <input type="number" value={goal.targetWeight ?? ""} onChange={(e) => setGoal({ ...goal, targetWeight: e.target.value ? parseFloat(e.target.value) : null })} placeholder="例: 65.0"
                style={{ width: "100%", backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", padding: "8px 10px", color: "#fff", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>試験日</label>
              <input type="date" value={goal.targetDate} onChange={(e) => setGoal({ ...goal, targetDate: e.target.value })}
                style={{ width: "100%", backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", padding: "8px 10px", color: "#fff", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
          </div>
          <button onClick={handleGoalSave}
            style={{ width: "100%", backgroundColor: goalSaved ? "#166534" : "#1a1a1a", color: goalSaved ? "#22c55e" : "#888", border: "1px solid #333", borderRadius: "6px", padding: "10px", fontSize: "14px", cursor: "pointer" }}>
            {goalSaved ? "✓ 目標保存完了" : "目標を保存する"}
          </button>
        </div>

        {/* 逆算プラン */}
        {daysLeft !== null && weightToLose && parseFloat(weightToLose) > 0 && (
          <div style={{ backgroundColor: "#0f1f0f", border: "1px solid #22c55e", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
            <p style={{ color: "#22c55e", fontSize: "12px", letterSpacing: "0.1em", margin: "0 0 1rem" }}>作戦逆算プラン</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "1rem" }}>
              <div>
                <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px" }}>残り日数</p>
                <p style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "#22c55e" }}>{daysLeft}日</p>
              </div>
              <div>
                <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px" }}>あと</p>
                <p style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "#ef4444" }}>{weightToLose} kg</p>
              </div>
              <div>
                <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px" }}>1日の消費目標</p>
                <p style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>{dailyDeficit} kcal</p>
              </div>
            </div>
          </div>
        )}

        {/* 体力試験合格基準 */}
        <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
          <p style={{ color: "#888", fontSize: "12px", letterSpacing: "0.1em", margin: "0 0 1rem" }}>{goal.jobType}の体力試験合格基準</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {[
              { label: "腕立て", value: standards.pushup + "回" },
              { label: "腹筋", value: standards.situp + "回" },
              { label: "懸垂", value: standards.pullup + "回" },
              { label: "3km走", value: standards.run },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px" }}>{item.label}</p>
                <p style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: "#22c55e" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {chartData.length > 1 && (
          <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
            <p style={{ color: "#888", fontSize: "12px", margin: "0 0 1rem" }}>過去30日間の推移</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" tick={{ fill: "#666", fontSize: 11 }} axisLine={{ stroke: "#333" }} tickLine={false} />
                <YAxis domain={["auto", "auto"]} tick={{ fill: "#666", fontSize: 11 }} axisLine={{ stroke: "#333" }} tickLine={false} width={40} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", color: "#fff" }} />
                <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
          <p style={{ color: "#22c55e", fontSize: "12px", letterSpacing: "0.1em", margin: "0 0 1rem" }}>本日の記録を入力せよ</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "1rem" }}>
            <div>
              <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>記録日</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", padding: "8px 10px", color: "#fff", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>戦闘重量 (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="例: 72.5" style={{ width: "100%", backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", padding: "8px 10px", color: "#fff", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>脂肪率 % (任意)</label>
              <input type="number" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} placeholder="例: 18.0" style={{ width: "100%", backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", padding: "8px 10px", color: "#fff", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
          </div>
          <button onClick={handleSubmit} style={{ width: "100%", backgroundColor: saved ? "#166534" : "#22c55e", color: "#000", border: "none", borderRadius: "6px", padding: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            {saved ? "✓ 記録完了" : "▶ 記録する"}
          </button>
        </div>

        {entries.length > 0 ? (
          <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #222" }}>
              <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>記録一覧（直近10件）</p>
            </div>
            {entries.slice(0, 10).map((entry, i) => (
              <div key={entry.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 1.5rem", borderBottom: i < 9 ? "1px solid #1a1a1a" : "none" }}>
                <span style={{ color: "#888", fontSize: "13px", width: "100px" }}>{entry.date}</span>
                <span style={{ fontSize: "15px", fontWeight: "600", flex: 1 }}>{entry.weight} kg</span>
                <span style={{ color: "#666", fontSize: "13px", width: "80px" }}>{entry.body_fat ? entry.body_fat + "%" : "---"}</span>
                <button onClick={() => handleDelete(entry.id)} style={{ backgroundColor: "transparent", border: "1px solid #333", borderRadius: "4px", color: "#666", fontSize: "12px", padding: "4px 8px", cursor: "pointer" }}>削除</button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#444", padding: "3rem 0" }}>
            <p>まだ記録がありません。最初の記録を入力してください。</p>
          </div>
        )}
      </div>
    </div>
  );
}