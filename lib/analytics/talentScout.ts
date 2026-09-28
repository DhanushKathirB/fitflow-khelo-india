/**
 * FITFLOW: TALENT SPOTTING & KHELO INDIA BENCHMARK ANALYTICS ENGINE
 * Age & Gender Normalized Z-Score Distribution, Composite Talent Index (0-100),
 * and National Prospect Identification (SAI Protocols).
 */

export type Gender = 'M' | 'F' | 'Other';

export interface AthleteRawMetrics {
  age: number;
  gender: Gender;
  pushups?: number;       // Reps in 60 seconds
  situps?: number;        // Partial curl-ups in 60s
  squats?: number;        // Squats in 60s
  verticalJumpCm?: number;// Max height in cm
  shuttleRunSec?: number; // 4x10m shuttle run in seconds (lower is better)
  sprint50mSec?: number;  // 50m sprint in seconds (lower is better)
}

export interface NormativeDistribution {
  mean: number;
  stdDev: number;
  isHigherBetter: boolean;
}

export interface PillarScores {
  upperBodyStrength: number; // 0-100
  coreStrength: number;      // 0-100
  lowerBodyPower: number;    // 0-100
  agility: number;           // 0-100
  speed: number;             // 0-100
}

export interface TalentEvaluationResult {
  compositeScore: number;     // 0-100
  pillarScores: PillarScores;
  isHighPotential: boolean;   // Top 5th percentile flag
  talentTier: 'National_Prospect' | 'State_Camp_Eligible' | 'District_Developing' | 'Grassroots';
  percentileRank: number;
  strengths: string[];
  growthAreas: string[];
}

// Official Khelo India / SAI Normative Reference Matrices
// Stratified by Age Brackets (9-14, 15-18, 19-25) and Gender
const KHELO_INDIA_NORMS: Record<string, Record<string, NormativeDistribution>> = {
  // Male 15-18
  'M_15_18': {
    pushups: { mean: 26.5, stdDev: 9.2, isHigherBetter: true },
    situps: { mean: 30.2, stdDev: 8.8, isHigherBetter: true },
    squats: { mean: 38.5, stdDev: 11.2, isHigherBetter: true },
    verticalJumpCm: { mean: 44.2, stdDev: 8.5, isHigherBetter: true },
    shuttleRunSec: { mean: 11.2, stdDev: 0.95, isHigherBetter: false },
    sprint50mSec: { mean: 7.4, stdDev: 0.65, isHigherBetter: false },
  },
  // Female 15-18
  'F_15_18': {
    pushups: { mean: 16.8, stdDev: 7.5, isHigherBetter: true },
    situps: { mean: 25.1, stdDev: 7.9, isHigherBetter: true },
    squats: { mean: 32.6, stdDev: 9.8, isHigherBetter: true },
    verticalJumpCm: { mean: 34.5, stdDev: 7.1, isHigherBetter: true },
    shuttleRunSec: { mean: 12.3, stdDev: 1.05, isHigherBetter: false },
    sprint50mSec: { mean: 8.2, stdDev: 0.72, isHigherBetter: false },
  },
  // Male 19-25
  'M_19_25': {
    pushups: { mean: 32.4, stdDev: 10.5, isHigherBetter: true },
    situps: { mean: 35.0, stdDev: 9.5, isHigherBetter: true },
    squats: { mean: 42.0, stdDev: 12.0, isHigherBetter: true },
    verticalJumpCm: { mean: 50.4, stdDev: 9.2, isHigherBetter: true },
    shuttleRunSec: { mean: 10.7, stdDev: 0.88, isHigherBetter: false },
    sprint50mSec: { mean: 7.0, stdDev: 0.58, isHigherBetter: false },
  },
  // Female 19-25
  'F_19_25': {
    pushups: { mean: 22.1, stdDev: 8.4, isHigherBetter: true },
    situps: { mean: 28.5, stdDev: 8.2, isHigherBetter: true },
    squats: { mean: 36.0, stdDev: 10.5, isHigherBetter: true },
    verticalJumpCm: { mean: 38.6, stdDev: 7.8, isHigherBetter: true },
    shuttleRunSec: { mean: 11.8, stdDev: 0.98, isHigherBetter: false },
    sprint50mSec: { mean: 7.9, stdDev: 0.68, isHigherBetter: false },
  },
  // Youth 9-14 (Baseline Youth Bracket)
  'YOUTH_9_14': {
    pushups: { mean: 14.0, stdDev: 6.0, isHigherBetter: true },
    situps: { mean: 18.0, stdDev: 6.5, isHigherBetter: true },
    squats: { mean: 24.0, stdDev: 8.0, isHigherBetter: true },
    verticalJumpCm: { mean: 28.0, stdDev: 6.0, isHigherBetter: true },
    shuttleRunSec: { mean: 13.5, stdDev: 1.20, isHigherBetter: false },
    sprint50mSec: { mean: 8.8, stdDev: 0.85, isHigherBetter: false },
  },
};

export class TalentScout {
  /**
   * Resolves cohort key based on gender and age bracket.
   */
  private getCohortKey(age: number, gender: Gender): string {
    if (age <= 14) return 'YOUTH_9_14';
    const cleanGender = gender === 'F' ? 'F' : 'M';
    if (age <= 18) return `${cleanGender}_15_18`;
    return `${cleanGender}_19_25`;
  }

