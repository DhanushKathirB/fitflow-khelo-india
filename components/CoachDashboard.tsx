"use client";

import React, { useState, useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import {
  ShieldCheck,
  ShieldAlert,
  Download,
  Search,
  Filter,
  Trophy,
  Activity,
  Award,
  ChevronRight,
  TrendingUp,
  MapPin,
  UserCheck,
  QrCode,
  SlidersHorizontal
} from 'lucide-react';
import TalentPassportModal from '@/components/TalentPassportModal';

export interface AthleteRecord {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  state: string;
  district: string;
  institution: string;
  verificationStatus: 'Verified' | 'Partially Verified' | 'Self-Reported';
  compositeScore: number;
  isHighPotential: boolean;
  metrics: {
    upperBodyStrength: number;
    coreStrength: number;
    lowerBodyPower: number;
    agility: number;
    speed: number;
  };
  rawValues: {
    pushups: number;
    situps: number;
    verticalJumpCm: number;
    shuttleRunSec: number;
    sprint50mSec: number;
  };
  lastAssessed: string;
}

const SAMPLE_ATHLETES: AthleteRecord[] = [
  {
    id: "ATH-2026-091",
    name: "Arjun Gurung",
    age: 17,
    gender: "M",
    state: "Haryana",
    district: "Bhiwani",
    institution: "Bhiwani Boxing & Athletics Academy",
    verificationStatus: "Verified",
    compositeScore: 97.4,
    isHighPotential: true,
    metrics: { upperBodyStrength: 98, coreStrength: 95, lowerBodyPower: 99, agility: 94, speed: 96 },
    rawValues: { pushups: 54, situps: 52, verticalJumpCm: 68, shuttleRunSec: 9.3, sprint50mSec: 6.7 },
    lastAssessed: "2026-09-24",
  },
  {
    id: "ATH-2026-042",
    name: "Pooja Tomar",
    age: 16,
    gender: "F",
    state: "Uttar Pradesh",
    district: "Meerut",
    institution: "Meerut Sports College",
    verificationStatus: "Verified",
    compositeScore: 96.1,
    isHighPotential: true,
    metrics: { upperBodyStrength: 94, coreStrength: 98, lowerBodyPower: 95, agility: 97, speed: 93 },
    rawValues: { pushups: 38, situps: 46, verticalJumpCm: 54, shuttleRunSec: 10.4, sprint50mSec: 7.3 },
    lastAssessed: "2026-09-22",
  },
  {
    id: "ATH-2026-118",
    name: "Vikas Bishnoi",
    age: 18,
    gender: "M",
    state: "Rajasthan",
    district: "Jodhpur",
    institution: "Desert Athletics Center",
    verificationStatus: "Verified",
    compositeScore: 91.2,
    isHighPotential: false,
    metrics: { upperBodyStrength: 88, coreStrength: 90, lowerBodyPower: 93, agility: 89, speed: 92 },
    rawValues: { pushups: 42, situps: 44, verticalJumpCm: 60, shuttleRunSec: 9.9, sprint50mSec: 7.1 },
    lastAssessed: "2026-09-20",
  },
  {
    id: "ATH-2026-085",
    name: "Ananya Nair",
    age: 17,
    gender: "F",
    state: "Kerala",
    district: "Kottayam",
    institution: "St. Thomas Sports Wing",
    verificationStatus: "Partially Verified",
    compositeScore: 88.5,
    isHighPotential: false,
    metrics: { upperBodyStrength: 82, coreStrength: 89, lowerBodyPower: 90, agility: 92, speed: 86 },
    rawValues: { pushups: 28, situps: 38, verticalJumpCm: 48, shuttleRunSec: 11.0, sprint50mSec: 7.8 },
    lastAssessed: "2026-09-18",
  },
  {
    id: "ATH-2026-304",
    name: "Kavita Devi",
    age: 15,
    gender: "F",
    state: "Haryana",
    district: "Rohtak",
    institution: "Chhotu Ram Stadium Trust",
    verificationStatus: "Verified",
    compositeScore: 95.8,
    isHighPotential: true,
    metrics: { upperBodyStrength: 96, coreStrength: 94, lowerBodyPower: 97, agility: 93, speed: 95 },
    rawValues: { pushups: 36, situps: 42, verticalJumpCm: 52, shuttleRunSec: 10.5, sprint50mSec: 7.4 },
    lastAssessed: "2026-09-26",
  },
];

export default function CoachDashboard() {
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(SAMPLE_ATHLETES[0].id);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [minPushups, setMinPushups] = useState<number>(0);
  const [minVerticalJump, setMinVerticalJump] = useState<number>(0);
  const [maxShuttleRun, setMaxShuttleRun] = useState<number>(15);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [passportAthlete, setPassportAthlete] = useState<AthleteRecord | null>(null);

  const uniqueStates = useMemo(() => Array.from(new Set(SAMPLE_ATHLETES.map((a) => a.state))), []);
  const availableDistricts = useMemo(() => {
    if (selectedState === 'ALL') return Array.from(new Set(SAMPLE_ATHLETES.map((a) => a.district)));
    return Array.from(new Set(SAMPLE_ATHLETES.filter((a) => a.state === selectedState).map((a) => a.district)));
  }, [selectedState]);

  const filteredAthletes = useMemo(() => {
    return SAMPLE_ATHLETES.filter((a) => {
      const matchState = selectedState === 'ALL' || a.state === selectedState;
      const matchDistrict = selectedDistrict === 'ALL' || a.district === selectedDistrict;
      const matchSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'VERIFIED_ONLY' && a.verificationStatus === 'Verified') ||
        (statusFilter === 'HIGH_POTENTIAL' && a.isHighPotential);
      const matchPushups = a.rawValues.pushups >= minPushups;
      const matchVerticalJump = a.rawValues.verticalJumpCm >= minVerticalJump;
      const matchShuttleRun = a.rawValues.shuttleRunSec <= maxShuttleRun;

      return (
        matchState &&
        matchDistrict &&
        matchSearch &&
        matchStatus &&
        matchPushups &&
        matchVerticalJump &&
        matchShuttleRun
      );
    });
  }, [selectedState, selectedDistrict, searchQuery, statusFilter, minPushups, minVerticalJump, maxShuttleRun]);

  const selectedAthlete = useMemo(() => {
    return SAMPLE_ATHLETES.find((a) => a.id === selectedAthleteId) || SAMPLE_ATHLETES[0];
  }, [selectedAthleteId]);

  const radarChartData = useMemo(() => {
    return [
      { subject: 'Upper Body', athleteScore: selectedAthlete.metrics.upperBodyStrength, nationalAvg: 50, eliteMin: 85 },
      { subject: 'Core Strength', athleteScore: selectedAthlete.metrics.coreStrength, nationalAvg: 50, eliteMin: 85 },
      { subject: 'Lower Body', athleteScore: selectedAthlete.metrics.lowerBodyPower, nationalAvg: 50, eliteMin: 85 },
      { subject: 'Agility', athleteScore: selectedAthlete.metrics.agility, nationalAvg: 50, eliteMin: 85 },
      { subject: 'Speed', athleteScore: selectedAthlete.metrics.speed, nationalAvg: 50, eliteMin: 85 },
    ];
  }, [selectedAthlete]);

  const handleGenerateScoutReport = (athlete: AthleteRecord) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "SAI Khelo India Talent Scout Report\n" +
        `Athlete ID,${athlete.id}\n` +
        `Name,${athlete.name}\n` +
        `State,${athlete.state}\n` +
        `District,${athlete.district}\n` +
        `Verification Status,${athlete.verificationStatus}\n` +
        `Composite Talent Score,${athlete.compositeScore}\n` +
        `Upper Body Strength Centile,${athlete.metrics.upperBodyStrength}\n` +
        `Core Strength Centile,${athlete.metrics.coreStrength}\n` +
        `Lower Body Power Centile,${athlete.metrics.lowerBodyPower}\n` +
        `Agility Centile,${athlete.metrics.agility}\n` +
        `Speed Centile,${athlete.metrics.speed}\n` +
        `National High Potential,${athlete.isHighPotential ? "YES (Top 5%)" : "Developing"}\n`;

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `KheloIndia_ScoutCard_${athlete.id}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 500);
  };

  return (
    <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl text-slate-100 font-sans">
      <header className="mb-6 border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
              Khelo India Protocol
            </span>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              SAI Certified
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            Coach & Talent Scouting Portal
          </h2>
          <p className="text-xs text-slate-400">
            Automated athletic identification using age and gender normalized Khelo India centiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center min-w-[100px]">
            <div className="text-[11px] text-slate-400">Athletes</div>
            <div className="text-xl font-bold text-white">{SAMPLE_ATHLETES.length}</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center min-w-[100px]">
            <div className="text-[11px] text-slate-400">Top 5% Elite</div>
            <div className="text-xl font-bold text-amber-400">
              {SAMPLE_ATHLETES.filter((a) => a.isHighPotential).length}
            </div>
          </div>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <section className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('ALL');
              }}
              className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All States</option>
              {uniqueStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Districts</option>
              {availableDistricts.map((dst) => (
                <option key={dst} value={dst}>
                  {dst}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Tiers</option>
              <option value="VERIFIED_ONLY">Verified Only</option>
              <option value="HIGH_POTENTIAL">National Prospects (P95+)</option>
            </select>
          </div>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search athlete or academy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </section>

      {/* Metric Filters: Push-up reps, Vertical jump height, Shuttle run time */}
      <section className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 mb-6 shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-orange-400" />
            <span>Khelo India Performance Metric Filters (Form-Verified Benchmarks)</span>
          </div>
          {(minPushups > 0 || minVerticalJump > 0 || maxShuttleRun < 15) && (
            <button
              onClick={() => {
                setMinPushups(0);
                setMinVerticalJump(0);
                setMaxShuttleRun(15);
              }}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
            >
              Reset Metric Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Push-up Reps Filter */}
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Min Push-Up Reps:</span>
              <span className="font-extrabold text-orange-400">{minPushups} reps</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="2"
              value={minPushups}
              onChange={(e) => setMinPushups(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0 (Any)</span>
              <span>30 (National)</span>
              <span>60 (Elite)</span>
            </div>
          </div>

          {/* Vertical Jump Height Filter */}
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Min Vertical Jump:</span>
              <span className="font-extrabold text-amber-400">{minVerticalJump} cm</span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              step="2"
              value={minVerticalJump}
              onChange={(e) => setMinVerticalJump(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0 cm</span>
              <span>45 cm (State)</span>
              <span>70 cm (Olympic)</span>
            </div>
          </div>

          {/* Shuttle Run Time Filter */}
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Max Shuttle Run Time:</span>
              <span className="font-extrabold text-emerald-400">{maxShuttleRun}s</span>
            </div>
            <input
              type="range"
              min="8.5"
              max="15"
              step="0.1"
              value={maxShuttleRun}
              onChange={(e) => setMaxShuttleRun(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>&le; 8.5s (Elite)</span>
              <span>&le; 11s (Good)</span>
              <span>15s (All)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-orange-400" />
              Scouted Athletes ({filteredAthletes.length})
            </h3>
            <span className="text-[11px] text-slate-400">Select athlete to inspect radar</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-2.5">Athlete</th>
                  <th className="px-4 py-2.5">District</th>
                  <th className="px-4 py-2.5 text-center">Score</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredAthletes.map((athlete) => {
                  const isSelected = athlete.id === selectedAthlete.id;
                  return (
                    <tr
                      key={athlete.id}
                      onClick={() => setSelectedAthleteId(athlete.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-orange-500/10' : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {athlete.name}
                          {athlete.isHighPotential && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              TOP 5%
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[170px]">
                          {athlete.institution}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-400">
                        {athlete.district}, {athlete.state}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="font-extrabold text-white text-sm">{athlete.compositeScore}</div>
                        <div className="text-[9px] text-slate-500">Centile</div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {athlete.verificationStatus}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPassportAthlete(athlete);
                            }}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                            title="View Khelo India Digital Passport"
                          >
                            <QrCode className="w-3.5 h-3.5 text-orange-400" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateScoutReport(athlete);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-orange-600/20 hover:bg-orange-600 border border-orange-500/30 text-orange-300 hover:text-white text-[11px] font-semibold transition-all inline-flex items-center gap-1 shadow-sm"
                            title="Export Official Scout Profile (CSV)"
                          >
                            <Download className="w-3 h-3" />
                            <span>Export Scout Profile</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Athlete Radar (Right) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-start justify-between mb-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                  Talent Radar Analysis
                </span>
                <h4 className="text-lg font-black text-white">{selectedAthlete.name}</h4>
                <div className="text-xs text-slate-400">
                  {selectedAthlete.district}, {selectedAthlete.state}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-orange-400">
                  {selectedAthlete.compositeScore}
                </div>
                <div className="text-[9px] text-slate-500 uppercase">Composite Centile</div>
              </div>
            </div>

            <div className="w-full h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 100]} stroke="#475569" tick={{ fontSize: 9 }} />
                  <Radar name="Athlete" dataKey="athleteScore" stroke="#f97316" fill="#f97316" fillOpacity={0.4} />
                  <Radar name="National Avg" dataKey="nationalAvg" stroke="#64748b" fill="#64748b" fillOpacity={0.1} strokeDasharray="3 3" />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Actions: Export Scout Profile & Athlete Passport */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap justify-between items-center gap-2">
              <button
                onClick={() => handleGenerateScoutReport(selectedAthlete)}
                disabled={isExporting}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-orange-400" />
                {isExporting ? 'Exporting...' : 'Export Scout Profile'}
              </button>
              <button
                onClick={() => setPassportAthlete(selectedAthlete)}
                className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-orange-600/20"
              >
                <QrCode className="w-3.5 h-3.5" />
                View Athlete Passport
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Talent Passport Modal */}
      {passportAthlete && (
        <TalentPassportModal
          isOpen={!!passportAthlete}
          onClose={() => setPassportAthlete(null)}
          athlete={passportAthlete}
        />
      )}
    </div>
  );
}
