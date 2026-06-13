"use client";
import React, { useState, useRef } from 'react';
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

function ExerciseCard({ exercise, isActive, onClick }: { exercise: Exercise; isActive: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} className={`border p-4 cursor-pointer transition-all ${isActive ? 'border-green-400 bg-green-900/40' : 'border-green-800 bg-green-900/10 hover:bg-green-900/20'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{exercise.icon}</span>
          <div>
            <div className={`font-bold text-sm ${isActive ? 'text-green-300' : 'text-green-400'}`}>{exercise.name}</div>
            <div className="text-xs text-green-600 mt-1">{exercise.sets}セット × {exercise.reps}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-green-700">休憩</div>
          <div className="text-xs text-green-500">{exercise.rest}</div>
          {isActive && <div className="text-xs text-green-300 mt-1 font-bold">▶ 実施中</div>}
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
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(-1);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getAllExercises = () => {
    if (!menu) return [];
    return [...menu.warmup, ...menu.main, ...menu.cooldown];
  };

  const speakText = (text: string, onEnd?: () => void) => {
    window.speechSynthesis.cancel();
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(v => v.lang === 'ja-JP' && (v.name.includes('Male') || v.name.includes('Otoya'))) || voices.find(v => v.lang === 'ja-JP');
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'ja-JP'; utt.pitch = 0.6; utt.rate = 0.85;
      if (maleVoice) utt.voice = maleVoice;
      if (onEnd) utt.onend = onEnd;
      window.speechSynthesis.speak(utt);
    };
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = trySpeak;
    } else {
      trySpeak();
    }
  };

  const startExercise = (index: number) => {
    const exercises = getAllExercises();
    if (index >= exercises.length) {
      setIsTraining(false);
      setCurrentExerciseIndex(-1);
      speakText('全訓練完了！お疲れ様でした！');
      return;
    }
    const ex = exercises[index];
    setCurrentExerciseIndex(index);
    const restSeconds = parseInt(ex.rest) || 30;
    speakText(`${ex.name}、${ex.sets}セット、${ex.reps}、始め！`, () => {
      setTimeLeft(restSeconds);
      let t = restSeconds;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        t -= 1;
        setTimeLeft(t);
        if (t <= 3 && t > 0) speakText(`${t}`);
        if (t <= 0) {
          clearInterval(timerRef.current!);
          speakText('休め！次の種目へ移れ！', () => {
            setTimeout(() => startExercise(index + 1), 1500);
          });
        }
      }, 1000);
    });
  };

  const startTraining = () => {
    setIsTraining(true);
    speakText('訓練開始！', () => startExercise(0));
  };

  const stopTraining = () => {
    window.speechSynthesis.cancel();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTraining(false);
    setCurrentExerciseIndex(-1);
    setTimeLeft(0);
  };

  const generateMenu = async () => {
    stopTraining();
    setLoading(true); setError(''); setMenu(null);
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ division, level }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました');
      setMenu(data.menu);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
    } finally { setLoading(false); }
  };

  const allExercises = getAllExercises();

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
          {menu && !isTraining && (
            <button onClick={startTraining} className="px-6 py-4 border border-green-400 bg-green-800/50 text-green-300 font-bold">
              🔊 訓練開始
            </button>
          )}
          {isTraining && (
            <button onClick={stopTraining} className="px-6 py-4 border border-red-600 bg-red-900/30 text-red-400 font-bold">
              ⏹ 停止
            </button>
          )}
        </div>

        {isTraining && currentExerciseIndex >= 0 && (
          <div className="border border-green-400 bg-green-900/20 p-6 mb-6 text-center">
            <div className="text-xs text-green-600 mb-2 tracking-widest">現在の種目</div>
            <div className="text-2xl font-bold text-green-300 mb-2">{allExercises[currentExerciseIndex]?.icon} {allExercises[currentExerciseIndex]?.name}</div>
            <div className="text-xs text-green-600 mb-4">{allExercises[currentExerciseIndex]?.sets}セット × {allExercises[currentExerciseIndex]?.reps}</div>
            <div className="text-5xl font-bold text-green-400">{timeLeft}</div>
            <div className="text-xs text-green-700 mt-2">秒後に次の種目へ</div>
          </div>
        )}

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
                  {items.map((ex, i) => {
                    const globalIndex = allExercises.indexOf(ex);
                    return <ExerciseCard key={i} exercise={ex} isActive={currentExerciseIndex === globalIndex} onClick={() => setSelectedExercise(ex)} />;
                  })}
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
            <div className="text-center text-4xl mb-4">{selectedExercise.icon}</div>
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
            <div className="text-xs text-green-600 mb-2">フォームのポイント</div>
            <div className="text-sm text-green-400 mb-4 whitespace-pre-line">{selectedExercise.tip.replace(/STEP/g, '\nSTEP').replace(/⚠️/g, '\n⚠️').trim()}</div>
            <button onClick={() => setSelectedExercise(null)} className="w-full border border-green-700 py-2 text-green-600 hover:text-green-400 text-sm">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}