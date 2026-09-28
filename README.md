# FitFlow + Fit India / Khelo India Digital Fitness Platform

> **AI-Powered Multiplayer Fitness Gaming & National Athletic Talent Spotting Architecture**  
> Aligned with the Sports Authority of India (SAI) & Ministry of Youth Affairs and Sports (MYAS) Guidelines.

---

## 1. Project Overview

**FitFlow** bridges everyday fitness gamification with national athletic scouting. By turning standard smartphone and laptop cameras into certified biomechanical testing stations, FitFlow empowers athletes across India—from rural districts to premier universities—to assess their physical prowess, compete in real-time 1v1 multiplayer battles, and enter the national Khelo India talent discovery pipeline.

### Core Architectural Pillars
1. **Camera-Based Pose Detection Engine (`lib/vision/poseAnalyzer.ts`)**:
   - MediaPipe 33 3D skeletal landmark tracking.
   - Trigonometric joint angle calculation ($BA \cdot BC$).
   - Finite State Machines for **Squats**, **Push-ups**, and **Sit-ups** with strict form validation (depth, trunk angle, hip sag).
   - **Vertical Jump**: Calibrated flight time and pixel-to-cm ratio.
   - **Shuttle Run (4x10m)**: Boundary crossing detection and split-second turnaround timing.
2. **Multi-Modal Anti-Cheating & Verification Engine**:
   - Cross-sensor telemetry verification (MediaPipe skeleton + Mobile Accelerometer cadence + Wearable Bluetooth HR).
   - Tri-tier classification: `Verified` (1.25x UFP bonus), `Partially Verified` (1.0x), `Self-Reported` (0.7x discount).
   - Tamper-proof telemetry signing via HMAC-SHA256.
3. **Talent-Spotting & Analytics Dashboard (`components/CoachDashboard.tsx`, `lib/analytics/talentScout.ts`)**:
   - Age- and gender-normalized Khelo India percentile calculation using official SAI standard deviation curves.
   - Composite Athletic Talent Index (0–100) combining Strength, Power, Agility, and Speed.
   - Automatic flagging of national prospects (top 5th percentile / P95+).
   - Exportable SAI Scout Cards (CSV/PDF) for district sports officers.
4. **Dynamic Fitness ETA & Progress Engine (`lib/analytics/dynamicETA.ts`)**:
   - Continuous forecasting model predicting target milestone dates based on verified workout momentum, consistency index, and physiological decay curves.
5. **Multiplayer Gamification (`components/LiveBattleLeaderboard.tsx`)**:
   - Real-time 1v1 cross-discipline battles using Unified Fitness Points (UFP) normalized by metabolic energy expenditure (MET).
   - Live campus, hostel, district, and national leaderboards.

---

## 2. Repository Layout

```text
fitflow-khelo-india/
├── database/
│   └── schema.sql             # PostgreSQL / Supabase DDL with RLS & Khelo India benchmarks
├── lib/
│   ├── vision/
│   │   └── poseAnalyzer.ts    # MediaPipe 33 Landmark Pose Engine & State Machines
│   └── analytics/
│       ├── talentScout.ts     # Khelo India Z-Score Norms & 0-100 Composite Scoring
│       └── dynamicETA.ts      # Continuous Forecast & Unified Fitness Points (UFP)
├── components/
│   ├── CoachDashboard.tsx     # Scout Portal with Recharts Radar & District Filtering
│   └── LiveBattleLeaderboard.tsx # 1v1 Live Arena & National Rankings
├── tests/
│   └── engineTest.js          # Node.js Verification Test Suite
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```

---

## 3. Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- PostgreSQL 15+ (or Supabase CLI)

### Installation
```bash
cd fitflow-khelo-india
npm install
```

### Database Initialization
Run the schema script in your PostgreSQL or Supabase SQL Editor:
```bash
psql -h localhost -U postgres -d fitflow_db -f database/schema.sql
```

### Running the Test Suite
```bash
npm test
```

### Launching Development Server
```bash
npm run dev
```

---

## 4. Git Workflow & Automation Instructions

To commit and push updates to your GitHub repository:

```bash
# 1. Check status
git status

# 2. Add modified or new files
git add .

# 3. Commit using Conventional Commits convention
git commit -m "feat(core): update FitFlow engine and scouting dashboard"

# 4. Push to remote
git push origin main
```
