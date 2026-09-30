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
  ShieldCheck,
  Compass,
  Zap,
  Activity,
  Flame,
  ArrowRight,
  Radio,
  ChevronRight,
  Target,
  BarChart3,
  Dumbbell
} from 'lucide-react';
import CameraWorkoutEngine from '@/components/CameraWorkoutEngine';
import CoachDashboard from '@/components/CoachDashboard';
import LiveBattleLeaderboard from '@/components/LiveBattleLeaderboard';
import WearablesSyncHub from '@/components/WearablesSyncHub';
import DynamicETACalculator from '@/components/DynamicETACalculator';
import IndiaTalentMap from '@/components/IndiaTalentMap';

type ActiveTab =
  | 'CAMERA_VISION'
  | 'SCOUTING_DASHBOARD'
  | 'LIVE_BATTLES'
  | 'WEARABLES_SYNC'
  | 'DYNAMIC_ETA'
  | 'INDIA_TALENT_MAP';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('CAMERA_VISION');

  const navItems = [
    {
      id: 'CAMERA_VISION' as ActiveTab,
      label: 'AI Camera & Voice Coach',
      tag: 'Core Vision',
      desc: '3D Pose tracking, rep validation & Voice AI',
      icon: Camera,
      accent: 'from-orange-500 to-amber-500',
      category: 'Athlete Arena',
    },
    {
      id: 'LIVE_BATTLES' as ActiveTab,
      label: '1v1 Battles & Ghost Rivals',
      tag: 'Multiplayer',
      desc: 'Compete live vs peers or national P90 ghost',
      icon: Swords,
      accent: 'from-amber-500 to-orange-600',
      category: 'Athlete Arena',
    },
    {
      id: 'WEARABLES_SYNC' as ActiveTab,
      label: 'Wearables & Telemetry',
      tag: 'IoT Fusion',
      desc: 'Sync Google Fit heart rate & Strava GPS splits',
      icon: Watch,
      accent: 'from-emerald-500 to-teal-500',
      category: 'Athlete Arena',
    },
    {
      id: 'DYNAMIC_ETA' as ActiveTab,
      label: 'Dynamic Fitness ETA',
      tag: 'AI Predictor',
      desc: 'Predict weeks to reach elite SAI percentiles',
      icon: TrendingUp,
      accent: 'from-blue-500 to-cyan-500',
      category: 'Athlete Arena',
    },
    {
      id: 'SCOUTING_DASHBOARD' as ActiveTab,
      label: 'Khelo India Coach Dashboard',
      tag: 'Scout Pro',
      desc: 'Roster analytics, radar charts & talent passports',
      icon: Users,
      accent: 'from-orange-600 to-emerald-600',
      category: 'Governance & Scouting',
    },
    {
      id: 'INDIA_TALENT_MAP' as ActiveTab,
      label: 'National Talent Map & Olympic AI',
      tag: 'Geo-Radar',
      desc: 'Zonal talent heatmaps & Olympic sport match',
      icon: Compass,
      accent: 'from-emerald-600 to-cyan-600',
      category: 'Governance & Scouting',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Mission Control Section (Light Theme) */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 md:p-10 shadow-md">
        {/* Soft Ambient Background Highlights */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Intro */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-black tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Khelo India & Fit India National Sports Framework</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              AI Biometrics & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600">
                Grassroots Olympic Talent Radar
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
              Transforming standard smartphone webcams into certified athletic testing laboratories. Utilizing real-time 3D computer vision, anti-cheat sensor telemetry, voice AI coaching, and SAI norm percentiles to discover India's next Olympic champions.
            </p>

            {/* Quick Action Launchers */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('CAMERA_VISION')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-orange-600/25 transition-all active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Launch Camera Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('INDIA_TALENT_MAP')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95"
              >
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Olympic Sport Matcher</span>
              </button>

              <button
                onClick={() => setActiveTab('SCOUTING_DASHBOARD')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95"
              >
                <Users className="w-4 h-4 text-orange-600" />
                <span>Scout Dashboard</span>
              </button>
            </div>
          </div>

          {/* Quick Telemetry Hub Panel */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Engine Telemetry
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Computer Vision</span>
                <span className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  MediaPipe 3D
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Audio Coach</span>
                <span className="font-bold text-orange-600 mt-0.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Voice AI Enabled
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Verification</span>
                <span className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Tri-Tier HMAC
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Norm Database</span>
                <span className="font-bold text-amber-700 mt-0.5">
                  SAI 5-25y Centiles
                </span>
              </div>
            </div>

            <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between">
              <span>National Target Benchmark:</span>
              <span className="text-slate-900 font-mono font-bold">P90 National Pool</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-200">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-orange-300 transition-colors">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">Vision Validation</div>
            <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-orange-600" />
              <span>33 3D Joints</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Angle & depth calibration</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">Anti-Cheat Fusion</div>
            <div className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sensor + Vision</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">HR delta & time signature</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">Olympic Matching</div>
            <div className="text-sm font-bold text-amber-700 mt-1 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-amber-600" />
              <span>18+ Disciplines</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Physical trait mapping</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">Multiplayer Arena</div>
            <div className="text-sm font-bold text-blue-700 mt-1 flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-blue-600" />
              <span>1v1 & Ghost Race</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Gamified national rankings</div>
          </div>
        </div>
      </section>

      {/* Main Feature Tabs Navigation Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Interactive System Modules
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Click any module below to activate
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
                  isActive
                    ? 'bg-white border-orange-500 shadow-md shadow-orange-500/15'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 rounded-t-2xl" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-500 group-hover:text-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>

                  <div className="font-extrabold text-xs text-slate-900 leading-snug">
                    {item.label}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 mt-2 line-clamp-2 leading-tight">
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View Header & Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
            <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Status: <span className="text-emerald-700 font-bold">Active & Synced</span>
          </span>
        </div>

        {/* Tab Module Rendering */}
        <div className="transition-all duration-300">
          {activeTab === 'CAMERA_VISION' && <CameraWorkoutEngine />}
          {activeTab === 'SCOUTING_DASHBOARD' && <CoachDashboard />}
          {activeTab === 'INDIA_TALENT_MAP' && <IndiaTalentMap />}
          {activeTab === 'LIVE_BATTLES' && <LiveBattleLeaderboard />}
          {activeTab === 'WEARABLES_SYNC' && <WearablesSyncHub />}
          {activeTab === 'DYNAMIC_ETA' && <DynamicETACalculator />}
        </div>
      </div>
    </div>
  );
}
