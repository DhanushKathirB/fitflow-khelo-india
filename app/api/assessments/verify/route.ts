import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { TalentScout } from '@/lib/analytics/talentScout';
import { calculateUnifiedPoints } from '@/lib/analytics/dynamicETA';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const {
      athleteId,
      age,
      gender,
      exerciseType,
      rawScore,
      validReps,
      totalReps,
      durationSeconds,
      hasSensorTelemetry,
      sensorHeartRateDelta,
    } = payload;

    // 1. Determine Multi-Modal Verification Status
    let verificationStatus: 'Verified' | 'Partially Verified' | 'Self-Reported' = 'Self-Reported';
    const formAccuracy = totalReps > 0 ? (validReps / totalReps) * 100 : 90;

    if (hasSensorTelemetry && sensorHeartRateDelta >= 25 && formAccuracy >= 80) {
      verificationStatus = 'Verified';
    } else if (formAccuracy >= 75) {
      verificationStatus = 'Partially Verified';
    }

    // 2. Calculate Unified Fitness Points (UFP)
    const ufpPoints = calculateUnifiedPoints(
      exerciseType || 'pushup',
      validReps || rawScore,
      durationSeconds || 60,
      verificationStatus
    );

    // 3. Compute Khelo India Talent Centile
    const scout = new TalentScout();
    const metrics: any = { age: age || 17, gender: gender || 'M' };
    if (exerciseType === 'pushup') metrics.pushups = rawScore;
    if (exerciseType === 'squat') metrics.squats = rawScore;
    if (exerciseType === 'vertical_jump') metrics.verticalJumpCm = rawScore;
    if (exerciseType === 'shuttle_run') metrics.shuttleRunSec = rawScore;

    const evaluation = scout.calculateKheloIndiaScore(metrics);

    // 4. Generate Cryptographic Telemetry Signature (HMAC-SHA256)
    const secretKey = process.env.TELEMETRY_SECRET_KEY || 'khelo_india_fitflow_secret_token_2026';
    const signatureData = `${athleteId || 'ANON'}:${exerciseType}:${rawScore}:${validReps}:${verificationStatus}:${Date.now()}`;
    const hmacSignature = crypto.createHmac('sha256', secretKey).update(signatureData).digest('hex');

    return NextResponse.json({
      status: 'success',
      verification: {
        status: verificationStatus,
        formAccuracyPct: Math.round(formAccuracy),
        hmacSignature,
        ufpPointsAwarded: ufpPoints,
      },
      kheloIndiaEvaluation: evaluation,
      certifiedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 400 });
  }
}
