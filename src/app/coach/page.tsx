'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type Division = 'ground' | 'maritime' | 'air';
type Level = 'recruit' | 'general' | 'ranger';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  icon: string;
  tip: string;
}

interface TrainingMenu {
  missionName: string;
  warmup: Exercise[];
  main: Exercise[];
  cooldown: Exercise[];
  commanders_note: string;
}

const divisionInfo = {
  ground: { label: '陸上自衛隊', icon: '🪖' },
  maritime: { label: '海上自衛隊', icon: '⚓' },
  air: { label: '航空自衛隊', icon: '✈️' },
};

const levelInfo = {
  recruit: { label: '新隊員', sublabel: '初級', icon: '⭐' },
  general: { label: '一般隊員', sublabel: '中級', icon: '⭐⭐' },
  ranger: { label: 'レンジャー', sublabel: '上級', icon: '⭐⭐⭐' },
};

function PushupAnimation() {
  return (
    <div className="flex items-center justify-center h-32 bg-green-950/30 rounded mb-4">
      <svg width="200" height="100" viewBox="0 0 200 100">
        <style>{`
          @keyframes pushup-body {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .pushup-body { animation: pushup-body 1.2s ease-in-out infinite; transform-origin: 140px 70px; }
        `}</style>
        <g className="pushup-body">
          <circle cx="60" cy="30" r="10" fill="#4ade80" />
          <line x1="60" y1="40" x2="60" y2="70" stroke="#4ade80" strokeWidth="3" />
          <line x1="60" y1="50" x2="30" y2="65" stroke="#4ade80" strokeWidth="3" />
          <line x1="60" y1="50" x2="90" y2="65" stroke="#4ade80" strokeWidth="3" />
          <line x1="60" y1="70" x2="40" y2="85" stroke="#4ade80" strokeWidth="3" />
          <line x1="60" y1="70" x2="80" y2="85" stroke="#4ade80" strokeWidth="3" />
          <circle cx="30" cy="67" r="4" fill="#4ade80" />
          <circle cx="90" cy="67" r="4" fill="#4ade80" />
        </g>
        <line x1="20" y1="90" x2="180" y2="90" stroke="#166534" strokeWidth="2" />
        <text x="100" y="98" textAnchor="middle" fill="#4ade80" fontSize="8">腕立て伏せ</text>
      </svg>
    </div>
  );
}

function SquatAnimation() {
  return (
    <div className="flex items-center justify-center h-32 bg-green-950/30 rounded mb-4">
      <svg width="200" height="100" viewBox="0 0 200 100">
        <style>{`
          @keyframes squat-body {
            0%, 100% { transform: translateY(0px) scaleY(1); }
            50% { transform: translateY(15px) scaleY(0.75); }
          }
          .squat-body { animation: squat-body 1.2s ease-in-out infinite; transform-origin: 100px 50px; }
        `}</style>
        <g className="squat-body">
          <circle cx="100" cy="20" r="10" fill="#4ade80" />
          <line x1="100" y1="30" x2="100" y2="60" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="40" x2="75" y2="50" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="40" x2="125" y2="50" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="60" x2="80" y2="80" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="60" x2="120" y2="80" stroke="#4ade80" strokeWidth="3" />
          <line x1="80" y1="80" x2="75" y2="88" stroke="#4ade80" strokeWidth="3" />
          <line x1="120" y1="80" x2="125" y2="88" stroke="#4ade80" strokeWidth="3" />
        </g>
        <line x1="20" y1="90" x2="180" y2="90" stroke="#166534" strokeWidth="2" />
        <text x="100" y="98" textAnchor="middle" fill="#4ade80" fontSize="8">スクワット</text>
      </svg>
    </div>
  );
}

