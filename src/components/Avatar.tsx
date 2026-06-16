"use client";

type Division = "陸上自衛隊" | "海上自衛隊" | "航空自衛隊";

const RANKS = {
  陸上自衛隊: [
    "3等陸尉", "2等陸尉", "1等陸尉",
    "3等陸佐", "2等陸佐", "1等陸佐",
    "陸将補", "陸将",
  ],
  海上自衛隊: [
    "3等海尉", "2等海尉", "1等海尉",
    "3等海佐", "2等海佐", "1等海佐",
    "海将補", "海将",
  ],
  航空自衛隊: [
    "3等空尉", "2等空尉", "1等空尉",
    "3等空佐", "2等空佐", "1等空佐",
    "空将補", "空将",
  ],
};

const RANK_COLORS = [
  "#888",      // 3等尉
  "#888",      // 2等尉
  "#22c55e",   // 1等尉
  "#22c55e",   // 3等佐
  "#3b82f6",   // 2等佐
  "#3b82f6",   // 1等佐
  "#f59e0b",   // 将補
  "#ef4444",   // 将
];

const RANK_STARS = ["⭐", "⭐", "⭐⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐", "🌟🌟", "👑"];

export function getRankInfo(division: Division, level: number) {
  const ranks = RANKS[division];
  const index = Math.min(level, ranks.length - 1);
  return {
    name: ranks[index],
    color: RANK_COLORS[index],
    stars: RANK_STARS[index],
    index,
  };
}

export function calcLevel(params: {
  streakDays: number;
  fitnessScore: number;
  initialScore: number;
  weightLost: number;
}) {
  const { streakDays, fitnessScore, initialScore, weightLost } = params;
  let level = 0;
  if (streakDays >= 3) level++;
  if (streakDays >= 7) level++;
  if (streakDays >= 14) level++;
  if (fitnessScore - initialScore >= 10) level++;
  if (fitnessScore - initialScore >= 30) level++;
  if (weightLost >= 1) level++;
  if (weightLost >= 3) level++;
  if (weightLost >= 5) level++;
  return Math.min(level, 7);
}

export default function Avatar({ level, color, animate }: { level: number; color: string; animate?: boolean }) {
  const bodyWidth = level >= 6 ? 16 : level >= 4 ? 20 : level >= 2 ? 24 : 28;
  const hasAbs = level >= 5;
  const hasMuscle = level >= 3;

  return (
    <svg width="120" height="200" viewBox="0 0 120 200" style={{ overflow: "visible" }}>
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.03); }
        }
        @keyframes victory {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
        @keyframes walk {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .body-breathe { 
          transform-origin: 60px 100px;
          animation: ${animate ? "breathe 2s ease-in-out infinite" : "none"};
        }
        .arm-victory {
          transform-origin: 60px 80px;
          animation: ${animate && level >= 4 ? "victory 1s ease-in-out infinite" : "none"};
        }
        .body-walk {
          animation: ${animate && level < 4 ? "walk 1s ease-in-out infinite" : "none"};
        }
      `}</style>

      <g className="body-walk">
        {/* ヘルメット */}
        <ellipse cx="60" cy="13" rx="22" ry="10" fill="#166534" opacity="0.95" />
        <rect x="38" y="9" width="44" height="9" rx="2" fill="#166534" opacity="0.95" />

        {/* 頭 */}
        <circle cx="60" cy="30" r="18" fill={color} opacity="0.95" />

        {/* 目 */}
        <circle cx="53" cy="27" r={level >= 4 ? 3.5 : 2.5} fill="#000" />
        <circle cx="67" cy="27" r={level >= 4 ? 3.5 : 2.5} fill="#000" />
        {/* 目の光 */}
        <circle cx="54.5" cy="25.5" r="1" fill="#fff" opacity="0.8" />
        <circle cx="68.5" cy="25.5" r="1" fill="#fff" opacity="0.8" />

        {/* 口 */}
        <path
          d={level >= 3 ? "M 52 35 Q 60 41 68 35" : "M 52 37 Q 60 33 68 37"}
          stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"
        />

        {/* 胴体 */}
        <g className="body-breathe">
          <ellipse cx="60" cy="100" rx={bodyWidth} ry="40" fill={color} opacity="0.9" />

          {/* 筋肉ライン */}
          {hasMuscle && (
            <ellipse cx="60" cy="85" rx={bodyWidth - 4} ry="12" fill={color} opacity="0.6" />
          )}

          {/* 腹筋 */}
          {hasAbs && (
            <>
              <line x1="57" y1="80" x2="57" y2="118" stroke="#0a0a0a" strokeWidth="1.5" opacity="0.35" />
              <line x1="63" y1="80" x2="63" y2="118" stroke="#0a0a0a" strokeWidth="1.5" opacity="0.35" />
              <line x1={60 - bodyWidth + 4} y1="88" x2={60 + bodyWidth - 4} y2="88" stroke="#0a0a0a" strokeWidth="1" opacity="0.25" />
              <line x1={60 - bodyWidth + 4} y1="100" x2={60 + bodyWidth - 4} y2="100" stroke="#0a0a0a" strokeWidth="1" opacity="0.25" />
              <line x1={60 - bodyWidth + 4} y1="112" x2={60 + bodyWidth - 4} y2="112" stroke="#0a0a0a" strokeWidth="1" opacity="0.25" />
            </>
          )}
        </g>

        {/* 腕 */}
        <g className="arm-victory">
          <ellipse cx={60 - bodyWidth - 6} cy="88" rx="8" ry={hasMuscle ? 30 : 26} fill={color} opacity="0.85"
            transform={`rotate(${level >= 4 ? -20 : -10} ${60 - bodyWidth - 6} 88)`} />
          <ellipse cx={60 + bodyWidth + 6} cy="88" rx="8" ry={hasMuscle ? 30 : 26} fill={color} opacity="0.85"
            transform={`rotate(${level >= 4 ? 20 : 10} ${60 + bodyWidth + 6} 88)`} />
        </g>

        {/* 脚 */}
        <ellipse cx="48" cy="158" rx={level >= 3 ? 11 : 13} ry="34" fill={color} opacity="0.9"
          transform="rotate(3 48 158)" />
        <ellipse cx="72" cy="158" rx={level >= 3 ? 11 : 13} ry="34" fill={color} opacity="0.9"
          transform="rotate(-3 72 158)" />

        {/* 階級章（肩） */}
        {level >= 2 && (
          <>
            <circle cx={60 - bodyWidth + 2} cy="72" r="5" fill="#fbbf24" opacity="0.9" />
            <circle cx={60 + bodyWidth - 2} cy="72" r="5" fill="#fbbf24" opacity="0.9" />
          </>
        )}
        {level >= 5 && (
          <>
            <circle cx={60 - bodyWidth + 2} cy="62" r="4" fill="#ef4444" opacity="0.9" />
            <circle cx={60 + bodyWidth - 2} cy="62" r="4" fill="#ef4444" opacity="0.9" />
          </>
        )}
      </g>
    </svg>
  );
}