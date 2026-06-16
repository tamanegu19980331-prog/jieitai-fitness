"use client";

import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type JobType = "自衛隊" | "消防士" | "警察官";

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

const STANDARDS: Record<JobType, { pushup: number; situp: number; pullup: number; run: number; lateral: number; grip: number; jump: number }> = {
  自衛隊: { pushup: 44, situp: 48, pullup: 5, run: 875, lateral: 0, grip: 0, jump: 0 },
  消防士: { pushup: 30, situp: 25, pullup: 6, run: 720, lateral: 50, grip: 50, jump: 220 },
  警察官: { pushup: 30, situp: 25, pullup: 0, run: 780, lateral: 45, grip: 45, jump: 0 },
};

const getDeviceId = () => {
  let id = localStorage.getItem("device-id");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("device-id", id);
  }
  return id;
};

function TimerButton({ label, seconds, onComplete }: { label: string; seconds: number; onComplete: () => void }) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (running) {
      clearInterval(timerRef.current!);
      setRunning(false);
      setTimeLeft(null);
      return;
    }
    setTimeLeft(seconds);
    setRunning(true);
    let t = seconds;
    timerRef.current = setInterval(() => {
      t -= 1;
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(timerRef.current!);
        setRunning(false);
        setTimeLeft(null);
        // 終了音
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        osc.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
        onComplete();
      }
    }, 1000);
  };

  return (
    <button onClick={start} style={{
      padding: "6px 10px", borderRadius: "6px", border: "1px solid",
      borderColor: running ? "#ef4444" : "#22c55e",
      backgroundColor: running ? "#2a0f0f" : "#0f2a1a",
      color: running ? "#ef4444" : "#22c55e",
      fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap"
    }}>
      {running ? `⏱ ${timeLeft}秒` : `▶ ${label}${seconds}秒`}
    </button>
  );
}