function PlankAnimation() {
  return (
    <div className="flex items-center justify-center h-32 bg-green-950/30 rounded mb-4">
      <svg width="200" height="100" viewBox="0 0 200 100">
        <style>{`
          @keyframes plank-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          .plank-body { animation: plank-pulse 2s ease-in-out infinite; }
        `}</style>
        <g className="plank-body">
          <circle cx="150" cy="45" r="10" fill="#4ade80" />
          <line x1="140" y1="45" x2="50" y2="55" stroke="#4ade80" strokeWidth="4" />
          <line x1="120" y1="47" x2="110" y2="70" stroke="#4ade80" strokeWidth="3" />
          <line x1="80" y1="52" x2="70" y2="70" stroke="#4ade80" strokeWidth="3" />
          <circle cx="110" cy="72" r="4" fill="#4ade80" />
          <circle cx="70" cy="72" r="4" fill="#4ade80" />
        </g>
        <line x1="20" y1="75" x2="180" y2="75" stroke="#166534" strokeWidth="2" />
        <text x="100" y="90" textAnchor="middle" fill="#4ade80" fontSize="8">プランク（体幹維持）</text>
      </svg>
    </div>
  );
}

function BurpeeAnimation() {
  return (
    <div className="flex items-center justify-center h-32 bg-green-950/30 rounded mb-4">
      <svg width="200" height="100" viewBox="0 0 200 100">
        <style>{`
          @keyframes burpee-jump {
            0% { transform: translateY(0px) scaleY(1); }
            25% { transform: translateY(-25px) scaleY(1.1); }
            50% { transform: translateY(0px) scaleY(0.7); }
            75% { transform: translateY(-10px) scaleY(1.05); }
            100% { transform: translateY(0px) scaleY(1); }
          }
          .burpee-body { animation: burpee-jump 1.5s ease-in-out infinite; transform-origin: 100px 70px; }
        `}</style>
        <g className="burpee-body">
          <circle cx="100" cy="20" r="10" fill="#4ade80" />
          <line x1="100" y1="30" x2="100" y2="60" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="40" x2="75" y2="30" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="40" x2="125" y2="30" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="60" x2="80" y2="80" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="60" x2="120" y2="80" stroke="#4ade80" strokeWidth="3" />
        </g>
        <line x1="20" y1="88" x2="180" y2="88" stroke="#166534" strokeWidth="2" />
        <text x="100" y="98" textAnchor="middle" fill="#4ade80" fontSize="8">バーピー</text>
      </svg>
    </div>
  );
}

function MountainClimberAnimation() {
  return (
    <div className="flex items-center justify-center h-32 bg-green-950/30 rounded mb-4">
      <svg width="200" height="100" viewBox="0 0 200 100">
        <style>{`
          @keyframes mountain-left {
            0%, 100% { transform: translateX(0px) translateY(0px); }
            50% { transform: translateX(15px) translateY(-10px); }
          }
          @keyframes mountain-right {
            0%, 100% { transform: translateX(0px) translateY(0px); }
            50% { transform: translateX(-15px) translateY(-10px); }
          }
          .mountain-leg-left { animation: mountain-left 0.8s ease-in-out infinite; transform-origin: 100px 60px; }
          .mountain-leg-right { animation: mountain-right 0.8s ease-in-out infinite; transform-origin: 100px 60px; }
        `}</style>
        <circle cx="150" cy="35" r="10" fill="#4ade80" />
        <line x1="140" y1="35" x2="50" y2="55" stroke="#4ade80" strokeWidth="4" />
        <line x1="130" y1="37" x2="120" y2="55" stroke="#4ade80" strokeWidth="3" />
        <circle cx="50" cy="57" r="4" fill="#4ade80" />
        <circle cx="120" cy="57" r="4" fill="#4ade80" />
        <g className="mountain-leg-left">
          <line x1="110" y1="50" x2="95" y2="70" stroke="#4ade80" strokeWidth="3" />
        </g>
        <g className="mountain-leg-right">
          <line x1="90" y1="53" x2="110" y2="70" stroke="#4ade80" strokeWidth="3" />
        </g>
        <line x1="20" y1="75" x2="180" y2="75" stroke="#166534" strokeWidth="2" />
        <text x="100" y="88" textAnchor="middle" fill="#4ade80" fontSize="8">マウンテンクライマー</text>
      </svg>
    </div>
  );
}

