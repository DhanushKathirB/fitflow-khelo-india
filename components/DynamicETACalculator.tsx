"use client";

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Calendar,
  Zap,
  Target,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { calculateDynamicETA, GoalDefinition, ActivityHistoryEntry } from '@/lib/analytics/dynamicETA';

export default function DynamicETACalculator() {
  const [selectedGoal, setSelectedGoal] = useState<string>('pushups');
  const [currentScore, setCurrentScore] = useState<number>(26);
  const [targetScore, setTargetScore] = useState<number>(50);
  const [consistency, setConsistency] = useState<number>(0.85); // 0.0 to 1.0

  // Mock verified workout history stream
  const mockHistory: ActivityHistoryEntry[] = useMemo(() => [
    { date: "2026-09-01", score: 20, verificationLevel: "Verified", validReps: 20, totalReps: 21 },
    { date: "2026-09-08", score: 22, verificationLevel: "Verified", validReps: 22, totalReps: 23 },
    { date: "2026-09-15", score: 24, verificationLevel: "Verified", validReps: 24, totalReps: 25 },
    { date: "2026-09-22", score: 26, verificationLevel: "Verified", validReps: 26, totalReps: 27 },
  ], []);

  const eta = useMemo(() => {
    const goal: GoalDefinition = {
      metricName: selectedGoal,
      currentScore,
      targetScore,
      unit: selectedGoal === 'vertical_jump' ? 'cm' : 'reps',
      isLowerBetter: false,
    };

    return calculateDynamicETA(goal, mockHistory, consistency);
  }, [selectedGoal, currentScore, targetScore, consistency, mockHistory]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Predictive Physiology Engine
            </span>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
              Continuous Forecast
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            Dynamic Fitness ETA & Adaptation Forecaster
          </h2>
          <p className="text-xs text-slate-400">
            Predicts the exact milestone target date by modeling recent verified workout momentum and recovery curves.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Form (Left) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-400" />
            Milestone Parameters
          </h3>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Target Exercise</label>
            <select
              value={selectedGoal}
              onChange={(e) => {
                setSelectedGoal(e.target.value);
                if (e.target.value === 'vertical_jump') {
                  setCurrentScore(42);
                  setTargetScore(65);
                } else {
                  setCurrentScore(26);
                  setTargetScore(50);
                }
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="pushups">Push-ups (SAI 60s Reps)</option>
              <option value="squats">Squats (SAI 60s Reps)</option>
              <option value="vertical_jump">Vertical Jump Height (cm)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Current Baseline</label>
              <input
                type="number"
                value={currentScore}
                onChange={(e) => setCurrentScore(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Milestone</label>
              <input
                type="number"
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Weekly Consistency Score</span>
              <span className="font-bold text-orange-400">{Math.round(consistency * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.05"
              value={consistency}
              onChange={(e) => setConsistency(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Sporadic (2x/mo)</span>
              <span>Dedicated (4x/wk)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Workouts Weighting: 100%
            </div>
            <p className="text-[11px] text-slate-400">
              Only AI-verified repetitions count towards progressive adaptation modeling.
            </p>
          </div>
        </div>

        {/* Forecast Output HUD (Right) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-orange-400 tracking-wider">
              Projected Milestone Date
            </span>

            <div className="mt-2 flex items-baseline gap-4">
              <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {eta.projectedDate}
              </span>
              <span className="text-sm font-bold text-emerald-400">
                (~{eta.daysRemaining} days remaining)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Progression Velocity</div>
                <div className="text-lg font-bold text-white mt-1">
                  +{eta.currentVelocityPerWeek}{' '}
                  <span className="text-xs font-normal text-slate-400">
                    {selectedGoal === 'vertical_jump' ? 'cm/wk' : 'reps/wk'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Confidence Window</div>
                <div className="text-lg font-bold text-white mt-1">
                  ±{eta.confidenceMarginDays}{' '}
                  <span className="text-xs font-normal text-slate-400">days</span>
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Momentum Status</div>
                <div className="text-sm font-bold text-amber-400 mt-1 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {eta.momentumStatus}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
            <AlertCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">AI Coach Recommendation:</span>{' '}
              <span>{eta.recommendation}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
