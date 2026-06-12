import { Noto_Sans_JP } from "next/font/google";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export function MilitaryShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${notoSansJP.className} relative min-h-screen overflow-hidden bg-[#050805] text-[#c8d4c0]`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #1a3d1a 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, #0f2a0f 0%, transparent 50%), linear-gradient(180deg, #050805 0%, #0a120a 50%, #050805 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a7c4a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#2d5a2d 1px, transparent 1px), linear-gradient(90deg, #2d5a2d 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#3d6b3d] to-transparent" />
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#3d6b3d] to-transparent" />
      <div className="pointer-events-none absolute top-6 left-6 h-8 w-8 border-t-2 border-l-2 border-[#3d6b3d]/60" />
      <div className="pointer-events-none absolute top-6 right-6 h-8 w-8 border-t-2 border-r-2 border-[#3d6b3d]/60" />
      <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b-2 border-l-2 border-[#3d6b3d]/60" />
      <div className="pointer-events-none absolute right-6 bottom-6 h-8 w-8 border-r-2 border-b-2 border-[#3d6b3d]/60" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
