"use client";

import React, { useState } from 'react';
import {
  Camera,
  Users,
  Swords,
  Watch,
  TrendingUp,
  Award,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import CameraWorkoutEngine from '@/components/CameraWorkoutEngine';
import CoachDashboard from '@/components/CoachDashboard';
import LiveBattleLeaderboard from '@/components/LiveBattleLeaderboard';
import WearablesSyncHub from '@/components/WearablesSyncHub';
import DynamicETACalculator from '@/components/DynamicETACalculator';

type ActiveTab = 'CAMERA_VISION' | 'SCOUTING_DASHBOARD' | 'LIVE_BATTLES' | 'WEARABLES_SYNC' | 'DYNAMIC_ETA';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('CAMERA_VISION');

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Fit India & Khelo India Digital Fitness Platform
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white">
            AI-Powered Biometrics & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400">National Talent Scouting</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-slate-300 leading-relaxed">
            Turn standard webcams and mobile phones into certified athletic testing stations. Fusing computer vision pose validation with wearable heart rate and GPS telemetry to identify the next generation of Indian sports champions.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <div className="text-xs text-slate-400">Camera Engine</div>
            <div className="text-sm font-bold text-white mt-0.5">MediaPipe 33 3D</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <div className="text-xs text-slate-400">Anti-Cheat Fusion</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">Tri-Tier HMAC</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <div className="text-xs text-slate-400">SAI Norms</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">5-25y Centiles</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <div className="text-xs text-slate-400">Live Battles</div>
            <div className="text-sm font-bold text-blue-400 mt-0.5">1v1 UFP Arena</div>
          </div>
        </div>
      </section>

      {/* Main Feature Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('CAMERA_VISION')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'CAMERA_VISION'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Camera className="w-4 h-4" />
          AI Camera Workout & Tests
        </button>

        <button
          onClick={() => setActiveTab('SCOUTING_DASHBOARD')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'SCOUTING_DASHBOARD'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Users className="w-4 h-4" />
          Khelo India Coach Dashboard
        </button>

        <button
          onClick={() => setActiveTab('LIVE_BATTLES')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'LIVE_BATTLES'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Swords className="w-4 h-4" />
          1v1 Live Battles & Leaderboard
        </button>

        <button
          onClick={() => setActiveTab('WEARABLES_SYNC')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'WEARABLES_SYNC'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Watch className="w-4 h-4" />
          Google Fit & Strava Sync
        </button>

        <button
          onClick={() => setActiveTab('DYNAMIC_ETA')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'DYNAMIC_ETA'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Dynamic Fitness ETA
        </button>
      </div>

      {/* Active Tab View */}
      <div className="transition-all duration-200">
        {activeTab === 'CAMERA_VISION' && <CameraWorkoutEngine />}
        {activeTab === 'SCOUTING_DASHBOARD' && <CoachDashboard />}
        {activeTab === 'LIVE_BATTLES' && <LiveBattleLeaderboard />}
        {activeTab === 'WEARABLES_SYNC' && <WearablesSyncHub />}
        {activeTab === 'DYNAMIC_ETA' && <DynamicETACalculator />}
      </div>
    </div>
  );
}
