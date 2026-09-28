"use client";

import React, { useState } from 'react';
import {
  Swords,
  Trophy,
  Flame,
  ShieldCheck,
  Zap,
  Users,
  Timer,
  ChevronRight
} from 'lucide-react';

export interface BattleParticipant {
  id: string;
  name: string;
  avatarUrl?: string;
  collegeOrHostel: string;
  activity: string;
  validReps: number;
  totalReps: number;
  ufpPoints: number;
  verificationLevel: 'Verified' | 'Partially Verified';
  cameraActive: boolean;
}

export interface LiveBattleSession {
  battleId: string;
  secondsRemaining: number;
  player1: BattleParticipant;
  player2: BattleParticipant;
  targetMetric: string;
}

const SAMPLE_BATTLE: LiveBattleSession = {
  battleId: 'BATTLE-2026-LIVE-88',
  secondsRemaining: 24,
  targetMetric: '60s Maximum Unified Effort',
  player1: {
    id: 'user_101',
    name: 'Kabir Verma',
    collegeOrHostel: 'Hostel 7, IIT Delhi',
    activity: 'Push-ups',
    validReps: 38,
    totalReps: 40,
    ufpPoints: 166,
    verificationLevel: 'Verified',
    cameraActive: true,
  },
  player2: {
    id: 'user_204',
    name: 'Manpreet Singh',
    collegeOrHostel: 'Hostel 3, NIT Kurukshetra',
    activity: 'Squats',
    validReps: 46,
    totalReps: 48,
    ufpPoints: 161,
    verificationLevel: 'Verified',
    cameraActive: true,
  },
};

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Arjun Gurung', campus: 'Bhiwani Sports Hub', points: 3420, streak: 14, verified: true },
  { rank: 2, name: 'Pooja Tomar', campus: 'Meerut Sports College', points: 3280, streak: 12, verified: true },
  { rank: 3, name: 'Kavita Devi', campus: 'CR Stadium Trust', points: 3150, streak: 9, verified: true },
  { rank: 4, name: 'Vikas Bishnoi', campus: 'Desert Athletics Jodhpur', points: 2980, streak: 8, verified: true },
  { rank: 5, name: 'Ananya Nair', campus: 'St. Thomas Kerala', points: 2840, streak: 6, verified: false },
];

export default function LiveBattleLeaderboard() {
  const [battle] = useState<LiveBattleSession>(SAMPLE_BATTLE);
  const [activeTab, setActiveTab] = useState<'LIVE_BATTLE' | 'LEADERBOARD'>('LIVE_BATTLE');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-slate-100">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('LIVE_BATTLE')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'LIVE_BATTLE'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Swords className="w-4 h-4" />
            1v1 Live Arena
          </button>

          <button
            onClick={() => setActiveTab('LEADERBOARD')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'LEADERBOARD'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            National Leaderboard
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Realtime WebSocket Sync
        </div>
      </div>

      {activeTab === 'LIVE_BATTLE' ? (
        <div>
          {/* Battle Header */}
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Cross-Discipline Matchup
            </span>
            <div className="flex items-center justify-center gap-3 mt-1">
              <Timer className="w-5 h-5 text-amber-400 animate-spin" />
              <span className="text-3xl font-extrabold text-white tracking-tight">
                00:{battle.secondsRemaining < 10 ? `0${battle.secondsRemaining}` : battle.secondsRemaining}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Compete on Unified Fitness Points (UFP) balanced by metabolic exertion
            </p>
          </div>

          {/* 1v1 Split Screen Arena */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* VS Badge in Center */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-orange-600 text-white font-black text-sm items-center justify-center border-4 border-slate-900 shadow-xl z-10">
              VS
            </div>

            {/* Player 1 Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white">{battle.player1.name}</h3>
                    <span className="flex items-center text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{battle.player1.collegeOrHostel}</div>
                  <div className="text-xs font-semibold text-orange-400 mt-1">
                    Activity: {battle.player1.activity}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-white">{battle.player1.ufpPoints}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">UFP Points</div>
                </div>
              </div>

              {/* Rep Counter / Form Feedback */}
              <div className="mt-6 flex items-center justify-between bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">Valid Reps</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {battle.player1.validReps}{' '}
                    <span className="text-xs text-slate-500 font-normal">
                      / {battle.player1.totalReps} total
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Form Accuracy</div>
                  <div className="text-lg font-bold text-slate-200">
                    {Math.round((battle.player1.validReps / battle.player1.totalReps) * 100)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Player 2 Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white">{battle.player2.name}</h3>
                    <span className="flex items-center text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{battle.player2.collegeOrHostel}</div>
                  <div className="text-xs font-semibold text-blue-400 mt-1">
                    Activity: {battle.player2.activity}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-white">{battle.player2.ufpPoints}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">UFP Points</div>
                </div>
              </div>

              {/* Rep Counter / Form Feedback */}
              <div className="mt-6 flex items-center justify-between bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">Valid Reps</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {battle.player2.validReps}{' '}
                    <span className="text-xs text-slate-500 font-normal">
                      / {battle.player2.totalReps} total
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Form Accuracy</div>
                  <div className="text-lg font-bold text-slate-200">
                    {Math.round((battle.player2.validReps / battle.player2.totalReps) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Leaderboard View */
        <div className="space-y-3">
          {LEADERBOARD_DATA.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center justify-between bg-slate-950 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    entry.rank === 1
                      ? 'bg-amber-400 text-slate-950'
                      : entry.rank === 2
                      ? 'bg-slate-300 text-slate-950'
                      : entry.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {entry.rank}
                </span>

                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    {entry.name}
                    {entry.verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="AI Verified" />
                    )}
                  </div>
                  <div className="text-xs text-slate-400">{entry.campus}</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 text-xs text-orange-400 font-semibold">
                  <Flame className="w-4 h-4 fill-orange-400" />
                  {entry.streak}d streak
                </div>

                <div className="text-right min-w-[70px]">
                  <div className="font-extrabold text-white">{entry.points.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">UFP Points</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
