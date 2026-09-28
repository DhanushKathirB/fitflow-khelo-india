/**
 * FITFLOW: DYNAMIC FITNESS ETA & MULTIPLAYER POINTS ENGINE
 * Continuous Goal Forecast Modeling & Cross-Activity Unified Fitness Points (UFP).
 */

export interface GoalDefinition {
  metricName: string; // e.g., 'pushups_60s', 'vertical_jump_cm', '5km_run_min'
  currentScore: number;
  targetScore: number;
  unit: string;
  isLowerBetter?: boolean; // e.g., run time
}

export interface ActivityHistoryEntry {
  date: string; // ISO date string
  score: number;
  verificationLevel: 'Verified' | 'Partially Verified' | 'Self-Reported';
  validReps: number;
  totalReps: number;
}

export interface ETAResult {
  daysRemaining: number;
  projectedDate: string;
  currentVelocityPerWeek: number;
  confidenceMarginDays: number;
  momentumStatus: 'ACCELERATING' | 'ON_TRACK' | 'PLATEAUED' | 'AT_RISK';
  recommendation: string;
}

export type VerificationTier = 'Verified' | 'Partially Verified' | 'Self-Reported';

/**
 * Calculates continuous Dynamic Fitness ETA.
 * Adjusts trajectory based on recent verified workout velocity, consistency index,
 * and diminishing physiological returns.
 */
export function calculateDynamicETA(
  goal: GoalDefinition,
  recentActivity: ActivityHistoryEntry[],
  consistencyScore: number // 0.0 to 1.0 (frequency & adherence)
): ETAResult {
  const isLowerBetter = goal.isLowerBetter ?? false;
  const deltaNeeded = isLowerBetter
    ? goal.currentScore - goal.targetScore
    : goal.targetScore - goal.currentScore;

  // Goal already achieved
  if (deltaNeeded <= 0) {
    return {
      daysRemaining: 0,
      projectedDate: new Date().toISOString().split('T')[0],
      currentVelocityPerWeek: 0,
      confidenceMarginDays: 0,
      momentumStatus: 'ON_TRACK',
      recommendation: 'Goal already achieved! Time to establish your next milestone.',
    };
  }

  // If no history, assume baseline physiological adaptation rate (2.5% improvement per week)
  if (!recentActivity || recentActivity.length < 2) {
    const defaultWeeklyGain = Math.max(0.5, goal.currentScore * 0.025);
    const estimatedWeeks = deltaNeeded / (defaultWeeklyGain * Math.max(0.4, consistencyScore));
    const daysRemaining = Math.round(estimatedWeeks * 7);
    const projDate = new Date();
    projDate.setDate(projDate.getDate() + daysRemaining);

    return {
      daysRemaining,
      projectedDate: projDate.toISOString().split('T')[0],
      currentVelocityPerWeek: Math.round(defaultWeeklyGain * 10) / 10,
      confidenceMarginDays: Math.round(daysRemaining * 0.25),
      momentumStatus: 'ON_TRACK',
      recommendation: 'Baseline estimate established. Complete 3 verified workouts to unlock precise ETA.',
    };
  }

  // Sort activities chronologically
  const sorted = [...recentActivity].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Compute weighted velocity (Verified = 1.0x, Partially Verified = 0.7x, Self-Reported = 0.35x)
  let weightedDeltasSum = 0;
  let totalTimeSpanDays = 0;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    const daysApart = Math.max(
      1,
      (new Date(curr.date).getTime() - new Date(prev.date).getTime()) / (1000 * 60 * 60 * 24)
    );

    const rawDelta = isLowerBetter ? prev.score - curr.score : curr.score - prev.score;

    // Weight factor based on verification credibility and form quality
    const formRatio = curr.totalReps > 0 ? curr.validReps / curr.totalReps : 0.8;
    const tierMultiplier =
      curr.verificationLevel === 'Verified' ? 1.0 :
      curr.verificationLevel === 'Partially Verified' ? 0.7 : 0.35;

    const weightedDelta = rawDelta * formRatio * tierMultiplier;
    weightedDeltasSum += (weightedDelta / daysApart) * 7; // Convert to per-week rate
    totalTimeSpanDays += daysApart;
  }

  const averageVelocityPerWeek = Math.max(0.1, weightedDeltasSum / (sorted.length - 1));

  // Factor in consistency factor (1.0 = perfect adherence, 0.4 = erratic)
  const adjustedVelocity = averageVelocityPerWeek * (0.5 + 0.5 * consistencyScore);

  // Biological adaptation diminishing returns factor
  const adaptationFactor = 0.95; // 5% slowing per month as athlete gets closer to ceiling
  const netWeeklyProgress = adjustedVelocity * adaptationFactor;

  const weeksNeeded = deltaNeeded / netWeeklyProgress;
  const daysRemaining = Math.max(3, Math.round(weeksNeeded * 7));

  const projDate = new Date();
  projDate.setDate(projDate.getDate() + daysRemaining);

  // Margin of error based on consistency
  const confidenceMarginDays = Math.max(2, Math.round(daysRemaining * (1.2 - consistencyScore * 0.8)));

  let momentumStatus: ETAResult['momentumStatus'] = 'ON_TRACK';
  let recommendation = 'Steady progression detected. Maintain current frequency.';

  if (consistencyScore > 0.85 && averageVelocityPerWeek > 1.5) {
    momentumStatus = 'ACCELERATING';
    recommendation = 'Peak momentum! Your verified workouts show accelerated adaptation.';
  } else if (averageVelocityPerWeek <= 0.3) {
    momentumStatus = 'PLATEAUED';
    recommendation = 'Progress has plateaued. Introduce progressive overload or recovery cycles.';
  } else if (consistencyScore < 0.5) {
    momentumStatus = 'AT_RISK';
    recommendation = 'Erratic workout intervals detected. Aim for at least 3 sessions weekly to hit target.';
  }

  return {
    daysRemaining,
    projectedDate: projDate.toISOString().split('T')[0],
    currentVelocityPerWeek: Math.round(adjustedVelocity * 10) / 10,
    confidenceMarginDays,
    momentumStatus,
    recommendation,
  };
}

