import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function Home() {
  return (
    <div
      className={`${notoSansJP.className} relative min-h-screen overflow-hidden bg-[#050805] text-[#c8d4c0]`}
    >
      {/* 背景グラデーション */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #1a3d1a 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, #0f2a0f 0%, transparent 50%), linear-gradient(180deg, #050805 0%, #0a120a 50%, #050805 100%)",
        }}
      />

      {/* 迷彩風ノイズパターン */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a7c4a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* グリッドライン */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#2d5a2d 1px, transparent 1px), linear-gradient(90deg, #2d5a2d 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* 上下の装飾ライン */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#3d6b3d] to-transparent" />
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#3d6b3d] to-transparent" />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16">
        {/* バッジ */}
        <div className="mb-10 flex items-center gap-3">
          <div className="h-px w-12 bg-[#4a7c4a]" />
          <span className="border border-[#3d6b3d] bg-[#0d1a0d]/80 px-4 py-1 text-[10px] font-bold tracking-[0.35em] text-[#6b9e6b] uppercase">
            JSDF Style Training
          </span>
          <div className="h-px w-12 bg-[#4a7c4a]" />
        </div>

        {/* メインタイトル */}
        <div className="mb-6 text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.5em] text-[#5a8a5a]">
            陸上自衛隊式
          </p>
          <h1 className="text-4xl leading-tight font-black tracking-wider text-[#e8f0e4] sm:text-5xl md:text-6xl">
            AI フィットネス
            <br />
            <span className="text-[#6b9e6b]">コーチング</span>
          </h1>
        </div>

        {/* サブコピー */}
        <p className="mb-4 max-w-md text-center text-sm leading-relaxed tracking-wide text-[#7a9a7a] sm:text-base">
          規律ある肉体づくりを、AI教官が徹底指導。
          <br className="hidden sm:block" />
          今日から、あなたの部隊生活が始まる。
        </p>

        {/* 階級風ストライプ */}
        <div className="mb-12 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-1 w-8 bg-gradient-to-r from-[#2d5a2d] to-[#4a7c4a]"
            />
          ))}
        </div>

        {/* CTAボタン */}
        <Link
          href="/coach"
          className="group relative inline-flex items-center justify-center"
        >
          {/* ボタン外枠グロー */}
          <div className="absolute -inset-1 rounded-sm bg-gradient-to-b from-[#4a7c4a] to-[#1a3d1a] opacity-60 blur-sm transition-opacity group-hover:opacity-90" />

          <span className="relative flex min-w-[280px] items-center justify-center gap-3 border-2 border-[#5a9a5a] bg-gradient-to-b from-[#1e3d1e] to-[#0d1f0d] px-10 py-5 text-lg font-black tracking-[0.2em] text-[#e8f0e4] shadow-[inset_0_1px_0_rgba(107,158,107,0.3),0_4px_20px_rgba(0,0,0,0.6)] transition-all group-hover:border-[#7ab87a] group-hover:from-[#254d25] group-hover:to-[#122812] group-hover:shadow-[inset_0_1px_0_rgba(107,158,107,0.5),0_6px_30px_rgba(45,90,45,0.4)] sm:min-w-[360px] sm:px-14 sm:py-6 sm:text-xl">
            {/* 左装飾 */}
            <span className="text-[#5a9a5a] transition-colors group-hover:text-[#7ab87a]">
              ▶
            </span>
            AI教官に入隊する
            {/* 右装飾 */}
            <span className="text-[#5a9a5a] transition-colors group-hover:text-[#7ab87a]">
              ◀
            </span>
          </span>
        </Link>

        <p className="mt-6 text-[11px] tracking-[0.3em] text-[#4a6a4a]">
          ― 入隊は無料・即日配属 ―
        </p>

        {/* 下部スペック表示 */}
        <div className="mt-20 grid w-full max-w-lg grid-cols-3 gap-px border border-[#2d4a2d] bg-[#2d4a2d]">
          {[
            { label: "指導方式", value: "AI 1対1" },
            { label: "訓練強度", value: "段階制御" },
            { label: "目標", value: "戦力向上" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#0a120a] px-3 py-4 text-center"
            >
              <p className="mb-1 text-[9px] font-bold tracking-[0.2em] text-[#4a7c4a] uppercase">
                {item.label}
              </p>
              <p className="text-xs font-bold tracking-wider text-[#a8c4a0] sm:text-sm">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* フッターモットー */}
        <footer className="mt-12 text-center">
          <p className="text-[10px] tracking-[0.4em] text-[#3a5a3a]">
            心技体の統合 ─ 強く、速く、粘り強く
          </p>
        </footer>
      </main>

      {/* コーナー装飾 */}
      <div className="pointer-events-none absolute top-6 left-6 h-8 w-8 border-t-2 border-l-2 border-[#3d6b3d]/60" />
      <div className="pointer-events-none absolute top-6 right-6 h-8 w-8 border-t-2 border-r-2 border-[#3d6b3d]/60" />
      <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b-2 border-l-2 border-[#3d6b3d]/60" />
      <div className="pointer-events-none absolute right-6 bottom-6 h-8 w-8 border-r-2 border-b-2 border-[#3d6b3d]/60" />
    </div>
  );
}
