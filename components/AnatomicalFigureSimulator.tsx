"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Flame,
  Activity,
  Zap,
  Trophy,
  CheckCircle2,
  Sparkles,
  Layers,
  Eye,
  ShieldCheck,
  Play,
  RotateCcw,
  Sliders
} from 'lucide-react';

interface AnatomicalFigureSimulatorProps {
  exercise: 'pushup' | 'squat' | 'vertical_jump' | 'shuttle_run' | string;
  currentAngle: number;
  validReps: number;
  totalReps: number;
  formFeedback: string;
  isFormValid: boolean;
  jumpHeightCm?: number;
  shuttleSplits?: number;
}

interface MuscleInfo {
  name: string;
  primary: string;
  secondary: string;
  primaryMusclesList: string[];
  secondaryMusclesList: string[];
  imageSrc: string;
  gifSrc: string;
  kheloIndiaBenchmark: string;
  formCue: string;
}

const MUSCLE_METRICS: Record<string, MuscleInfo> = {
  pushup: {
    name: 'Push Up',
    primary: 'Chest (Pectoralis Major & Minor)',
    secondary: 'Triceps Brachii, Anterior Deltoids, Core',
    primaryMusclesList: ['Pectoralis Major', 'Pectoralis Minor'],
    secondaryMusclesList: ['Triceps Brachii', 'Anterior Deltoid', 'Rectus Abdominis'],
    imageSrc: '/assets/pushup_anatomy.jpg',
    gifSrc: '/assets/pushup_exercise.gif',
    kheloIndiaBenchmark: '32 reps / min (P85 State Standard)',
    formCue: 'Lower until elbow flexion < 90°, lock out at 160° with rigid spine.',
  },
  squat: {
    name: 'Deep Squat',
    primary: 'Quadriceps & Gluteus Maximus',
    secondary: 'Hamstrings, Calves, Erector Spinae',
    primaryMusclesList: ['Rectus Femoris', 'Vastus Lateralis', 'Gluteus Maximus'],
    secondaryMusclesList: ['Biceps Femoris', 'Gastrocnemius', 'Core Stabilizers'],
    imageSrc: '/assets/squat_anatomy.jpg',
    gifSrc: '/assets/squat_exercise.gif',
    kheloIndiaBenchmark: '42 reps / min (P90 National Standard)',
    formCue: 'Thighs must reach parallel to floor (knee angle < 95°).',
  },
  vertical_jump: {
    name: 'Explosive Vertical Jump / Jacks',
    primary: 'Calves (Gastrocnemius) & Quadriceps',
    secondary: 'Gluteus Maximus, Hip Flexors, Core',
    primaryMusclesList: ['Gastrocnemius & Soleus', 'Vastus Lateralis', 'Gluteus'],
    secondaryMusclesList: ['Hamstrings', 'Transverse Abdominis', 'Foot Plantar Flexors'],
    imageSrc: '/assets/jump_anatomy.jpg',
    gifSrc: '/assets/jump_exercise.gif',
    kheloIndiaBenchmark: '48 cm Apex (P90 Explosive Index)',
    formCue: 'Explode vertically from standing baseline; track hip apex displacement.',
  },
  shuttle_run: {
    name: '4x10m Shuttle Agility',
    primary: 'Hamstrings, Calves & Hip Abductors',
    secondary: 'Transverse Abdominis, Obliques, Quad decelerators',
    primaryMusclesList: ['Biceps Femoris', 'Gastrocnemius', 'Gluteus Medius'],
    secondaryMusclesList: ['Tensor Fasciae Latae', 'Obliques', 'Quadriceps'],
    imageSrc: '/assets/jump_anatomy.jpg',
    gifSrc: '/assets/jump_exercise.gif',
    kheloIndiaBenchmark: '10.8s Total Duration (P90 Agility)',
    formCue: 'Accelerate across 10m marker lines; decelerate low into direction reversals.',
  },
  situp: {
    name: 'Partial Curl-Up / Sit-Up',
    primary: 'Abdominals (Rectus Abdominis)',
    secondary: 'Internal/External Obliques, Hip Flexors',
    primaryMusclesList: ['Rectus Abdominis (Upper & Lower)', 'Transversus Abdominis'],
    secondaryMusclesList: ['Internal Obliques', 'External Obliques', 'Iliopsoas'],
    imageSrc: '/assets/pushup_anatomy.jpg',
    gifSrc: '/assets/situp_exercise.gif',
    kheloIndiaBenchmark: '35 reps / min (P85 Core Standard)',
    formCue: 'Curl up smoothly engaging rectus abdominis until scapulae clear the mat; lower under control.',
  },
};

