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
  Activity
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
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'athlete',
    label: 'Athlete Demo (Elite Prospect)',
    sublabel: 'Arjun Gurung • Top 5% National Pool',
    id: 'ATH-2026-091',
    email: 'arjun.gurung@kheloindia.gov.in',
    name: 'Arjun Gurung',
    state: 'Haryana',
    district: 'Bhiwani',
  },
  {
    role: 'coach',
    label: 'SAI NIS Coach Demo',
    sublabel: 'Coach Vikram Singh • Chief Talent Scout',
    id: 'COACH-SAI-882',
    email: 'vikram.singh@sai.gov.in',
    name: 'Vikram Singh',
    state: 'National SAI Centre',
    district: 'New Delhi',
  },
  {
    role: 'admin',
    label: 'Ministry / SAI Admin Demo',
    sublabel: 'National Sports Governance & Verifications',
    id: 'ADMIN-MYAS-01',
    email: 'director.scout@kheloindia.gov.in',
    name: 'Dr. R. Sharma (Director)',
    state: 'Ministry of Youth Affairs & Sports',
    district: 'Central Secretariat',
  },
];

export default function SignInPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('athlete');
  const [identifier, setIdentifier] = useState<string>('ATH-2026-091');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [signedInUser, setSignedInUser] = useState<DemoAccount | null>(null);

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
      };
      setSignedInUser(matched);

      // Save user session in localStorage for app-wide continuity
      if (typeof window !== 'undefined') {
        localStorage.setItem('fitflow_auth_user', JSON.stringify(matched));
      }
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Return to home link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-orange-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to FitFlow Platform
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Branding / Instructions Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Fit India • Khelo India Auth
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight">
              Single Sign-On & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                National Athlete Registry
              </span>
            </h1>

            <p className="mt-3 text-xs text-slate-300 leading-relaxed">
              Log in to sync your verified fitness tests, access the Khelo India Digital Talent Passport, and participate in certified state and national trials.
            </p>

            <div className="mt-6 space-y-3 pt-6 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>SAI Certified Multi-Factor Authentication</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Anti-Cheat Tri-Tier Telemetry Verification</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Synchronized with National Talent Radar</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Accounts Selection */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quick Demo Accounts
              </span>
              <span className="text-[10px] text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded">
                Click to Auto-fill
              </span>
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleSelectDemo(acc)}
                  type="button"
                  className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/40 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                      {acc.label}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {acc.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{acc.sublabel}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sign-In Form Column */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {signedInUser ? (
            /* Authenticated Session Confirmation */
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Authentication Successful
                </span>
                <h2 className="text-2xl font-black text-white">
                  Welcome back, {signedInUser.name}!
                </h2>
                <p className="text-xs text-slate-400">
                  Signed in as <span className="font-semibold text-white uppercase">{signedInUser.role}</span> ({signedInUser.id}) • {signedInUser.state}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-w-sm mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Role:</span>
                  <span className="font-bold text-orange-400 uppercase">{signedInUser.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registry ID:</span>
                  <span className="font-mono text-white">{signedInUser.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Access Jurisdiction:</span>
                  <span className="text-slate-200">{signedInUser.district}, {signedInUser.state}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all"
                >
                  <Activity className="w-4 h-4" />
                  Proceed to Platform Dashboard
                </Link>
                <button
                  onClick={() => setSignedInUser(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Sign Out / Switch User
                </button>
              </div>
            </div>
          ) : (
            /* Sign In Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">Sign In to Your Account</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select your authorization tier to access personalized modules.
                </p>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('athlete');
                    setIdentifier('ATH-2026-091');
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'athlete'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
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
                  className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'coach'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
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
                  className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'admin'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </button>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                    {selectedRole === 'athlete'
                      ? 'Khelo India Athlete ID / Email'
                      : selectedRole === 'coach'
                      ? 'SAI Coach Accreditation ID'
                      : 'Ministry Official Email / ID'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase">
                      Security Password / PIN
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('In demonstration mode: Please use any password or click any Demo Account on the left to auto-fill.');
                      }}
                      className="text-[11px] text-orange-400 hover:text-orange-300"
                    >
                      Forgot PIN?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your confidential password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-orange-500 focus:ring-0"
                    />
                    <span>Remember this station</span>
                  </label>

                  <span className="text-[11px] text-slate-500">
                    SAI Digital Token Verification
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Khelo India Protocol</span>
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
