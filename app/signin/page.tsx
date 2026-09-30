"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  ArrowRight,
  UserCheck,
  Lock,
  Mail,
  Building,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
  Trophy,
  Activity,
  QrCode,
  Fingerprint,
  Flame
} from 'lucide-react';

type UserRole = 'athlete' | 'coach' | 'admin';

interface DemoAccount {
  role: UserRole;
  label: string;
  sublabel: string;
  id: string;
  email: string;
  name: string;
  state: string;
  district: string;
  tier: string;
  badge: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'athlete',
    label: 'Elite Athlete Prospect',
    sublabel: 'Arjun Gurung • Top 5% National Pool',
    id: 'ATH-2026-091',
    email: 'arjun.gurung@kheloindia.gov.in',
    name: 'Arjun Gurung',
    state: 'Haryana',
    district: 'Bhiwani',
    tier: 'Tier-1 National Target Pool',
    badge: 'GOLD PROSPECT',
  },
  {
    role: 'coach',
    label: 'SAI NIS Chief Scout',
    sublabel: 'Coach Vikram Singh • Senior Talent Scout',
    id: 'COACH-SAI-882',
    email: 'vikram.singh@sai.gov.in',
    name: 'Coach Vikram Singh',
    state: 'National SAI Centre',
    district: 'New Delhi',
    tier: 'SAI NIS Level-3 Certified',
    badge: 'CHIEF SCOUT',
  },
  {
    role: 'admin',
    label: 'Ministry / SAI Director',
    sublabel: 'National Sports Governance & Verifications',
    id: 'ADMIN-MYAS-01',
    email: 'director.scout@kheloindia.gov.in',
    name: 'Dr. R. Sharma',
    state: 'Ministry of Youth Affairs & Sports',
    district: 'Central Secretariat',
    tier: 'Supreme Governance Tier',
    badge: 'MYAS DIRECTOR',
  },
];

export default function SignInPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('athlete');
  const [identifier, setIdentifier] = useState<string>('ATH-2026-091');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [signedInUser, setSignedInUser] = useState<DemoAccount | null>(null);

  const activeAccount = DEMO_ACCOUNTS.find(a => a.role === selectedRole) || DEMO_ACCOUNTS[0];

  const handleSelectDemo = (account: DemoAccount) => {
    setSelectedRole(account.role);
    setIdentifier(account.id);
    setPassword('KheloIndia2026@Pass');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const matched = DEMO_ACCOUNTS.find((a) => a.role === selectedRole) || {
        role: selectedRole,
        label: `${selectedRole.toUpperCase()} User`,
        sublabel: identifier,
        id: identifier,
        email: `${identifier.toLowerCase()}@fitflow.gov.in`,
        name: identifier,
        state: 'India',
        district: 'District',
        tier: 'Standard Certified',
        badge: 'REGISTERED',
      };
      setSignedInUser(matched);

      if (typeof window !== 'undefined') {
        localStorage.setItem('fitflow_auth_user', JSON.stringify(matched));
      }
    }, 700);
  };

  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* Return to home link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors group"
        >
          <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:border-orange-500 shadow-xs">
            <ChevronLeft className="w-3.5 h-3.5" />
          </div>
          <span>Return to FitFlow Main Hub</span>
        </Link>

        <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>MYAS Gov SSO Gateway v2.8</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Digital Credential Hologram & Quick Access */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive National ID Card Preview (Light Theme) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-orange-50/30 to-emerald-50/20 border-2 border-orange-500/30 p-5 shadow-md space-y-4">
            <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-600/25">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-slate-900 tracking-wider uppercase">
                    Khelo India Digital ID
                  </div>
                  <div className="text-[9px] text-slate-500 font-medium">
                    Government of India • SAI Registry
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                {activeAccount.badge}
              </span>
            </div>

            {/* Profile Body */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 border-2 border-white flex items-center justify-center flex-shrink-0 text-white font-black text-xl shadow-sm">
                {activeAccount.name.slice(0, 1)}
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <div className="text-sm font-extrabold text-slate-900 truncate">
                  {activeAccount.name}
                </div>
                <div className="text-[11px] font-mono text-orange-700 font-bold">
                  {activeAccount.id}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{activeAccount.district}, {activeAccount.state}</span>
                </div>
              </div>
            </div>

            {/* Biometric & SAI Seal */}
            <div className="bg-white/90 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-[11px] shadow-2xs">
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-semibold block">Authorization Tier</span>
                <span className="text-slate-800 font-bold">{activeAccount.tier}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                <Fingerprint className="w-4 h-4 text-emerald-600" />
                <span>Biometric OK</span>
              </div>
            </div>
          </div>

          {/* Quick 1-Click Demo Accounts Selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                1-Click Demo Personas
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                SIH Evaluator Ready
              </span>
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => {
                const isCurrent = selectedRole === acc.role;
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleSelectDemo(acc)}
                    type="button"
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group ${
                      isCurrent
                        ? 'bg-orange-50/70 border-orange-500/70 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        {acc.label}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                          isCurrent
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {acc.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 truncate">
                      {acc.sublabel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Form & Authentication Box */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md">
          {signedInUser ? (
            /* Successful Session Confirmation */
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-500 text-emerald-700 mx-auto flex items-center justify-center shadow-md shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                  Authentication Certified
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  Welcome to FitFlow, {signedInUser.name}!
                </h2>
                <p className="text-xs text-slate-600">
                  Session initialized as <span className="font-bold text-slate-900 uppercase">{signedInUser.role}</span> ({signedInUser.id}) • {signedInUser.state}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-sm mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Level:</span>
                  <span className="font-bold text-orange-600 uppercase">{signedInUser.role} Portal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registry ID:</span>
                  <span className="font-mono text-slate-900 font-bold">{signedInUser.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jurisdiction:</span>
                  <span className="text-slate-700 font-medium">{signedInUser.district}, {signedInUser.state}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-600/25 transition-all"
                >
                  <Activity className="w-4 h-4" />
                  Proceed to Live Platform
                </Link>
                <button
                  onClick={() => setSignedInUser(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Switch Account
                </button>
              </div>
            </div>
          ) : (
            /* Sign In Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-orange-600" />
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                    Official National Gateway
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">Sign In to FitFlow Portal</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Choose your role tier to access certified assessment stations and national scouting records.
                </p>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('athlete');
                    setIdentifier('ATH-2026-091');
                  }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'athlete'
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/25'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  Athlete
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('coach');
                    setIdentifier('COACH-SAI-882');
                  }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'coach'
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/25'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  SAI Coach
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('admin');
                    setIdentifier('ADMIN-MYAS-01');
                  }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'admin'
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/25'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </button>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    {selectedRole === 'athlete'
                      ? 'Khelo India Athlete ID / Email'
                      : selectedRole === 'coach'
                      ? 'SAI Coach Accreditation ID'
                      : 'Ministry Official Email / ID'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        selectedRole === 'athlete'
                          ? 'e.g. ATH-2026-091'
                          : selectedRole === 'coach'
                          ? 'e.g. COACH-SAI-882'
                          : 'e.g. director.scout@kheloindia.gov.in'
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Security Password / PIN
                    </label>
                    <span className="text-[10px] text-orange-600 font-medium">
                      Demo password auto-provided
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-800">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-orange-600 focus:ring-0"
                    />
                    <span>Remember this testing station</span>
                  </label>

                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    SAI Digital Token
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-orange-600/25 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying SAI Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate & Access {selectedRole.toUpperCase()} Hub</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
