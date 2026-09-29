/**
 * FITFLOW: BIOMECHANICAL KINETIC ASYMMETRY & INJURY RISK DETECTOR
 * Evaluates bilateral joint angles, pelvic level, and knee valgus (medial collapse)
 * during compound athletic movements to prevent injuries and optimize performance.
 */

import { Landmark3D, POSE_LANDMARKS } from '@/lib/vision/poseAnalyzer';

export interface AsymmetryReport {
  symmetryScorePct: number; // 0 - 100% (100% = perfectly balanced)
  injuryRiskTier: 'LOW' | 'MODERATE' | 'ELEVATED';
  leftAngleDeg: number;
  rightAngleDeg: number;
  bilateralDeltaDeg: number;
  kneeValgusRisk: boolean;
  pelvicTiltDeg: number;
  clinicalFeedback: string;
  correctiveDrills: string[];
}

export class AsymmetryDetector {
  /**
   * Evaluates bilateral knee kinematics during squat descent to detect
   * knee valgus (inward collapse) and unilateral limb dominance.
   */
  public analyzeSquatKinematics(
    landmarks: Landmark3D[],
    calculateAngleFn: (a: Landmark3D, b: Landmark3D, c: Landmark3D) => number
  ): AsymmetryReport {
    const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const leftKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const rightKnee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
    const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const rightAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

    const leftKneeAngle = calculateAngleFn(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngleFn(rightHip, rightKnee, rightAnkle);
    const bilateralDelta = Math.abs(leftKneeAngle - rightKneeAngle);

    // Pelvic tilt angle (horizontal deviation between left and right hip)
    const dyHips = Math.abs(leftHip.y - rightHip.y);
    const dxHips = Math.abs(leftHip.x - rightHip.x);
    const pelvicTiltDeg = Math.round((Math.atan2(dyHips, dxHips || 0.001) * 180) / Math.PI);

    // Knee Valgus check: Knee x-distance narrower than hip x-distance during bottom phase
    const hipWidth = Math.abs(leftHip.x - rightHip.x);
    const kneeWidth = Math.abs(leftKnee.x - rightKnee.x);
    const kneeValgusRisk = kneeWidth < hipWidth * 0.85 && (leftKneeAngle < 110 || rightKneeAngle < 110);

    // Compute Symmetry Percentage (100% minus scaled delta)
    const symmetryScorePct = Math.max(50, Math.round(100 - bilateralDelta * 1.8 - pelvicTiltDeg * 1.5));

    let injuryRiskTier: AsymmetryReport['injuryRiskTier'] = 'LOW';
    let clinicalFeedback = 'Optimal bilateral balance. Balanced load distribution across patellar tendons.';
    const correctiveDrills: string[] = [];

    if (kneeValgusRisk || bilateralDelta > 15 || pelvicTiltDeg > 8) {
      injuryRiskTier = 'ELEVATED';
      clinicalFeedback = kneeValgusRisk
        ? 'Warning: Medial knee collapse (Valgus) detected. Increases strain on Anterior Cruciate Ligament (ACL).'
        : `High limb asymmetry: ${bilateralDelta}° disparity between left and right knee load.`;
      correctiveDrills.push('Lateral Band Walks (Gluteus Medius activation)');
      correctiveDrills.push('Single-Leg Bulgarian Split Squats for bilateral balance');
      correctiveDrills.push('Cue knees driving outward over second toe');
    } else if (bilateralDelta > 8 || pelvicTiltDeg > 4) {
      injuryRiskTier = 'MODERATE';
      clinicalFeedback = 'Mild unilateral weight shifting. Right/Left loading discrepancy noted.';
      correctiveDrills.push('Tempo Goblet Squats with 3-second pause at bottom');
    }

    return {
      symmetryScorePct,
      injuryRiskTier,
      leftAngleDeg: leftKneeAngle,
      rightAngleDeg: rightKneeAngle,
      bilateralDeltaDeg: bilateralDelta,
      kneeValgusRisk,
      pelvicTiltDeg,
      clinicalFeedback,
      correctiveDrills: correctiveDrills.length ? correctiveDrills : ['Continue standard progressive overload'],
    };
  }

  /**
   * Evaluates bilateral elbow press symmetry and torso rotation during push-ups.
   */
  public analyzePushupKinematics(
    landmarks: Landmark3D[],
    calculateAngleFn: (a: Landmark3D, b: Landmark3D, c: Landmark3D) => number
  ): AsymmetryReport {
    const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftElbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
    const rightElbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
    const leftWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
    const rightWrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];

    const leftElbowAngle = calculateAngleFn(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngleFn(rightShoulder, rightElbow, rightWrist);
    const bilateralDelta = Math.abs(leftElbowAngle - rightElbowAngle);

    const dyShoulder = Math.abs(leftShoulder.y - rightShoulder.y);
    const dxShoulder = Math.abs(leftShoulder.x - rightShoulder.x);
    const shoulderTiltDeg = Math.round((Math.atan2(dyShoulder, dxShoulder || 0.001) * 180) / Math.PI);

    const symmetryScorePct = Math.max(50, Math.round(100 - bilateralDelta * 1.5 - shoulderTiltDeg * 2.0));

    let injuryRiskTier: AsymmetryReport['injuryRiskTier'] = 'LOW';
    let clinicalFeedback = 'Balanced pectoralis and triceps recruitment.';
    const correctiveDrills: string[] = [];

    if (bilateralDelta > 14 || shoulderTiltDeg > 7) {
      injuryRiskTier = 'ELEVATED';
      clinicalFeedback = 'Severe pressing asymmetry. Unequal shoulder plane could lead to rotator cuff impingement.';
      correctiveDrills.push('Dumbbell Floor Presses for unilateral scapular stability');
      correctiveDrills.push('Resistance band face pulls');
    } else if (bilateralDelta > 7) {
      injuryRiskTier = 'MODERATE';
      clinicalFeedback = 'Moderate dominant arm compensation during concentric push phase.';
      correctiveDrills.push('Incline push-ups focusing on equal palm pressure');
    }

    return {
      symmetryScorePct,
      injuryRiskTier,
      leftAngleDeg: leftElbowAngle,
      rightAngleDeg: rightElbowAngle,
      bilateralDeltaDeg: bilateralDelta,
      kneeValgusRisk: false,
      pelvicTiltDeg: shoulderTiltDeg,
      clinicalFeedback,
      correctiveDrills: correctiveDrills.length ? correctiveDrills : ['Form is balanced and injury-resistant'],
    };
  }
}