function JumpAnimation() {
  return (
    <div className="flex items-center justify-center h-32 bg-green-950/30 rounded mb-4">
      <svg width="200" height="100" viewBox="0 0 200 100">
        <style>{`
          @keyframes jump-up {
            0%, 100% { transform: translateY(0px); }
            40%, 60% { transform: translateY(-25px); }
          }
          .jump-body { animation: jump-up 1s ease-in-out infinite; transform-origin: 100px 80px; }
        `}</style>
        <g className="jump-body">
          <circle cx="100" cy="20" r="10" fill="#4ade80" />
          <line x1="100" y1="30" x2="100" y2="60" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="40" x2="70" y2="30" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="40" x2="130" y2="30" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="60" x2="80" y2="80" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="60" x2="120" y2="80" stroke="#4ade80" strokeWidth="3" />
        </g>
        <line x1="20" y1="88" x2="180" y2="88" stroke="#166534" strokeWidth="2" />
        <text x="100" y="98" textAnchor="middle" fill="#4ade80" fontSize="8">ジャンプ系</text>
      </svg>
    </div>
  );
}

function CrunchAnimation() {
  return (
    <div className="flex items-center justify-center h-32 bg-green-950/30 rounded mb-4">
      <svg width="200" height="100" viewBox="0 0 200 100">
        <style>{`
          @keyframes crunch-up {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-30deg); }
          }
          .crunch-upper { animation: crunch-up 1.2s ease-in-out infinite; transform-origin: 100px 65px; }
        `}</style>
        <line x1="50" y1="65" x2="150" y2="65" stroke="#4ade80" strokeWidth="4" />
        <line x1="50" y1="65" x2="40" y2="80" stroke="#4ade80" strokeWidth="3" />
        <line x1="150" y1="65" x2="160" y2="80" stroke="#4ade80" strokeWidth="3" />
        <g className="crunch-upper">
          <circle cx="100" cy="40" r="10" fill="#4ade80" />
          <line x1="100" y1="50" x2="100" y2="65" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="55" x2="75" y2="50" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="55" x2="125" y2="50" stroke="#4ade80" strokeWidth="3" />
        </g>
        <line x1="20" y1="85" x2="180" y2="85" stroke="#166534" strokeWidth="2" />
        <text x="100" y="95" textAnchor="middle" fill="#4ade80" fontSize="8">腹筋・クランチ</text>
      </svg>
    </div>
  );
}

function DefaultAnimation() {
  return (
    <div className="flex items-center justify-center h-32 bg-green-950/30 rounded mb-4">
      <svg width="200" height="100" viewBox="0 0 200 100">
        <style>{`
          @keyframes default-move {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .default-body { animation: default-move 1s ease-in-out infinite; transform-origin: 100px 50px; }
        `}</style>
        <g className="default-body">
          <circle cx="100" cy="20" r="10" fill="#4ade80" />
          <line x1="100" y1="30" x2="100" y2="60" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="40" x2="75" y2="55" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="40" x2="125" y2="55" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="60" x2="80" y2="80" stroke="#4ade80" strokeWidth="3" />
          <line x1="100" y1="60" x2="120" y2="80" stroke="#4ade80" strokeWidth="3" />
        </g>
        <line x1="20" y1="88" x2="180" y2="88" stroke="#166534" strokeWidth="2" />
        <text x="100" y="98" textAnchor="middle" fill="#4ade80" fontSize="8">トレーニング</text>
      </svg>
    </div>
  );
}

function ExerciseAnimation({ name }: { name: string }) {
  if (name.includes('腕立て') || name.includes('プッシュアップ')) return <PushupAnimation />;
  if (name.includes('スクワット')) return <SquatAnimation />;
  if (name.includes('プランク')) return <PlankAnimation />;
  if (name.includes('バーピー')) return <BurpeeAnimation />;
  if (name.includes('マウンテン')) return <MountainClimberAnimation />;
  if (name.includes('ジャンプ') || name.includes('ジャンピング')) return <JumpAnimation />;
  if (name.includes('腹筋') || name.includes('クランチ')) return <CrunchAnimation />;
  return <DefaultAnimation />;
}