export default function AnatomicalFigureSimulator({
  exercise,
  currentAngle,
  validReps,
  totalReps,
  formFeedback,
  isFormValid,
  jumpHeightCm = 0,
  shuttleSplits = 0,
}: AnatomicalFigureSimulatorProps) {
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'ANATOMY' | 'PROTOCOL'>('SUMMARY');
  const [repHistory, setRepHistory] = useState<number[]>([180, 160, 120, 85, 120, 165, 180]);
  const [viewMode, setViewMode] = useState<'ANIMATED' | 'ANATOMY' | 'DUAL'>('ANIMATED');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const currentInfo = MUSCLE_METRICS[exercise] || MUSCLE_METRICS.pushup;

  // Track live angle history for cadence wave
  useEffect(() => {
    setRepHistory((prev) => {
      const next = [...prev, currentAngle];
      if (next.length > 24) next.shift();
      return next;
    });
  }, [currentAngle]);

  // Compute dynamic muscle activation percentage based on joint depth
  const activationPct =
    exercise === 'pushup'
      ? Math.max(10, Math.min(100, Math.round(((180 - currentAngle) / 90) * 100)))
      : exercise === 'squat'
      ? Math.max(10, Math.min(100, Math.round(((180 - currentAngle) / 90) * 100)))
      : exercise === 'vertical_jump'
      ? Math.min(100, Math.round(jumpHeightCm * 1.5))
      : 80;

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800 text-slate-100 shadow-2xl">
      {/* Top Header with App-like Tabs */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-orange-600 flex items-center justify-center font-black text-xs text-white shadow-md shadow-orange-600/30">
            <Flame className="w-3.5 h-3.5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white">{currentInfo.name}</h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Animated Sim
              </span>
            </div>
            <span className="text-[10px] text-orange-400 font-semibold uppercase">
              AI Biomechanical Simulator & Cadence Engine
            </span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('ANIMATED')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'ANIMATED'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="View animated moving exercise figure demonstration"
          >
            <Play className="w-3 h-3 fill-current" />
            Animated GIF
          </button>
          <button
            onClick={() => setViewMode('ANATOMY')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'ANATOMY'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="View 3D Anatomical targeted muscle chart"
          >
            <Eye className="w-3 h-3" />
            3D Anatomy
          </button>
          <button
            onClick={() => setViewMode('DUAL')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'DUAL'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Dual view: Animated motion figure alongside 3D muscular anatomy chart"
          >
            <Layers className="w-3 h-3" />
            Dual View
          </button>
        </div>
      </div>

      {/* Secondary Navigation Tabs (Summary | Anatomy | How to) */}
      <div className="flex border-b border-slate-800 bg-slate-900/40 px-3 text-xs">
        <button
          onClick={() => setActiveTab('SUMMARY')}
          className={`py-2 px-3 font-bold border-b-2 transition-colors ${
            activeTab === 'SUMMARY'
              ? 'border-orange-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Summary & Live Cadence
        </button>
        <button
          onClick={() => setActiveTab('ANATOMY')}
          className={`py-2 px-3 font-bold border-b-2 transition-colors ${
            activeTab === 'ANATOMY'
              ? 'border-orange-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Muscle Recruitment
        </button>
        <button
          onClick={() => setActiveTab('PROTOCOL')}
          className={`py-2 px-3 font-bold border-b-2 transition-colors ${
            activeTab === 'PROTOCOL'
              ? 'border-orange-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Khelo India Protocol
        </button>
      </div>

      {/* Main Visual Display Area */}
      <div className="relative flex-1 min-h-[320px] flex items-center justify-center overflow-hidden bg-slate-950 p-2">
        {/* VIEW MODE 1: ANIMATED GIF DEMONSTRATION FIGURE (Default) */}
        {viewMode === 'ANIMATED' && (
          <div className="relative w-full h-full min-h-[300px] max-h-[380px] rounded-lg overflow-hidden flex items-center justify-center bg-black/50 border border-slate-900">
            {/* Real Looping Animated Exercise Figure */}
            <img
              src={currentInfo.gifSrc}
              alt={`${currentInfo.name} Demonstration Loop`}
              className="max-h-[350px] max-w-full object-contain rounded-lg drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            />

            {/* Dynamic Muscle Activation Pulse Overlay */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-200"
              style={{
                opacity: (activationPct / 100) * 0.45,
                background: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.4) 0%, rgba(239, 68, 68, 0.2) 40%, transparent 70%)',
              }}
            />

            {/* Biomechanical Telemetry Overlay - Top Left */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
              <div className="bg-slate-950/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px] shadow-lg">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Biomechanical Contraction</span>
                <div className="flex items-center gap-1.5 font-black text-orange-400 text-sm">
                  <Zap className="w-3.5 h-3.5 fill-orange-400" />
                  <span>{activationPct}% Load</span>
                </div>
              </div>

              <div className="bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] text-slate-300 shadow-md">
                <span className="text-slate-500">Target Muscle:</span>{' '}
                <span className="font-bold text-white">{currentInfo.primary.split('(')[0]}</span>
              </div>
            </div>

            {/* Motion Status & Live Angle Overlay - Top Right */}
            <div className="absolute top-2 right-2 z-10 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-right shadow-lg">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Valid Reps</span>
              <div className="text-xl font-black text-emerald-400 font-mono">{validReps}</div>
              <div className="text-[9px] text-slate-400">Total: {totalReps}</div>
            </div>

            {/* Motion Loop Badge - Bottom Left */}
            <div className="absolute bottom-2 left-2 z-10 bg-slate-950/80 backdrop-blur-sm px-2 py-1 rounded border border-slate-800 flex items-center gap-1.5 text-[10px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Animated Motion Looping (Full Flexion & Extension)</span>
            </div>
          </div>
        )}

        {/* VIEW MODE 2: 3D ANATOMY CHART */}
        {viewMode === 'ANATOMY' && (
          <div className="relative w-full h-full min-h-[300px] max-h-[380px] rounded-lg overflow-hidden flex items-center justify-center bg-black/40">
            <Image
              src={currentInfo.imageSrc}
              alt={currentInfo.name}
              fill
              className="object-contain"
              priority
            />

            {/* Dynamic Muscle Activation Luminous Pulse Filter */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-200"
              style={{
                opacity: activationPct / 100,
                background: 'radial-gradient(circle at 45% 45%, rgba(249, 115, 22, 0.45) 0%, rgba(239, 68, 68, 0.25) 35%, transparent 70%)',
              }}
            />

            {/* Biomechanical Telemetry Overlay */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
              <div className="bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px]">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Muscle Contraction</span>
                <div className="flex items-center gap-1.5 font-black text-orange-400 text-sm">
                  <Zap className="w-3.5 h-3.5 fill-orange-400" />
                  <span>{activationPct}% Load</span>
                </div>
              </div>

              <div className="bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] text-slate-300">
                <span className="text-slate-500">Target:</span>{' '}
                <span className="font-bold text-white">{currentInfo.primary.split('(')[0]}</span>
              </div>
            </div>

            {/* Right Rep & Cadence Status */}
            <div className="absolute top-2 right-2 z-10 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-right">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Valid Reps</span>
              <div className="text-xl font-black text-emerald-400 font-mono">{validReps}</div>
              <div className="text-[9px] text-slate-400">Total: {totalReps}</div>
            </div>
          </div>
        )}

        {/* VIEW MODE 3: DUAL SPLIT VIEW (Animated Figure + 3D Muscular Anatomy) */}
        {viewMode === 'DUAL' && (
          <div className="w-full h-full min-h-[300px] max-h-[380px] grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Left: Animated Demonstration Figure */}
            <div className="relative rounded-lg overflow-hidden flex items-center justify-center bg-black/60 border border-slate-900">
              <img
                src={currentInfo.gifSrc}
                alt={`${currentInfo.name} Animated Movement`}
                className="max-h-[320px] max-w-full object-contain"
              />
              <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 text-[9px] font-bold text-orange-400 uppercase tracking-wide">
                Kinematic Movement
              </div>
            </div>

            {/* Right: 3D Anatomical Target Breakdown */}
            <div className="relative rounded-lg overflow-hidden flex items-center justify-center bg-black/40 border border-slate-900">
              <Image
                src={currentInfo.imageSrc}
                alt={currentInfo.name}
                fill
                className="object-contain"
                priority
              />
              <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 text-[9px] font-bold text-blue-400 uppercase tracking-wide">
                Muscular Recruitment Chart
              </div>
              <div className="absolute top-2 right-2 bg-slate-950/90 px-2 py-1 rounded border border-slate-800 text-right text-[10px]">
                <span className="text-orange-400 font-bold">{activationPct}% Active</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Info Section (Matching User Reference Image Design) */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
        {activeTab === 'SUMMARY' && (
          <>
            {/* Title & Primary / Secondary Target Muscles */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black text-white">{currentInfo.name}</h4>
                <span className="text-xs font-semibold text-orange-400">
                  {validReps} reps <span className="text-slate-400 font-normal">(In progress)</span>
                </span>
              </div>

              <div className="text-xs space-y-0.5 mt-1">
                <div>
                  <span className="text-slate-400">Primary:</span>{' '}
                  <span className="text-slate-200 font-semibold">{currentInfo.primary}</span>
                </div>
                <div>
                  <span className="text-slate-400">Secondary:</span>{' '}
                  <span className="text-slate-400 font-medium">{currentInfo.secondary}</span>
                </div>
              </div>
            </div>

            {/* Real-time Angle Cadence Waveform */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                <span className="font-bold flex items-center gap-1">
                  <Activity className="w-3 h-3 text-orange-400" />
                  Live Cadence Waveform (Angle: {currentAngle}°)
                </span>
                <span className="text-emerald-400 font-mono font-bold">
                  {isFormValid ? 'FORM VERIFIED' : 'ALIGNMENT CAUTION'}
                </span>
              </div>

              <div className="w-full h-8 flex items-end gap-1">
                {repHistory.map((val, idx) => {
                  const barHeight = Math.max(15, Math.min(100, Math.round(((180 - val) / 90) * 100)));
                  return (
                    <div
                      key={idx}
                      className="flex-1 rounded-t transition-all duration-150"
                      style={{
                        height: `${barHeight}%`,
                        backgroundColor: val <= 95 ? '#10b981' : val <= 130 ? '#f59e0b' : '#334155',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Quick Records / Benchmarks */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] text-slate-400">SAI Benchmark:</span>
                <span className="font-bold text-white text-[11px]">{currentInfo.kheloIndiaBenchmark}</span>
              </div>

              <div className="text-[11px]">
                <span className="text-slate-400">Current Rate: </span>
                <span className="font-bold text-emerald-400">
                  {totalReps > 0 ? Math.round((validReps / totalReps) * 100) : 100}% Accuracy
                </span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'ANATOMY' && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Anatomical Muscle Recruitment Breakdown
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-orange-400 block mb-1">
                  Primary Movers
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {currentInfo.primaryMusclesList.map((m) => (
                    <li key={m} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">
                  Synergists & Stabilizers
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {currentInfo.secondaryMusclesList.map((m) => (
                    <li key={m} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'PROTOCOL' && (
          <div className="space-y-2 text-xs text-slate-300">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Official Khelo India Testing Criteria:
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              {currentInfo.formCue}
            </p>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-400">Scoring Formula:</span>
              <span className="font-mono text-amber-300 font-bold">Valid Reps × Form Factor</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
