import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitFlow | Fit India & Khelo India AI Fitness Platform",
  description:
    "AI-Powered Multiplayer Fitness Platform integrated with the Fit India & Khelo India Digital Fitness Testing & Talent Spotting Framework.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-orange-500 selection:text-white">
        {/* Universal Top Navigation Header */}
        <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-orange-500/20">
                F
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  FitFlow <span className="text-orange-500">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-1 font-medium">
                  Fit India • Khelo India Digital Protocol
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-semibold text-emerald-400">SAI Live Certified</span>
              </div>

              <div className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-400">
                Localhost Server Active
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
