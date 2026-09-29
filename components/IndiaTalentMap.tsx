"use client";

import React, { useState } from 'react';
import {
  MapPin,
  Trophy,
  Award,
  Sparkles,
  TrendingUp,
  Compass,
  CheckCircle2,
  Calendar,
  Filter
} from 'lucide-react';

interface ZoneTalentSummary {
  zoneName: string;
  keyStates: string[];
  athleteCount: number;
  eliteProportionPct: number;
  dominantTraits: string[];
  recommendedDisciplines: string[];
  upcomingTrials: {
    district: string;
    state: string;
    date: string;
    facility: string;
  }[];
}

const REGIONAL_ZONES: ZoneTalentSummary[] = [
  {
    zoneName: "Northern Zone",
    keyStates: ["Haryana", "Punjab", "Delhi NCR", "Rajasthan"],
    athleteCount: 14200,
    eliteProportionPct: 8.4,
    dominantTraits: ["Upper Body Explosiveness", "Lower Body Power", "Lactate Threshold"],
    recommendedDisciplines: ["Wrestling & Combat Sports", "Track & Field (Throws/Jumps)", "Boxing", "Weightlifting"],
    upcomingTrials: [
      { district: "Bhiwani", state: "Haryana", date: "Oct 12, 2026", facility: "Bhiwani SAI Training Center" },
      { district: "Patiala", state: "Punjab", date: "Oct 18, 2026", facility: "NIS Patiala Stadium" },
      { district: "Jodhpur", state: "Rajasthan", date: "Nov 02, 2026", facility: "Barkatullah Khan Stadium" },
    ],
  },
  {
    zoneName: "Southern Zone",
    keyStates: ["Kerala", "Karnataka", "Tamil Nadu", "Telangana"],
    athleteCount: 12850,
    eliteProportionPct: 7.9,
    dominantTraits: ["Agility & Lateral Deceleration", "Aerobic VO2 Max", "Reaction Velocity"],
    recommendedDisciplines: ["Badminton & Racquet Sports", "Track & Field (Sprints/Hurdles)", "Football", "Aquatics"],
    upcomingTrials: [
      { district: "Kottayam", state: "Kerala", date: "Oct 15, 2026", facility: "Nehru Stadium Sports Academy" },
      { district: "Bengaluru", state: "Karnataka", date: "Oct 24, 2026", facility: "SAI South Center Kanteerava" },
    ],
  },
  {
    zoneName: "Eastern & North-East Zone",
    keyStates: ["Manipur", "Assam", "Odisha", "West Bengal"],
    athleteCount: 9600,
    eliteProportionPct: 9.1,
    dominantTraits: ["Fast-Twitch Neuromuscular Recruitment", "Core Stability", "Linear Speed"],
    recommendedDisciplines: ["Weightlifting", "Archery", "Boxing & Wushu", "Sprint Kayaking"],
    upcomingTrials: [
      { district: "Imphal", state: "Manipur", date: "Oct 20, 2026", facility: "Khuman Lampak Main Stadium" },
      { district: "Guwahati", state: "Assam", date: "Nov 05, 2026", facility: "Sarusajai Sports Complex" },
    ],
  },
  {
    zoneName: "Western & Central Zone",
    keyStates: ["Maharashtra", "Gujarat", "Madhya Pradesh"],
    athleteCount: 11400,
    eliteProportionPct: 6.8,
    dominantTraits: ["Multi-Planar Mobility", "Isometric Core Endurance", "Consistent Cadence"],
    recommendedDisciplines: ["Gymnastics & Malkhamb", "Shooting", "Long-Distance Athletics", "Table Tennis"],
    upcomingTrials: [
      { district: "Pune", state: "Maharashtra", date: "Oct 28, 2026", facility: "Balewadi Krida Prabodhini" },
      { district: "Bhopal", state: "Madhya Pradesh", date: "Nov 10, 2026", facility: "Tatya Tope Stadium Complex" },
    ],
  },
];

