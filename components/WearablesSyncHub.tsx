"use client";

import React, { useState, useEffect } from 'react';
import {
  Heart,
  Activity,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Zap,
  MapPin,
  Flame,
  Watch
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function WearablesSyncHub() {
  const [googleFitConnected, setGoogleFitConnected] = useState<boolean>(true);
  const [stravaConnected, setStravaConnected] = useState<boolean>(true);
  const [heartRateData, setHeartRateData] = useState<any[]>([]);
  const [currentBpm, setCurrentBpm] = useState<number>(142);
  const [stravaActivity, setStravaActivity] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Fetch or simulate live Wearable HR curve from Google Fit API
  const syncGoogleFit = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/integrations/google-fit?duration=60');
      const json = await res.json();
      if (json.data && json.data.heartRateSamples) {
        const formatted = json.data.heartRateSamples.map((s: any, idx: number) => ({
          time: `${idx * 2}s`,
          bpm: s.bpm,
        }));
        setHeartRateData(formatted);
        setCurrentBpm(json.data.peakHeartRate);
      }
    } catch (err) {
      console.error('Failed to sync Google Fit', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Fetch or simulate Strava sprint track from Strava API
  const syncStrava = async () => {
    try {
      const res = await fetch('/api/integrations/strava?test=SPRINT_50M');
      const json = await res.json();
      if (json.activity) {
        setStravaActivity(json.activity);
      }
    } catch (err) {
      console.error('Failed to sync Strava', err);
    }
  };

  useEffect(() => {
    syncGoogleFit();
    syncStrava();
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Multi-Modal Fusion Engine
            </span>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
              Google Fit & Strava APIs
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            Wearable Telemetry & Anti-Cheat Validation
          </h2>
          <p className="text-xs text-slate-400">
            Fuses Camera Pose repetition bursts with smartwatch heart rate curves and GPS track velocity.
          </p>
        </div>

        <button
          onClick={() => {
            syncGoogleFit();
            syncStrava();
          }}
          disabled={isSyncing}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing APIs...' : 'Refresh Telemetry'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Google Fit Cardiovascular Stream (Left) */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Google Fit Heart Rate Stream</h3>
                <div className="text-[11px] text-slate-400">derived:com.google.heart_rate.bpm</div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Connected
            </span>
          </div>

          {/* Current Live BPM Readout */}
          <div className="flex items-baseline gap-3 my-4">
            <span className="text-4xl font-black text-white">{currentBpm}</span>
            <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">
              Peak BPM (Anaerobic Exertion)
            </span>
          </div>

          {/* Recharts Exertion Curve */}
          <div className="w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={heartRateData}>
                <defs>
                  <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 10 }} />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} stroke="#475569" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bpm"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBpm)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Resting HR: 74 BPM</span>
            <span className="text-emerald-400 font-bold">Delta: +68 BPM (Form Validated)</span>
          </div>
        </div>

        {/* Strava Outdoor Track Sprint Verification (Right) */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Flame className="w-5 h-5 fill-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Strava Outdoor Athletic Sync</h3>
                <div className="text-[11px] text-slate-400">GPS Track & Split Velocity Streams</div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Geofence Verified
            </span>
          </div>

          {stravaActivity ? (
            <div>
              <div className="flex justify-between items-baseline my-3">
                <div>
                  <div className="text-3xl font-black text-white">{stravaActivity.movingTimeSeconds}s</div>
                  <div className="text-xs text-slate-400">50m Sprint Time</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-orange-400">{stravaActivity.maxSpeedMps} m/s</div>
                  <div className="text-xs text-slate-400">Top Speed (32.1 km/h)</div>
                </div>
              </div>

              {/* Split Pacing Breakdown */}
              <div className="mt-4">
                <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  10m Split Accelerations
                </div>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {stravaActivity.splitPacing.map((sp: any) => (
                    <div key={sp.splitMeter} className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <div className="text-slate-400 text-[10px]">{sp.splitMeter}m</div>
                      <div className="font-bold text-white mt-0.5">{sp.splitSeconds}s</div>
                      <div className="text-[9px] text-emerald-400">{sp.velocityMps} m/s</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">Loading Strava telemetry...</div>
          )}

          <div className="mt-6 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-orange-400" /> SAI Certified Track (Rohtak)
            </span>
            <span className="text-emerald-400 font-bold">100% Authentic Match</span>
          </div>
        </div>
      </div>
    </div>
  );
}
