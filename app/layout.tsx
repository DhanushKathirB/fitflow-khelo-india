import type { Metadata } from "next";
import Link from "next/link";
import {
  LogIn,
  ShieldCheck,
  Activity,
  Award,
  Zap,
  Radio,
  Flame,
  Globe2,
  Cpu,
  Layers,
  Sparkles
} from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitFlow AI | Fit India & Khelo India National Sports Talent & Biometrics Portal",
  description:
    "AI-Powered Real-time Olympic & Khelo India Biometrics Engine, Computer Vision Form Validation, and Grassroots National Sports Talent Scouting Platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-orange-500 selection:text-white">
        {/* Top National Ticker */}
        <div className="bg-gradient-to-r from-orange-100/60 via-white to-emerald-100/60 border-b border-slate-200 py-1.5 px-4 text-[11px] text-slate-700 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 font-extrabold text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-ping" />
                OFFICIAL SIH 2026 INITIATIVE
              </span>
              <span className="hidden sm:inline text-slate-600 font-medium">
                Fit India & Khelo India Digital Fitness Testing Framework
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>SAI Cloud Verified</span>
              </div>
              <span className="text-slate-300 hidden md:inline">|</span>
              <span className="hidden md:inline text-slate-500">
                Active Node: <span className="text-slate-800 font-mono font-bold">IN-DEL-SAI-01</span>
              </span>
              <span className="text-slate-300 hidden lg:inline">|</span>
              <span className="hidden lg:inline text-amber-700 font-bold">
                Target: Olympic 2028/2032 Talent Pipeline
              </span>
            </div>
          </div>
        </div>

        {/* Universal Top Navigation Header */}
        <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-xl sticky top-0 z-50 transition-all shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
            {/* Brand Logo & Details */}
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-emerald-600 flex items-center justify-center font-black text-white text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-all duration-300">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-tight text-slate-900 flex items-center gap-1">
                    FitFlow <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600">AI</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200">
                    SAI v3.2
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block font-medium tracking-tight">
                  Fit India • Khelo India Digital Scouting Engine
                </span>
              </div>
            </Link>

            {/* Right Action Controls */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
                <Radio className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                <span className="text-slate-500">Live Athletes:</span>
                <span className="font-mono font-bold text-slate-900">4,812 Online</span>
              </div>

              <Link
                href="/signin"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-black tracking-wide uppercase transition-all shadow-md shadow-orange-600/25 hover:shadow-orange-500/40 flex items-center gap-2 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Athlete / Coach Sign In</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Professional National Sports Authority Footer */}
        <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs py-10 mt-16 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-200">
              {/* Brand Summary */}
              <div className="md:col-span-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white text-sm">
                    F
                  </div>
                  <span className="font-black text-slate-900 text-base">FitFlow AI</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  National Digital Biometrics & Talent Identification Platform designed to empower young athletes across India through cutting-edge computer vision and verifiable fitness credentials.
                </p>
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Sports Authority of India (SAI) Aligned
                </div>
              </div>

              {/* Core Innovations */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                  AI Architecture
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    MediaPipe 33-Landmark Pose 3D
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    Voice AI Real-Time Correction
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    Tri-Tier Sensor Fusion Anti-Cheat
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    Bilateral Kinematic Asymmetry AI
                  </li>
                </ul>
              </div>

              {/* National Frameworks */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                  National Ecosystem
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Fit India Movement Protocol
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Khelo India Youth Games Talent Scouting
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    SAI Age-Norm Centile Benchmarks (5-25y)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Cryptographic Talent Passports & QR
                  </li>
                </ul>
              </div>

              {/* Compliance & Governance */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                  Hackathon Submission
                </h4>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Event:</span>
                    <span className="font-bold text-slate-900">Smart India Hackathon</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Theme:</span>
                    <span className="font-bold text-orange-600">Sports & Fitness Tech</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Theme Mode:</span>
                    <span className="font-semibold text-emerald-700">Light Athletic Theme</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
              <div>
                © 2026 FitFlow AI • Ministry of Youth Affairs & Sports • Government of India. All rights reserved.
              </div>
              <div className="flex items-center gap-4">
                <span>Privacy & Data Sovereignty</span>
                <span>•</span>
                <span>Anti-Doping & Fair Play</span>
                <span>•</span>
                <span>SAI Certification Docs</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