export default function IndiaTalentMap() {
  const [selectedZone, setSelectedZone] = useState<ZoneTalentSummary>(REGIONAL_ZONES[0]);
  const [testAthleteMetrics, setTestAthleteMetrics] = useState({
    upperBody: 92,
    core: 88,
    lowerBody: 95,
    agility: 82,
    speed: 94,
  });

  // AI Olympic Sport Match Algorithm based on Biometric Radar
  const recommendedSports = React.useMemo(() => {
    const list: { sport: string; matchPct: number; rationale: string }[] = [];

    // Track Sprinting
    const sprintScore = (testAthleteMetrics.speed * 0.6 + testAthleteMetrics.lowerBody * 0.4);
    list.push({
      sport: "Track & Field (100m/200m Sprint & Long Jump)",
      matchPct: Math.round(sprintScore),
      rationale: "Exceptional lower body explosive power and high-velocity turnover.",
    });

    // Wrestling / Combat
    const combatScore = (testAthleteMetrics.upperBody * 0.4 + testAthleteMetrics.core * 0.4 + testAthleteMetrics.lowerBody * 0.2);
    list.push({
      sport: "Wrestling / Boxing / Combat Disciplines",
      matchPct: Math.round(combatScore),
      rationale: "Dominant upper quadrant force and core torsional stability.",
    });

    // Badminton / Court Agility
    const courtScore = (testAthleteMetrics.agility * 0.5 + testAthleteMetrics.speed * 0.3 + testAthleteMetrics.lowerBody * 0.2);
    list.push({
      sport: "Badminton & Fast Court Sports",
      matchPct: Math.round(courtScore),
      rationale: "High lateral deceleration and rapid split turnaround agility.",
    });

    return list.sort((a, b) => b.matchPct - a.matchPct);
  }, [testAthleteMetrics]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase flex items-center gap-1">
              <Compass className="w-3 h-3" /> Geospatial Scouting Intelligence
            </span>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
              Sports Authority of India
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            National Talent Density & Olympic Sport Match AI
          </h2>
          <p className="text-xs text-slate-400">
            Maps athletic biometrics across Indian regions and predicts optimal Olympic disciplines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Regional Zones Selector (Left) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Scouting Zone
          </span>

          {REGIONAL_ZONES.map((zone) => {
            const isSelected = zone.zoneName === selectedZone.zoneName;
            return (
              <div
                key={zone.zoneName}
                onClick={() => setSelectedZone(zone)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-orange-500/15 border-orange-500 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-white text-sm">{zone.zoneName}</h4>
                  <span className="text-xs font-bold text-amber-400">{zone.eliteProportionPct}% Elite Ratio</span>
                </div>

                <div className="text-xs text-slate-400 mt-1">
                  States: {zone.keyStates.join(', ')}
                </div>

                <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                  <span>Assessed: <strong className="text-white">{zone.athleteCount.toLocaleString()}</strong></span>
                  <span className="text-emerald-400 font-semibold truncate">
                    Trials: {zone.upcomingTrials.length} upcoming
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Zone Deep Dive & Olympic Sport AI Match (Right) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Zone Intelligence Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-orange-400 font-bold">
                  Regional Phenotype Profile
                </span>
                <h3 className="text-lg font-black text-white">{selectedZone.zoneName} Athletic Cluster</h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-400">
                  {selectedZone.athleteCount.toLocaleString()}
                </span>
                <div className="text-[10px] text-slate-400">Athletes Evaluated</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs font-bold text-slate-300 mb-1.5">Dominant Biomechanical Biomarkers:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedZone.dominantTraits.map((tr) => (
                    <span
                      key={tr}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 text-slate-200 border border-slate-800"
                    >
                      {tr}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-300 mb-1.5">High-Yield Olympic Talent Pipelines:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedZone.recommendedDisciplines.map((disc) => (
                    <span
                      key={disc}
                      className="px-2.5 py-1 rounded-md text-xs font-bold bg-orange-500/10 text-orange-300 border border-orange-500/20"
                    >
                      {disc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming District Trials Schedule */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                Upcoming SAI District Selection Trials
              </div>
              <div className="space-y-2">
                {selectedZone.upcomingTrials.map((tr) => (
                  <div
                    key={tr.facility}
                    className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{tr.district}, {tr.state}</div>
                      <div className="text-[11px] text-slate-400">{tr.facility}</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-slate-800 text-amber-300 text-[11px] font-bold">
                      {tr.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Olympic Sport Recommendation Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  AI Olympic Discipline Suitability
                </h4>
                <p className="text-[11px] text-slate-400">
                  Matches individual biometric ratios with peak international medal success models.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {recommendedSports.map((rec, idx) => (
                <div
                  key={rec.sport}
                  className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-600/30 text-orange-400 text-xs font-bold flex items-center justify-center border border-orange-500/40">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">{rec.sport}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{rec.rationale}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-black text-emerald-400">{rec.matchPct}%</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Suitability Match</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
