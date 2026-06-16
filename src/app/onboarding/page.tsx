"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Avatar, { getRankInfo } from "@/components/Avatar";

type Step = "profile" | "calories" | "test" | "result";
type ActivityLevel = "low" | "medium" | "high" | "very_high";
type Division = "陸上自衛隊" | "海上自衛隊" | "航空自衛隊";

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  low: "ほぼ座っている（デスクワーク）",
  medium: "週1〜3回軽い運動",
  high: "週4〜5回運動",
  very_high: "毎日ハードに運動",
};

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  low: 1.2,
  medium: 1.375,
  high: 1.55,
  very_high: 1.725,
};

const DIVISION_ICONS: Record<Division, string> = {
  陸上自衛隊: "🪖",
  海上自衛隊: "⚓",
  航空自衛隊: "✈️",
};

function calcBMR(age: number, weight: number, height: number) {
  return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("profile");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("medium");
  const [division, setDivision] = useState<Division>("陸上自衛隊");
  const [tdee, setTdee] = useState(0);
  const [testStep, setTestStep] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const [counting, setCounting] = useState(false);
  const [pushup, setPushup] = useState("");
  const [situp, setSitup] = useState("");
  const [squat, setSquat] = useState("");

  const handleProfileNext = () => {
    if (!age || !weight || !height) return;
    const bmr = calcBMR(parseInt(age), parseFloat(weight), parseFloat(height));
    const calculated = Math.round(bmr * ACTIVITY_MULTIPLIERS[activity]);
    setTdee(calculated);
    setStep("calories");
  };

  const startTimer = (seconds: number) => {
    setCounting(true);
    setTimer(seconds);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setCounting(false);
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            osc.connect(ctx.destination);
            osc.frequency.value = 880;
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
          } catch {}
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTestNext = () => {
    if (testStep < 2) {
      setTestStep(testStep + 1);
      setTimer(null);
      setCounting(false);
    } else {
      const initialScore = parseInt(pushup || "0") + parseInt(situp || "0") + parseInt(squat || "0");
      localStorage.setItem("user-profile", JSON.stringify({
        age, weight, height, activity, tdee, division,
        pushup, situp, squat,
        initialScore,
        level: 0,
        streakDays: 0,
        weightLost: 0,
        createdAt: new Date().toISOString(),
      }));
      setStep("result");
    }
  };

  const testItems = [
    { label: "腕立て伏せ", value: pushup, set: setPushup, seconds: 30, icon: "💪" },
    { label: "腹筋（上体起こし）", value: situp, set: setSitup, seconds: 30, icon: "🔥" },
    { label: "スクワット", value: squat, set: setSquat, seconds: 30, icon: "🦵" },
  ];

  const current = testItems[testStep];
  const rankInfo = getRankInfo(division, 0);

  const s = {
    width: "100%", backgroundColor: "#1a1a1a", border: "1px solid #333",
    borderRadius: "6px", padding: "10px 14px", color: "#fff",
    fontSize: "16px", boxSizing: "border-box" as const
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#fff", fontFamily: "sans-serif", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>

        {/* STEP 1: プロフィール */}
        {step === "profile" && (
          <>
            <div style={{ marginBottom: "2rem", textAlign: "center" }}>
              <p style={{ color: "#22c55e", fontSize: "12px", letterSpacing: "0.2em", margin: "0 0 8px" }}>STEP 1 / 3</p>
              <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 8px" }}>入隊申請</h1>
              <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>まず基本情報を申告せよ</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { label: "年齢", value: age, set: setAge, placeholder: "例: 25", unit: "歳" },
                { label: "体重", value: weight, set: setWeight, placeholder: "例: 70", unit: "kg" },
                { label: "身長", value: height, set: setHeight, placeholder: "例: 170", unit: "cm" },
              ].map((f) => (
                <div key={f.label}>
                  <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>{f.label}</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input type="number" value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder} style={s} />
                    <span style={{ color: "#666", fontSize: "14px", whiteSpace: "nowrap" }}>{f.unit}</span>
                  </div>
                </div>
              ))}

              <div>
                <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>所属部隊</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {(["陸上自衛隊", "海上自衛隊", "航空自衛隊"] as Division[]).map((d) => (
                    <button key={d} onClick={() => setDivision(d)}
                      style={{ flex: 1, padding: "10px 6px", borderRadius: "6px", border: "1px solid", cursor: "pointer", fontSize: "12px", textAlign: "center", borderColor: division === d ? "#22c55e" : "#333", backgroundColor: division === d ? "#14532d" : "#1a1a1a", color: division === d ? "#22c55e" : "#888" }}>
                      <div style={{ fontSize: "20px", marginBottom: "4px" }}>{DIVISION_ICONS[d]}</div>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>活動量</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((key) => (
                    <button key={key} onClick={() => setActivity(key)}
                      style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid", textAlign: "left", cursor: "pointer", fontSize: "13px", borderColor: activity === key ? "#22c55e" : "#333", backgroundColor: activity === key ? "#14532d" : "#1a1a1a", color: activity === key ? "#22c55e" : "#888" }}>
                      {ACTIVITY_LABELS[key]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleProfileNext} disabled={!age || !weight || !height}
              style={{ width: "100%", backgroundColor: !age || !weight || !height ? "#1a1a1a" : "#22c55e", color: !age || !weight || !height ? "#555" : "#000", border: "none", borderRadius: "6px", padding: "14px", fontSize: "16px", fontWeight: "700", cursor: !age || !weight || !height ? "not-allowed" : "pointer" }}>
              次へ →
            </button>
          </>
        )}

        {/* STEP 2: カロリー */}
        {step === "calories" && (
          <>
            <div style={{ marginBottom: "2rem", textAlign: "center" }}>
              <p style={{ color: "#22c55e", fontSize: "12px", letterSpacing: "0.2em", margin: "0 0 8px" }}>STEP 2 / 3</p>
              <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 8px" }}>消費カロリー算出</h1>
              <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>お前の1日の消費カロリーだ</p>
            </div>

            <div style={{ backgroundColor: "#0f2a1a", border: "1px solid #22c55e", borderRadius: "8px", padding: "2rem", textAlign: "center", marginBottom: "2rem" }}>
              <p style={{ color: "#888", fontSize: "12px", margin: "0 0 8px" }}>1日の総消費カロリー（TDEE）</p>
              <p style={{ fontSize: "48px", fontWeight: "700", color: "#22c55e", margin: "0 0 8px" }}>{tdee.toLocaleString()}</p>
              <p style={{ color: "#888", fontSize: "14px", margin: "0 0 1.5rem" }}>kcal / 日</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", textAlign: "left" }}>
                <div style={{ backgroundColor: "#111", borderRadius: "6px", padding: "12px" }}>
                  <p style={{ color: "#888", fontSize: "11px", margin: "0 0 4px" }}>ダイエット目標</p>
                  <p style={{ fontSize: "16px", fontWeight: "700", margin: 0, color: "#22c55e" }}>{(tdee - 500).toLocaleString()} kcal</p>
                  <p style={{ color: "#666", fontSize: "11px", margin: 0 }}>月2kg減ペース</p>
                </div>
                <div style={{ backgroundColor: "#111", borderRadius: "6px", padding: "12px" }}>
                  <p style={{ color: "#888", fontSize: "11px", margin: "0 0 4px" }}>維持カロリー</p>
                  <p style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>{tdee.toLocaleString()} kcal</p>
                  <p style={{ color: "#666", fontSize: "11px", margin: 0 }}>体重維持</p>
                </div>
              </div>
            </div>

            <button onClick={() => setStep("test")}
              style={{ width: "100%", backgroundColor: "#22c55e", color: "#000", border: "none", borderRadius: "6px", padding: "14px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
              入隊テスト開始 →
            </button>
          </>
        )}

        {/* STEP 3: 体力テスト */}
        {step === "test" && (
          <>
            <div style={{ marginBottom: "2rem", textAlign: "center" }}>
              <p style={{ color: "#22c55e", fontSize: "12px", letterSpacing: "0.2em", margin: "0 0 8px" }}>STEP 3 / 3</p>
              <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 8px" }}>入隊テスト</h1>
              <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>{testStep + 1} / 3 種目</p>
            </div>

            <div style={{ backgroundColor: "#1a1a1a", borderRadius: "4px", height: "4px", marginBottom: "2rem" }}>
              <div style={{ backgroundColor: "#22c55e", height: "4px", borderRadius: "4px", width: `${((testStep + 1) / 3) * 100}%`, transition: "width 0.3s" }} />
            </div>

            <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "2rem", marginBottom: "2rem", textAlign: "center" }}>
              <p style={{ fontSize: "32px", margin: "0 0 8px" }}>{current.icon}</p>
              <h2 style={{ fontSize: "22px", fontWeight: "700", margin: "0 0 8px" }}>{current.label}</h2>
              <p style={{ color: "#888", fontSize: "14px", margin: "0 0 2rem" }}>{current.seconds}秒間で何回できるか計測せよ</p>

              {timer !== null ? (
                <div style={{ fontSize: "64px", fontWeight: "700", color: timer <= 5 ? "#ef4444" : "#22c55e", marginBottom: "1rem" }}>
                  {timer}
                </div>
              ) : (
                <button onClick={() => startTimer(current.seconds)} disabled={counting}
                  style={{ backgroundColor: "#22c55e", color: "#000", border: "none", borderRadius: "6px", padding: "12px 24px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginBottom: "1rem" }}>
                  ▶ タイマー開始
                </button>
              )}

              <div style={{ marginTop: "1rem" }}>
                <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>回数を入力</label>
                <input type="number" value={current.value} onChange={(e) => current.set(e.target.value)} placeholder="0"
                  style={{ ...s, fontSize: "24px", textAlign: "center", fontWeight: "700" }} />
              </div>
            </div>

            <button onClick={handleTestNext} disabled={counting}
              style={{ width: "100%", backgroundColor: counting ? "#1a1a1a" : "#22c55e", color: counting ? "#555" : "#000", border: "none", borderRadius: "6px", padding: "14px", fontSize: "16px", fontWeight: "700", cursor: counting ? "not-allowed" : "pointer" }}>
              {testStep < 2 ? "次の種目 →" : "結果を見る →"}
            </button>
          </>
        )}

        {/* 結果 */}
        {step === "result" && (
          <>
            <div style={{ marginBottom: "2rem", textAlign: "center" }}>
              <p style={{ color: "#22c55e", fontSize: "12px", letterSpacing: "0.2em", margin: "0 0 8px" }}>RESULT</p>
              <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 8px" }}>入隊完了</h1>
              <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>お前の階級が決まった</p>
            </div>

            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <Avatar level={0} color={rankInfo.color} animate={true} />
              <p style={{ fontSize: "14px", color: "#888", margin: "4px 0 2px" }}>{DIVISION_ICONS[division]} {division}</p>
              <p style={{ fontSize: "24px", fontWeight: "700", color: rankInfo.color, margin: "0 0 4px" }}>{rankInfo.stars} {rankInfo.name}</p>
              <p style={{ color: "#666", fontSize: "12px", margin: 0 }}>トレーニングを続けて階級を上げろ！</p>
            </div>

            <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <p style={{ color: "#888", fontSize: "12px", margin: "0 0 1rem", letterSpacing: "0.1em" }}>入隊テスト結果</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", textAlign: "center" }}>
                {[
                  { label: "腕立て", value: pushup },
                  { label: "腹筋", value: situp },
                  { label: "スクワット", value: squat },
                ].map((item) => (
                  <div key={item.label}>
                    <p style={{ color: "#888", fontSize: "11px", margin: "0 0 4px" }}>{item.label}</p>
                    <p style={{ fontSize: "24px", fontWeight: "700", margin: 0, color: rankInfo.color }}>{item.value || "0"}回</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: "#0f2a1a", border: "1px solid #22c55e", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
              <p style={{ color: "#22c55e", fontSize: "12px", margin: "0 0 8px", letterSpacing: "0.1em" }}>1日の目標カロリー</p>
              <p style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 4px", color: "#22c55e" }}>{(tdee - 500).toLocaleString()} kcal</p>
              <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>このカロリーで食事管理すれば月2kg減</p>
            </div>

            <button onClick={() => router.push("/coach")}
              style={{ width: "100%", backgroundColor: "#22c55e", color: "#000", border: "none", borderRadius: "6px", padding: "14px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
              訓練開始 →
            </button>
          </>
        )}
      </div>
    </div>
  );
}