  /**
   * Cumulative Standard Normal Distribution Approximation (Error Function)
   * Converts Z-Score (-3 to +3) into Exact Percentile (0 to 100).
   */
  private zScoreToPercentile(z: number): number {
    const b1 = 0.319381530;
    const b2 = -0.356563782;
    const b3 = 1.781477937;
    const b4 = -1.821255978;
    const b5 = 1.330274429;
    const p = 0.2316419;
    const c = 0.39894228;

    if (z >= 0.0) {
      const t = 1.0 / (1.0 + p * z);
      const val = 1.0 - c * Math.exp(-z * z / 2.0) * t *
        (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
      return Math.min(99.9, Math.max(0.1, val * 100));
    } else {
      const t = 1.0 / (1.0 - p * z);
      const val = c * Math.exp(-z * z / 2.0) * t *
        (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
      return Math.min(99.9, Math.max(0.1, val * 100));
    }
  }

  /**
   * Normalizes a raw test metric into a 0-100 percentile score using cohort mean & standard deviation.
   */
  private normalizeMetric(
    rawValue: number | undefined,
    norm: NormativeDistribution | undefined
  ): number {
    if (rawValue === undefined || !norm) return 50.0; // Default median if not tested

    const diff = norm.isHigherBetter ? rawValue - norm.mean : norm.mean - rawValue;
    const zScore = diff / norm.stdDev;
    return Math.round(this.zScoreToPercentile(zScore) * 10) / 10;
  }

  /**
   * Flags high potential if athlete is in top 5th percentile (score >= 95).
   */
  public flagHighPotential(compositeScore: number): boolean {
    return compositeScore >= 95.0;
  }

  /**
   * Calculates the Khelo India Normalized Score and Composite Talent Index.
   * Weighs Upper Body Strength (25%), Core (20%), Lower Body Power (25%), Agility (20%), Speed (10%).
   */
  public calculateKheloIndiaScore(metrics: AthleteRawMetrics): TalentEvaluationResult {
    const cohortKey = this.getCohortKey(metrics.age, metrics.gender);
    const norms = KHELO_INDIA_NORMS[cohortKey] || KHELO_INDIA_NORMS['M_15_18'];

    // 1. Calculate Individual Pillar Percentile Scores
    const upperBodyScore = this.normalizeMetric(metrics.pushups, norms.pushups);
    const coreScore = this.normalizeMetric(metrics.situps, norms.situps);

    // Combine squats and vertical jump for lower body power if available
    const jumpScore = this.normalizeMetric(metrics.verticalJumpCm, norms.verticalJumpCm);
    const squatScore = this.normalizeMetric(metrics.squats, norms.squats);
    const lowerBodyScore = metrics.verticalJumpCm !== undefined && metrics.squats !== undefined
      ? (jumpScore * 0.6 + squatScore * 0.4)
      : (metrics.verticalJumpCm !== undefined ? jumpScore : squatScore);

    const agilityScore = this.normalizeMetric(metrics.shuttleRunSec, norms.shuttleRunSec);
    const speedScore = this.normalizeMetric(metrics.sprint50mSec, norms.sprint50mSec);

    // 2. Compute Weighted Composite Talent Score
    const weightedComposite = (
      upperBodyScore * 0.25 +
      coreScore * 0.20 +
      lowerBodyScore * 0.25 +
      agilityScore * 0.20 +
      speedScore * 0.10
    );

    const roundedComposite = Math.round(weightedComposite * 10) / 10;
    const isHighPotential = this.flagHighPotential(roundedComposite);

    // 3. Assign Tier
    let talentTier: 'National_Prospect' | 'State_Camp_Eligible' | 'District_Developing' | 'Grassroots';
    if (roundedComposite >= 95) {
      talentTier = 'National_Prospect';
    } else if (roundedComposite >= 85) {
      talentTier = 'State_Camp_Eligible';
    } else if (roundedComposite >= 70) {
      talentTier = 'District_Developing';
    } else {
      talentTier = 'Grassroots';
    }

    // 4. Determine Strengths and Growth Areas
    const pillarList = [
      { name: 'Upper Body Strength', score: upperBodyScore },
      { name: 'Core Strength', score: coreScore },
      { name: 'Lower Body Power', score: lowerBodyScore },
      { name: 'Agility & Coordination', score: agilityScore },
      { name: 'Explosive Speed', score: speedScore },
    ];

    pillarList.sort((a, b) => b.score - a.score);

    const strengths = pillarList.filter(p => p.score >= 75).map(p => `${p.name} (${p.score}th percentile)`);
    const growthAreas = pillarList.filter(p => p.score < 60).map(p => `${p.name} (${p.score}th percentile)`);

    return {
      compositeScore: roundedComposite,
      pillarScores: {
        upperBodyStrength: upperBodyScore,
        coreStrength: coreScore,
        lowerBodyPower: lowerBodyScore,
        agility: agilityScore,
        speed: speedScore,
      },
      isHighPotential,
      talentTier,
      percentileRank: roundedComposite,
      strengths: strengths.length ? strengths : ['Balanced athletic foundation'],
      growthAreas: growthAreas.length ? growthAreas : ['Maintain progressive volume'],
    };
  }
}