function ExerciseCard({ exercise, onClick }: { exercise: Exercise; onClick: () => void }) {
  return (
    <div className="border border-green-800 p-4 bg-green-900/10 hover:bg-green-900/20 cursor-pointer transition-all" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{exercise.icon}</span>
          <div>
            <div className="font-bold text-green-300 text-sm">{exercise.name}</div>
            <div className="text-xs text-green-600 mt-1">{exercise.sets}セット × {exercise.reps}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-green-700">休憩</div>
          <div className="text-xs text-green-500">{exercise.rest}</div>
          <div className="text-xs text-green-700 mt-1">タップ→詳細</div>
        </div>
      </div>
    </div>
  );
}

export default function CoachPage() {
  const [division, setDivision] = useState<Division>('ground');
  const [level, setLevel] = useState<Level>('recruit');
  const [menu, setMenu] = useState<TrainingMenu | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/##/g, '')
      .replace(/#/g, '').replace(/：/g, '').replace(/:/g, '')
      .replace(/- /g, '').replace(/【/g, '').replace(/】/g, '')
      .replace(/「/g, '').replace(/」/g, '').replace(/・/g, '').trim();
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    
    const utterThis = () => {
      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(v => v.lang === 'ja-JP' && (v.name.includes('Male') || v.name.includes('Otoya'))) || voices.find(v => v.lang === 'ja-JP');
      
      const intro = new SpeechSynthesisUtterance('訓練を開始する！');
      intro.lang = 'ja-JP'; intro.pitch = 0.6; intro.rate = 0.85;
      if (maleVoice) intro.voice = maleVoice;
      
      const main = new SpeechSynthesisUtterance(cleanText(text));
      main.lang = 'ja-JP'; main.pitch = 0.6; main.rate = 0.85;
      if (maleVoice) main.voice = maleVoice;
      
      setSpeaking(true);
      intro.onend = () => { window.speechSynthesis.speak(main); };
      main.onend = () => { setSpeaking(false); };
      window.speechSynthesis.speak(intro);
    };
  
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = utterThis;
    } else {
      utterThis();
    }
  };

  const stopSpeaking = () => { window.speechSynthesis.cancel(); setSpeaking(false); };

  const generateMenu = async () => {
    setLoading(true); setError(''); setMenu(null); stopSpeaking();
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ division, level }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました');
      setMenu(data.menu);
      const allExercises = [...data.menu.warmup, ...data.menu.main, ...data.menu.cooldown];
      const menuText = allExercises.map((e: Exercise) => `${e.name}。${e.sets}セット、${e.reps}。次の訓練に移れ！`).join('。休むな！続けろ！。');
      speak(menuText);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="border-b border-green-800 p-4">
        <Link href="/" className="text-green-600 hover:text-green-400 text-sm">← 司令部に戻る</Link>
      </div>
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center my-8">
          <div className="text-xs text-green-600 tracking-widest mb-2">TRAINING BRIEFING</div>
          <h1 className="text-3xl font-bold text-green-300 mb-2">訓練計画立案</h1>
          <p className="text-green-600 text-sm">部隊と練度を申告せよ。AI教官が最適な訓練メニューを策定する。</p>
        </div>
        <div className="mb-6">
          <div className="text-xs text-green-600 mb-3 tracking-widest">所属部隊</div>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(divisionInfo) as Division[]).map((d) => (
              <button key={d} onClick={() => setDivision(d)} className={`p-4 border rounded text-center transition-all ${division === d ? 'border-green-400 bg-green-900/50 text-green-300' : 'border-green-800 text-green-600 hover:border-green-600'}`}>
                <div className="text-2xl mb-1">{divisionInfo[d].icon}</div>
                <div className="text-xs">{divisionInfo[d].label}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <div className="text-xs text-green-600 mb-3 tracking-widest">練度レベル</div>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(levelInfo) as Level[]).map((l) => (
              <button key={l} onClick={() => setLevel(l)} className={`p-4 border rounded text-center transition-all ${level === l ? 'border-green-400 bg-green-900/50 text-green-300' : 'border-green-800 text-green-600 hover:border-green-600'}`}>
                <div className="text-sm mb-1">{levelInfo[l].icon}</div>
                <div className="text-xs font-bold">{levelInfo[l].label}</div>
                <div className="text-xs text-green-700">{levelInfo[l].sublabel}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 mb-8">
          <button onClick={generateMenu} disabled={loading} className="flex-1 py-4 border border-green-500 bg-green-900/30 text-green-300 font-bold tracking-widest hover:bg-green-800/50 transition-all disabled:opacity-50">
            {loading ? '作戦立案中...' : '▶ 訓練開始'}
          </button>
          {speaking && (
  <button onClick={() => {
    const allExercises = [...(menu?.warmup ?? []), ...(menu?.main ?? []), ...(menu?.cooldown ?? [])];    const menuText = allExercises.map((e: Exercise) => `${e.name}、${e.sets}セット、${e.reps}、次の訓練に移れ！`).join('。休むな！続けろ！。');
    speak(menuText);
  }} className="px-6 py-4 border border-green-500 bg-green-900/30 text-green-400 font-bold">
    ▶️ 音声を再生
  </button>
)}
  
        </div>
        {error && <div className="border border-red-700 bg-red-900/20 p-4 mb-6 text-red-400 text-sm">{error}</div>}
        {menu && (
          <div className="space-y-6">
            <div className="border border-green-700 p-4 bg-green-900/10">
              <div className="text-xs text-green-600 mb-1">作戦名</div>
              <div className="text-lg font-bold text-green-300">{menu.missionName}</div>
              <div className="text-xs text-green-600 mt-2">{divisionInfo[division].icon} {divisionInfo[division].label} / {levelInfo[level].label}</div>
            </div>
            {[{ title: '準備運動', items: menu.warmup }, { title: '主訓練', items: menu.main }, { title: '整理運動', items: menu.cooldown }].map(({ title, items }) => (
              <div key={title}>
                <div className="text-xs text-green-600 tracking-widest mb-3">{title}</div>
                <div className="grid gap-3">
                  {items.map((ex, i) => <ExerciseCard key={i} exercise={ex} onClick={() => setSelectedExercise(ex)} />)}
                </div>
              </div>
            ))}
            <div className="border border-green-700 p-4 bg-green-900/10">
              <div className="text-xs text-green-600 mb-2">教官命令</div>
              <div className="text-sm text-green-300">{menu.commanders_note}</div>
            </div>
          </div>
        )}
      </div>
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedExercise(null)}>
          <div className="border border-green-600 bg-black p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <ExerciseAnimation name={selectedExercise.name} />
            <div className="font-bold text-green-300 text-lg mb-4 text-center">{selectedExercise.name}</div>
            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="border border-green-800 p-2">
                <div className="text-xs text-green-600">セット</div>
                <div className="text-green-300 font-bold">{selectedExercise.sets}</div>
              </div>
              <div className="border border-green-800 p-2">
                <div className="text-xs text-green-600">回数</div>
                <div className="text-green-300 font-bold">{selectedExercise.reps}</div>
              </div>
              <div className="border border-green-800 p-2">
                <div className="text-xs text-green-600">休憩</div>
                <div className="text-green-300 font-bold">{selectedExercise.rest}</div>
              </div>
            </div>
            <div className="text-xs text-green-600 mb-1">フォームのポイント</div>
            <div className="text-sm text-green-400 mb-4">{selectedExercise.tip}</div>
            <button onClick={() => setSelectedExercise(null)} className="w-full border border-green-700 py-2 text-green-600 hover:text-green-400 text-sm">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}