export default function FitnessLogPage() {
  const [entries, setEntries] = useState<FitnessEntry[]>([]);
  const [jobType, setJobType] = useState<JobType>("消防士");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [pushup, setPushup] = useState("");
  const [situp, setSitup] = useState("");
  const [pullup, setPullup] = useState("");
  const [lateral, setLateral] = useState("");
  const [grip, setGrip] = useState("");
  const [jump, setJump] = useState("");
  const [runMin, setRunMin] = useState("");
  const [runSec, setRunSec] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"fitness" | "body">("fitness");

  const situpRef = useRef<HTMLInputElement>(null);
  const lateralRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const deviceId = getDeviceId();
    const stored = localStorage.getItem(`fitness-log-${deviceId}`);
    if (stored) setEntries(JSON.parse(stored));
    const savedJob = localStorage.getItem("job-type") as JobType;
    if (savedJob) setJobType(savedJob);
  }, []);

  const save = (updated: FitnessEntry[]) => {
    const deviceId = getDeviceId();
    localStorage.setItem(`fitness-log-${deviceId}`, JSON.stringify(updated));
    setEntries(updated);
  };

  const handleSubmit = () => {
    const entry: FitnessEntry = {
      id: Date.now().toString(),
      date,
      pushup: pushup ? parseInt(pushup) : null,
      situp: situp ? parseInt(situp) : null,
      pullup: pullup ? parseInt(pullup) : null,
      lateral: lateral ? parseInt(lateral) : null,
      grip: grip ? parseInt(grip) : null,
      jump: jump ? parseInt(jump) : null,
      run_min: runMin ? parseInt(runMin) : null,
      run_sec: runSec ? parseInt(runSec) : null,
      weight: weight ? parseFloat(weight) : null,
      body_fat: bodyFat ? parseFloat(bodyFat) : null,
    };
    const updated = [entry, ...entries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 90);
    save(updated);
    setPushup(""); setSitup(""); setPullup("");
    setLateral(""); setGrip(""); setJump("");
    setRunMin(""); setRunSec(""); setWeight(""); setBodyFat("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    save(entries.filter((e) => e.id !== id));
  };

  const handleJobChange = (job: JobType) => {
    setJobType(job);
    localStorage.setItem("job-type", job);
  };

  const latest = entries[0];
  const standards = STANDARDS[jobType];

  const getStatus = (value: number | null, target: number, isRun = false) => {
    if (target === 0) return { color: "#888", label: "対象外", diff: null };
    if (value === null) return { color: "#888", label: "未記録", diff: null };
    if (isRun) {
      const diff = value - target;
      return diff <= 0
        ? { color: "#22c55e", label: "合格", diff }
        : { color: "#ef4444", label: `あと${diff}秒`, diff };
    }
    const diff = value - target;
    return diff >= 0
      ? { color: "#22c55e", label: "合格", diff }
      : { color: "#ef4444", label: `あと${Math.abs(diff)}回`, diff };
  };

  const runSeconds = latest ? (latest.run_min ?? 0) * 60 + (latest.run_sec ?? 0) : null;
  const pushupStatus = getStatus(latest?.pushup ?? null, standards.pushup);
  const situpStatus = getStatus(latest?.situp ?? null, standards.situp);
  const pullupStatus = getStatus(latest?.pullup ?? null, standards.pullup);
  const runStatus = getStatus(runSeconds, standards.run, true);

  const chartDataFitness = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30)
    .map((e) => ({
      date: e.date.slice(5),
      腕立て: e.pushup,
      腹筋: e.situp,
      懸垂: e.pullup,
      反復横跳び: e.lateral,
    }));

  const chartDataBody = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30)
    .map((e) => ({
      date: e.date.slice(5),
      体重: e.weight,
      体脂肪率: e.body_fat,
    }));

  const inputStyle = {
    width: "100%", backgroundColor: "#1a1a1a", border: "1px solid #333",
    borderRadius: "6px", padding: "8px 10px", color: "#fff",
    fontSize: "14px", boxSizing: "border-box" as const
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#ffffff", fontFamily: "sans-serif", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        <div style={{ marginBottom: "2rem" }}>
          <p style={{ color: "#22c55e", fontSize: "12px", letterSpacing: "0.15em", margin: "0 0 4px" }}>FITNESS LOG</p>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px" }}>体力記録ログ</h1>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>毎日記録して合格をつかめ。</p>
        </div>

        {/* 職種選択 */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 8px" }}>目標職種</p>
          <div style={{ display: "flex", gap: "8px" }}>
            {(["自衛隊", "消防士", "警察官"] as JobType[]).map((job) => (
              <button key={job} onClick={() => handleJobChange(job)}
                style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid", borderColor: jobType === job ? "#22c55e" : "#333", backgroundColor: jobType === job ? "#14532d" : "#1a1a1a", color: jobType === job ? "#22c55e" : "#888", fontSize: "14px", cursor: "pointer" }}>
                {job}
              </button>
            ))}
          </div>
        </div>

        {/* 合格基準表 */}
        <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", overflow: "hidden", marginBottom: "1.5rem" }}>
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #222" }}>
            <p style={{ color: "#22c55e", fontSize: "12px", margin: 0, letterSpacing: "0.1em" }}>{jobType}の合格基準</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0" }}>
            {[
              { label: "腕立て", value: standards.pushup > 0 ? standards.pushup + "回" : "---", unit: "以上" },
              { label: "腹筋", value: standards.situp > 0 ? standards.situp + "回" : "---", unit: "30秒" },
              { label: "懸垂", value: standards.pullup > 0 ? standards.pullup + "回" : "---", unit: "以上" },
              { label: "反復横跳び", value: standards.lateral > 0 ? standards.lateral + "回" : "---", unit: "20秒" },
              { label: "握力", value: standards.grip > 0 ? standards.grip + "kg" : "---", unit: "以上" },
              { label: "立ち幅跳び", value: standards.jump > 0 ? standards.jump + "cm" : "---", unit: "以上" },
              { label: "3km走", value: standards.run > 0 ? `${Math.floor(standards.run / 60)}:${String(standards.run % 60).padStart(2, "0")}` : "---", unit: "以内" },
            ].map((item, i) => (
              <div key={item.label} style={{ padding: "0.8rem 0.4rem", textAlign: "center", borderRight: i < 6 ? "1px solid #1a1a1a" : "none" }}>
                <p style={{ color: "#888", fontSize: "10px", margin: "0 0 4px" }}>{item.label}</p>
                <p style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 2px", color: "#22c55e" }}>{item.value}</p>
                <p style={{ color: "#666", fontSize: "10px", margin: 0 }}>{item.unit}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "8px 1.5rem", borderTop: "1px solid #1a1a1a" }}>
            <p style={{ color: "#555", fontSize: "11px", margin: 0 }}>※自治体・採用年度により異なります</p>
          </div>
        </div>

        {/* 合格状況 */}
        {latest && (
          <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
            <p style={{ color: "#888", fontSize: "12px", margin: "0 0 1rem", letterSpacing: "0.1em" }}>{jobType}の合格状況</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {[
                { label: "腕立て", value: latest.pushup, status: pushupStatus, unit: "回" },
                { label: "腹筋", value: latest.situp, status: situpStatus, unit: "回" },
                { label: "懸垂", value: latest.pullup, status: pullupStatus, unit: "回" },
                { label: "3km走", value: runSeconds ? `${latest.run_min}:${String(latest.run_sec).padStart(2, "0")}` : null, status: runStatus, unit: "" },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: "center" }}>
                  <p style={{ color: "#888", fontSize: "11px", margin: "0 0 4px" }}>{item.label}</p>
                  <p style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 2px" }}>{item.value ?? "---"}{item.unit}</p>
                  <p style={{ fontSize: "11px", margin: 0, color: item.status.color }}>{item.status.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* タブ */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
          {[{ key: "fitness", label: "体力記録" }, { key: "body", label: "体重・体脂肪" }].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as "fitness" | "body")}
              style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid", borderColor: activeTab === tab.key ? "#22c55e" : "#333", backgroundColor: activeTab === tab.key ? "#14532d" : "#1a1a1a", color: activeTab === tab.key ? "#22c55e" : "#888", fontSize: "14px", cursor: "pointer" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* グラフ */}
        {activeTab === "fitness" && chartDataFitness.length > 1 && (
          <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
            <p style={{ color: "#888", fontSize: "12px", margin: "0 0 1rem" }}>過去30日間の推移</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartDataFitness}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" tick={{ fill: "#666", fontSize: 11 }} axisLine={{ stroke: "#333" }} tickLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={{ stroke: "#333" }} tickLine={false} width={30} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", color: "#fff" }} />
                <Line type="monotone" dataKey="腕立て" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="腹筋" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="懸垂" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="反復横跳び" stroke="#ec4899" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "body" && chartDataBody.length > 1 && (
          <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
            <p style={{ color: "#888", fontSize: "12px", margin: "0 0 1rem" }}>過去30日間の推移</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartDataBody}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" tick={{ fill: "#666", fontSize: 11 }} axisLine={{ stroke: "#333" }} tickLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={{ stroke: "#333" }} tickLine={false} width={30} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", color: "#fff" }} />
                <Line type="monotone" dataKey="体重" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="体脂肪率" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 入力フォーム */}
        <div style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
          <p style={{ color: "#22c55e", fontSize: "12px", letterSpacing: "0.1em", margin: "0 0 1rem" }}>本日の記録を入力せよ</p>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>記録日</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
          </div>

          {activeTab === "fitness" && (
            <>
              {/* 腕立て */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>腕立て（回）</label>
                <input type="number" value={pushup} onChange={(e) => setPushup(e.target.value)} placeholder="0" style={inputStyle} />
              </div>

              {/* 腹筋 タイマーあり */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ color: "#888", fontSize: "12px" }}>腹筋（30秒・回）</label>
                  <TimerButton label="計測 " seconds={30} onComplete={() => situpRef.current?.focus()} />
                </div>
                <input ref={situpRef} type="number" value={situp} onChange={(e) => setSitup(e.target.value)} placeholder="0" style={inputStyle} />
              </div>

              {/* 懸垂 */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>懸垂（回）</label>
                <input type="number" value={pullup} onChange={(e) => setPullup(e.target.value)} placeholder="0" style={inputStyle} />
              </div>

              {/* 反復横跳び タイマーあり */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ color: "#888", fontSize: "12px" }}>反復横跳び（20秒・回）</label>
                  <TimerButton label="計測 " seconds={20} onComplete={() => lateralRef.current?.focus()} />
                </div>
                <input ref={lateralRef} type="number" value={lateral} onChange={(e) => setLateral(e.target.value)} placeholder="0" style={inputStyle} />
              </div>

              {/* 握力・立ち幅跳び */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1rem" }}>
                <div>
                  <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>握力（kg）</label>
                  <input type="number" value={grip} onChange={(e) => setGrip(e.target.value)} placeholder="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>立ち幅跳び（cm）</label>
                  <input type="number" value={jump} onChange={(e) => setJump(e.target.value)} placeholder="0" style={inputStyle} />
                </div>
              </div>

              {/* 3km走 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1rem" }}>
                <div>
                  <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>3km走（分）</label>
                  <input type="number" value={runMin} onChange={(e) => setRunMin(e.target.value)} placeholder="13" style={inputStyle} />
                </div>
                <div>
                  <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>3km走（秒）</label>
                  <input type="number" value={runSec} onChange={(e) => setRunSec(e.target.value)} placeholder="30" style={inputStyle} />
                </div>
              </div>
            </>
          )}

          {activeTab === "body" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1rem" }}>
              <div>
                <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>体重（kg）</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70.0" style={inputStyle} />
              </div>
              <div>
                <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>体脂肪率（%）</label>
                <input type="number" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} placeholder="18.0" style={inputStyle} />
              </div>
            </div>
          )}

          <button onClick={handleSubmit}
            style={{ width: "100%", backgroundColor: saved ? "#166534" : "#22c55e", color: "#000", border: "none", borderRadius: "6px", padding: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            {saved ? "✓ 記録完了" : "▶ 記録する"}
          </button>
        </div>

        {/* 履歴 */}
        {entries.length > 0 && (
          <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #222" }}>
              <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>記録一覧（直近10件）</p>
            </div>
            {entries.slice(0, 10).map((entry, i) => (
              <div key={entry.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 1.5rem", borderBottom: i < 9 ? "1px solid #1a1a1a" : "none", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ color: "#888", fontSize: "13px" }}>{entry.date}</span>
                <span style={{ fontSize: "13px", color: "#ccc" }}>
                  {entry.pushup !== null && `腕立て${entry.pushup} `}
                  {entry.situp !== null && `腹筋${entry.situp} `}
                  {entry.pullup !== null && `懸垂${entry.pullup} `}
                  {entry.lateral !== null && `反復${entry.lateral} `}
                  {entry.grip !== null && `握力${entry.grip}kg `}
                  {entry.jump !== null && `幅跳${entry.jump}cm `}
                  {entry.run_min !== null && `走${entry.run_min}:${String(entry.run_sec).padStart(2, "0")} `}
                  {entry.weight !== null && `${entry.weight}kg `}
                  {entry.body_fat !== null && `${entry.body_fat}%`}
                </span>
                <button onClick={() => handleDelete(entry.id)}
                  style={{ backgroundColor: "transparent", border: "1px solid #333", borderRadius: "4px", color: "#666", fontSize: "12px", padding: "4px 8px", cursor: "pointer" }}>
                  削除
                </button>
              </div>
            ))}
          </div>
        )}

        {entries.length === 0 && (
          <div style={{ textAlign: "center", color: "#444", padding: "3rem 0" }}>
            <p>まだ記録がありません。最初の記録を入力してください。</p>
          </div>
        )}
      </div>
    </div>
  );
}