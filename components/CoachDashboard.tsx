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
  UserCheck
} from 'lucide-react';

export interface AthleteRecord {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  state: string;
  district: string;
  institution: string;
  verificationStatus: 'Verified' | 'Partially Verified' | 'Self-Reported';
  compositeScore: number; // 0-100
  isHighPotential: boolean;
  metrics: {
    upperBodyStrength: number; // Centile 0-100
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

// Mock dataset representing talent pool from various Indian states and districts
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
    metrics: {
      upperBodyStrength: 98,
      coreStrength: 95,
      lowerBodyPower: 99,
      agility: 94,
      speed: 96,
    },
    rawValues: {
      pushups: 54,
      situps: 52,
      verticalJumpCm: 68,
      shuttleRunSec: 9.3,
      sprint50mSec: 6.7,
    },
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
    metrics: {
      upperBodyStrength: 94,
      coreStrength: 98,
      lowerBodyPower: 95,
      agility: 97,
      speed: 93,
    },
    rawValues: {
      pushups: 38,
      situps: 46,
      verticalJumpCm: 54,
      shuttleRunSec: 10.4,
      sprint50mSec: 7.3,
    },
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
    metrics: {
      upperBodyStrength: 88,
      coreStrength: 90,
      lowerBodyPower: 93,
      agility: 89,
      speed: 92,
    },
    rawValues: {
      pushups: 42,
      situps: 44,
      verticalJumpCm: 60,
      shuttleRunSec: 9.9,
      sprint50mSec: 7.1,
    },
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
    metrics: {
      upperBodyStrength: 82,
      coreStrength: 89,
      lowerBodyPower: 90,
      agility: 92,
      speed: 86,
    },
    rawValues: {
      pushups: 28,
      situps: 38,
      verticalJumpCm: 48,
      shuttleRunSec: 11.0,
      sprint50mSec: 7.8,
    },
    lastAssessed: "2026-09-18",
  },
  {
    id: "ATH-2026-215",
    name: "Rohan Kadam",
    age: 17,
    gender: "M",
    state: "Maharashtra",
    district: "Pune",
    institution: "Balewadi Krida Prabodhini",
    verificationStatus: "Self-Reported",
    compositeScore: 84.0,
    isHighPotential: false,
    metrics: {
      upperBodyStrength: 85,
      coreStrength: 80,
      lowerBodyPower: 86,
      agility: 84,
      speed: 82,
    },
    rawValues: {
      pushups: 36,
      situps: 35,
      verticalJumpCm: 52,
      shuttleRunSec: 10.6,
      sprint50mSec: 7.5,
    },
    lastAssessed: "2026-09-15",
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
    metrics: {
      upperBodyStrength: 96,
      coreStrength: 94,
      lowerBodyPower: 97,
      agility: 93,
      speed: 95,
    },
    rawValues: {
      pushups: 36,
      situps: 42,
      verticalJumpCm: 52,
      shuttleRunSec: 10.5,
      sprint50mSec: 7.4,
    },
    lastAssessed: "2026-09-26",
  },
];

const NATIONAL_BENCHMARK_RADAR = [
  { subject: 'Upper Body', nationalAvg: 50, eliteMin: 85 },
  { subject: 'Core Strength', nationalAvg: 50, eliteMin: 85 },
  { subject: 'Lower Body', nationalAvg: 50, eliteMin: 85 },
  { subject: 'Agility', nationalAvg: 50, eliteMin: 85 },
  { subject: 'Speed', nationalAvg: 50, eliteMin: 85 },
];