/**
 * Calculates Unified Fitness Points (UFP) to balance different exercises on a single leaderboard.
 * Integrates metabolic cost, form accuracy, and anti-cheat verification bonuses.
 */
export function calculateUnifiedPoints(
  activity: string,
  validReps: number,
  durationSeconds: number,
  verificationLevel: VerificationTier
): number {
  // Base MET-adjusted exertion coefficients per valid repetition or activity unit
  const COEFFICIENTS: Record<string, { repMultiplier: number; baseRatePerSec: number }> = {
    pushup: { repMultiplier: 3.5, baseRatePerSec: 0.15 },
    situp: { repMultiplier: 2.2, baseRatePerSec: 0.12 },
    squat: { repMultiplier: 2.8, baseRatePerSec: 0.14 },
    vertical_jump: { repMultiplier: 1.2, baseRatePerSec: 0.05 }, // Per cm jumped
    shuttle_run: { repMultiplier: 25.0, baseRatePerSec: 0.5 },    // Per completed sprint
  };

  const config = COEFFICIENTS[activity.toLowerCase()] || { repMultiplier: 2.0, baseRatePerSec: 0.1 };

  // Calculate Base Output Points
  const repPoints = validReps * config.repMultiplier;
  const timePoints = durationSeconds * config.baseRatePerSec;
  const basePoints = repPoints + timePoints;

  // Multi-Tier Verification Multipliers (Anti-Cheating incentive)
  let verificationBonus = 1.0;
  if (verificationLevel === 'Verified') {
    verificationBonus = 1.25; // +25% reward for sensor + AI pose validated sessions
  } else if (verificationLevel === 'Partially Verified') {
    verificationBonus = 1.00; // Baseline points
  } else {
    verificationBonus = 0.70; // 30% reduction for unverified self-reported submissions
  }

  return Math.round(basePoints * verificationBonus);
}
