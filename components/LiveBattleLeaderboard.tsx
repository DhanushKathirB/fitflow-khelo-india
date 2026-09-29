"use client";

import React, { useState, useEffect } from 'react';
import {
  Swords,
  Trophy,
  Flame,
  ShieldCheck,
  Zap,
  Users,
  Timer,
  ChevronRight,
  Ghost,
  Play,
  RotateCcw
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

const GHOST_PRESETS = [
  { id: 'p90', name: 'Khelo India P90 Benchmark', targetReps: 44, activity: 'Push-ups', cadence: 1.35 },
  { id: 'record', name: 'SAI National Record Ghost', targetReps: 58, activity: 'Push-ups', cadence: 1.02 },
  { id: 'hostel', name: 'Hostel 4 Rival Record', targetReps: 36, activity: 'Squats', cadence: 1.66 },
];

export default function LiveBattleLeaderboard() {
  const [battle] = useState<LiveBattleSession>(SAMPLE_BATTLE);
  const [activeTab, setActiveTab] = useState<'LIVE_BATTLE' | 'GHOST_ARENA' | 'LEADERBOARD'>('LIVE_BATTLE');

  // Ghost Rival State
  const [selectedGhost, setSelectedGhost] = useState(GHOST_PRESETS[0]);
  const [ghostReps, setGhostReps] = useState<number>(0);
  const [userReps, setUserReps] = useState<number>(0);
  const [ghostRaceActive, setGhostRaceActive] = useState<boolean>(false);
  const [ghostTimer, setGhostTimer] = useState<number>(60);

  // Ghost Race Simulation
  useEffect(() => {
    let interval: any = null;
    if (ghostRaceActive && ghostTimer > 0) {
      interval = setInterval(() => {
        setGhostTimer((t) => {
          if (t <= 1) {
            setGhostRaceActive(false);
            return 0;
          }
          return t - 1;
        });

        // Increment ghost based on target pace
        setGhostReps((prev) => {
          const expectedAtTime = Math.round(((60 - ghostTimer) / 60) * selectedGhost.targetReps);
          return Math.min(selectedGhost.targetReps, expectedAtTime);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [ghostRaceActive, ghostTimer, selectedGhost]);

  const handleStartGhostRace = () => {
    setGhostTimer(60);
    setGhostReps(0);
    setUserReps(0);
    setGhostRaceActive(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-slate-100">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('LIVE_BATTLE')}
            className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'LIVE_BATTLE'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Swords className="w-4 h-4" />
            1v1 Live Arena
          </button>

          <button
            onClick={() => setActiveTab('GHOST_ARENA')}
            className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'GHOST_ARENA'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Ghost className="w-4 h-4 text-purple-400" />
            Ghost Rival Mode
          </button>

          <button
            onClick={() => setActiveTab('LEADERBOARD')}
            className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
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
      ) : activeTab === 'GHOST_ARENA' ? (
        /* Ghost Rival Mode */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">
                Asynchronous Matchmaking
              </span>
              <h3 className="text-xl font-black text-white">Ghost Rival AI Racing Arena</h3>
              <p className="text-xs text-slate-400">
                Race in real-time against recorded benchmark avatars of state champions and national percentiles.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {GHOST_PRESETS.map((ghost) => (
                <button
                  key={ghost.id}
                  onClick={() => {
                    setSelectedGhost(ghost);
                    setGhostRaceActive(false);
                    setGhostReps(0);
                    setUserReps(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedGhost.id === ghost.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {ghost.name}
                </button>
              ))}
            </div>
          </div>

          {/* Race Track HUD */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">
                Target: {selectedGhost.targetReps} Reps ({selectedGhost.activity}) in 60s
              </span>
              <span className="text-amber-400 font-mono text-sm font-bold">
                Time Remaining: {ghostTimer}s
              </span>
            </div>

            {/* Ghost Lane */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-purple-400 flex items-center gap-1.5">
                  <Ghost className="w-3.5 h-3.5" />
                  {selectedGhost.name}
                </span>
                <span className="font-bold text-white">{ghostReps} / {selectedGhost.targetReps} reps</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-purple-500/30">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (ghostReps / selectedGhost.targetReps) * 100)}%` }}
                />
              </div>
            </div>

            {/* You (Player) Lane */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-orange-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  You (Live Athlete)
                </span>
                <span className="font-bold text-white">{userReps} / {selectedGhost.targetReps} reps</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-orange-500/30">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (userReps / selectedGhost.targetReps) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setUserReps((r) => r + 1)}
                  disabled={!ghostRaceActive}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs rounded-lg transition-all"
                >
                  +1 Valid Rep Completed
                </button>
                <button
                  onClick={() => setUserReps((r) => Math.max(0, r - 1))}
                  disabled={!ghostRaceActive}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs rounded-lg"
                >
                  -1
                </button>
              </div>

              {!ghostRaceActive ? (
                <button
                  onClick={handleStartGhostRace}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-orange-600/25 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Start Ghost Challenge
                </button>
              ) : (
                <button
                  onClick={() => setGhostRaceActive(false)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> End Race
                </button>
              )}
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
                      <span title="AI Verified">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
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