export default function CoachDashboard() {
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(SAMPLE_ATHLETES[0].id);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Extract unique states and districts
  const uniqueStates = useMemo(() => {
    return Array.from(new Set(SAMPLE_ATHLETES.map((a) => a.state)));
  }, []);

  const availableDistricts = useMemo(() => {
    if (selectedState === 'ALL') {
      return Array.from(new Set(SAMPLE_ATHLETES.map((a) => a.district)));
    }
    return Array.from(
      new Set(SAMPLE_ATHLETES.filter((a) => a.state === selectedState).map((a) => a.district))
    );
  }, [selectedState]);

  // Filtered athlete cohort
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

      return matchState && matchDistrict && matchSearch && matchStatus;
    });
  }, [selectedState, selectedDistrict, searchQuery, statusFilter]);

  const selectedAthlete = useMemo(() => {
    return SAMPLE_ATHLETES.find((a) => a.id === selectedAthleteId) || SAMPLE_ATHLETES[0];
  }, [selectedAthleteId]);

  // Radar chart data for currently selected athlete vs National Average
  const radarChartData = useMemo(() => {
    return [
      {
        subject: 'Upper Body',
        athleteScore: selectedAthlete.metrics.upperBodyStrength,
        nationalAvg: 50,
        eliteMin: 85,
      },
      {
        subject: 'Core Strength',
        athleteScore: selectedAthlete.metrics.coreStrength,
        nationalAvg: 50,
        eliteMin: 85,
      },
      {
        subject: 'Lower Body',
        athleteScore: selectedAthlete.metrics.lowerBodyPower,
        nationalAvg: 50,
        eliteMin: 85,
      },
      {
        subject: 'Agility',
        athleteScore: selectedAthlete.metrics.agility,
        nationalAvg: 50,
        eliteMin: 85,
      },
      {
        subject: 'Speed',
        athleteScore: selectedAthlete.metrics.speed,
        nationalAvg: 50,
        eliteMin: 85,
      },
    ];
  }, [selectedAthlete]);

  // Handler to export scout dossier
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
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Top Header */}
      <header className="mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
              Khelo India Protocol
            </span>
            <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AI Verification Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2 text-white flex items-center gap-2">
            FitFlow Coach & Talent Scouting Portal
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sports Authority of India (SAI) Regional Talent Pipeline & Multi-Modal Verification
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center min-w-[100px]">
            <div className="text-xs text-slate-400">Total Scouts</div>
            <div className="text-xl font-bold text-white">{SAMPLE_ATHLETES.length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center min-w-[100px]">
            <div className="text-xs text-slate-400">Top 5% Elite</div>
            <div className="text-xl font-bold text-amber-400">
              {SAMPLE_ATHLETES.filter((a) => a.isHighPotential).length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center min-w-[100px]">
            <div className="text-xs text-slate-400">Verified Ratio</div>
            <div className="text-xl font-bold text-emerald-400">
              {Math.round(
                (SAMPLE_ATHLETES.filter((a) => a.verificationStatus === "Verified").length /
                  SAMPLE_ATHLETES.length) *
                  100
              )}%
            </div>
          </div>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* State Filter */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-sm">
            <MapPin className="w-4 h-4 text-orange-400" />
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

          {/* District Filter */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-sm">
            <Filter className="w-4 h-4 text-blue-400" />
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

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
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

        {/* Search Field */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, academy, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </section>

      {/* Main Grid: Athlete Table (Left) + Radar Biometrics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Athlete Candidates Table */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-white text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-orange-400" />
              Scouted Athletes ({filteredAthletes.length})
            </h2>
            <span className="text-xs text-slate-400">Click row to inspect biometric radar</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Athlete</th>
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3 text-center">Talent Score</th>
                  <th className="px-4 py-3 text-center">Verification</th>
                  <th className="px-4 py-3 text-right">Action</th>
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
                        isSelected ? 'bg-orange-500/10' : 'hover:bg-slate-800/60'
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-white flex items-center gap-2">
                          {athlete.name}
                          {athlete.isHighPotential && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              TOP 5%
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[180px]">
                          {athlete.institution}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-xs text-slate-300">
                        <div>{athlete.district}</div>
                        <div className="text-slate-500">{athlete.state}</div>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <div className="text-base font-extrabold text-white">
                          {athlete.compositeScore}
                        </div>
                        <div className="text-[10px] text-slate-400">SAI Centile</div>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        {athlete.verificationStatus === 'Verified' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        ) : athlete.verificationStatus === 'Partially Verified' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Activity className="w-3 h-3" />
                            Partial
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <ShieldAlert className="w-3 h-3" />
                            Self-Reported
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateScoutReport(athlete);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-orange-500 hover:text-white text-xs font-medium text-slate-200 transition-colors inline-flex items-center gap-1.5"
                          title="Download Official SAI Scout Card"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Scout Card</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Athlete Talent Radar & Biometric Inspection (Right) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Radar Chart Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-start justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-orange-400 font-bold">
                  Talent Radar Analysis
                </div>
                <h3 className="text-xl font-bold text-white">{selectedAthlete.name}</h3>
                <p className="text-xs text-slate-400">
                  {selectedAthlete.age} yrs • {selectedAthlete.gender === 'M' ? 'Male' : 'Female'} •{' '}
                  {selectedAthlete.district}, {selectedAthlete.state}
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-orange-400">
                  {selectedAthlete.compositeScore}
                </div>
                <div className="text-[10px] text-slate-400">Composite Score</div>
              </div>
            </div>

            {/* Radar Chart Container */}
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar
                    name="Athlete Centile"
                    dataKey="athleteScore"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="National Avg (P50)"
                    dataKey="nationalAvg"
                    stroke="#64748b"
                    fill="#64748b"
                    fillOpacity={0.1}
                    strokeDasharray="4 4"
                  />
                  <Radar
                    name="Elite Threshold (P85)"
                    dataKey="eliteMin"
                    stroke="#10b981"
                    fill="transparent"
                    strokeDasharray="3 3"
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Raw Biometrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-800 text-xs">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400">Push-ups (60s)</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {selectedAthlete.rawValues.pushups} reps
                </div>
                <div className="text-[10px] text-emerald-400">
                  {selectedAthlete.metrics.upperBodyStrength}th centile
                </div>
              </div>

              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400">Sit-ups (60s)</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {selectedAthlete.rawValues.situps} reps
                </div>
                <div className="text-[10px] text-emerald-400">
                  {selectedAthlete.metrics.coreStrength}th centile
                </div>
              </div>

              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400">Vertical Jump</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {selectedAthlete.rawValues.verticalJumpCm} cm
                </div>
                <div className="text-[10px] text-emerald-400">
                  {selectedAthlete.metrics.lowerBodyPower}th centile
                </div>
              </div>

              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400">4x10m Shuttle</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {selectedAthlete.rawValues.shuttleRunSec}s
                </div>
                <div className="text-[10px] text-emerald-400">
                  {selectedAthlete.metrics.agility}th centile
                </div>
              </div>

              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400">50m Sprint</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {selectedAthlete.rawValues.sprint50mSec}s
                </div>
                <div className="text-[10px] text-emerald-400">
                  {selectedAthlete.metrics.speed}th centile
                </div>
              </div>

              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col justify-center">
                <button
                  onClick={() => handleGenerateScoutReport(selectedAthlete)}
                  disabled={isExporting}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-1.5 px-2 rounded text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  {isExporting ? 'Exporting...' : 'Export Dossier'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
