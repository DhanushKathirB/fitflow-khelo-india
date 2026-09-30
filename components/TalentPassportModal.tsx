"use client";

import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  QrCode,
  Download,
  Printer,
  CheckCircle,
  ExternalLink,
  X,
  Sparkles,
  MapPin,
  Calendar,
  Lock
} from 'lucide-react';

export interface TalentPassportProps {
  isOpen: boolean;
  onClose: () => void;
  athlete: {
    id: string;
    kheloIndiaId?: string;
    name: string;
    age: number;
    gender: 'M' | 'F';
    state: string;
    district: string;
    institution: string;
    compositeScore: number;
    verificationStatus: string;
    isHighPotential: boolean;
    metrics: {
      upperBodyStrength: number;
      coreStrength: number;
      lowerBodyPower: number;
      agility: number;
      speed: number;
    };
    certifiedHash?: string;
  };
}

export default function TalentPassportModal({ isOpen, onClose, athlete }: TalentPassportProps) {
  const [isVerifyingQR, setIsVerifyingQR] = useState<boolean>(false);
  const [qrVerified, setQrVerified] = useState<boolean>(false);

  if (!isOpen) return null;

  const kiId = athlete.kheloIndiaId || `KI-${new Date().getFullYear()}-${athlete.state.slice(0, 2).toUpperCase()}-${athlete.id.slice(-4)}`;
  const certHash = athlete.certifiedHash || `0x89f7a2b91c4d9e034a781b2f90184c6e_${athlete.id}`;

  const handleSimulateQRScan = () => {
    setIsVerifyingQR(true);
    setTimeout(() => {
      setIsVerifyingQR(false);
      setQrVerified(true);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-orange-600/30">
              KI
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                Khelo India Digital Athlete Passport
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20 font-semibold">
                  Official SAI Registry
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Cryptographically Signed Biometric Fitness Certificate</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Official Passport Card (Printable Area) */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
          <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-orange-500/40 rounded-2xl p-6 shadow-2xl overflow-hidden">
            {/* National Watermark / Accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Passport Header Badge */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-black text-xl text-white">
                    {athlete.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-black text-white tracking-tight">{athlete.name}</h4>
                  <div className="text-xs text-orange-400 font-bold font-mono">{kiId}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {athlete.district}, {athlete.state}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  {athlete.compositeScore >= 95 ? 'NATIONAL PROSPECT (TOP 5%)' : 'STATE TALENT POOL'}
                </span>
                <div className="text-[10px] text-slate-400 mt-1">SAI National Ranking Cohort</div>
              </div>
            </div>

            {/* Biometric Scores Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-5 text-center">
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Upper Body</div>
                <div className="text-lg font-black text-white mt-0.5">{athlete.metrics.upperBodyStrength}</div>
                <div className="text-[9px] text-emerald-400">P-Centile</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Core Power</div>
                <div className="text-lg font-black text-white mt-0.5">{athlete.metrics.coreStrength}</div>
                <div className="text-[9px] text-emerald-400">P-Centile</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Lower Power</div>
                <div className="text-lg font-black text-white mt-0.5">{athlete.metrics.lowerBodyPower}</div>
                <div className="text-[9px] text-emerald-400">P-Centile</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Agility</div>
                <div className="text-lg font-black text-white mt-0.5">{athlete.metrics.agility}</div>
                <div className="text-[9px] text-emerald-400">P-Centile</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Sprint Speed</div>
                <div className="text-lg font-black text-white mt-0.5">{athlete.metrics.speed}</div>
                <div className="text-[9px] text-emerald-400">P-Centile</div>
              </div>
            </div>

            {/* Verification & QR Code Security Seal */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800/90 gap-4">
              <div className="flex items-center gap-3.5">
                {/* Simulated Scannable QR Matrix */}
                <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center shadow-md">
                  <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center p-1">
                    <QrCode className="w-full h-full text-white" />
                  </div>
                </div>

                <div className="text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    AI & Wearable Certified
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    HMAC Signature: <span className="font-mono text-slate-300">{certHash.slice(0, 16)}...</span>
                  </div>
                  <div className="text-slate-500 text-[10px] mt-0.5">
                    Valid for Khelo India Youth Games Selection Camps
                  </div>
                </div>
              </div>

              <button
                onClick={handleSimulateQRScan}
                disabled={isVerifyingQR || qrVerified}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  qrVerified
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isVerifyingQR ? (
                  'Verifying Ledger...'
                ) : qrVerified ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Signature 100% Authentic
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-orange-400" />
                    Scan & Verify Token
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Fit India Mission • Sports Authority of India (SAI)
          </span>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Official ID
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
