/**
 * FITFLOW: POSE DETECTION & EXERCISE VERIFICATION ENGINE
 * MediaPipe 33 3D Landmark Tracking, Trigonometric Form Checking,
 * and Anti-Cheating Repetition Validation.
 */

export interface Landmark3D {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface RepetitionFeedback {
  totalReps: number;
  validReps: number;
  currentStage: 'UP' | 'DOWN' | 'UNKNOWN';
  formFeedback: string;
  isCurrentRepValid: boolean;
  jointAngle: number;
  secondaryAngle?: number;
}

export interface JumpMetric {
  baselineHeight: number;
  maxDisplacementNormalized: number;
  estimatedJumpCm: number;
  isJumping: boolean;
  flightTimeMs: number;
}

export interface ShuttleMetric {
  completedSplits: number;
  currentDirection: 'LEFT' | 'RIGHT';
  splitTimesMs: number[];
  isBoundaryCrossed: boolean;
}

// MediaPipe Landmark Index Mapping
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
} as const;

export class PoseAnalyzer {
  // Squat State
  private squatStage: 'UP' | 'DOWN' = 'UP';
  private squatTotalReps = 0;
  private squatValidReps = 0;
  private squatMinAngleReached = 180;
  private squatFormFault = false;

  // Pushup State
  private pushupStage: 'UP' | 'DOWN' = 'UP';
  private pushupTotalReps = 0;
  private pushupValidReps = 0;
  private pushupMinElbowAngle = 180;
  private pushupFormFault = false;

  // Vertical Jump State
  private standingHipYBaseline: number | null = null;
  private standingTorsoLengthPx: number | null = null;
  private jumpApexDisplacement = 0;
  private jumpStartTime = 0;
  private isAirborne = false;
  private lastJumpCm = 0;

  // Shuttle Run State
  private shuttleSplits = 0;
  private shuttleDirection: 'LEFT' | 'RIGHT' = 'RIGHT';
  private shuttleLastCrossTimestamp = 0;
  private shuttleSplitDurations: number[] = [];

  // Athlete physical reference (used for accurate pixel-to-cm calibration)
  private athleteHeightCm: number;

  constructor(athleteHeightCm: number = 170) {
    this.athleteHeightCm = athleteHeightCm;
  }

  /**
   * Calculates the 3D interior angle formed by vectors BA and BC in degrees.
   * Vertex is at pointB.
   */
  public calculateAngle(pointA: Landmark3D, pointB: Landmark3D, pointC: Landmark3D): number {
    const vectorBA = {
      x: pointA.x - pointB.x,
      y: pointA.y - pointB.y,
      z: (pointA.z || 0) - (pointB.z || 0),
    };

    const vectorBC = {
      x: pointC.x - pointB.x,
      y: pointC.y - pointB.y,
      z: (pointC.z || 0) - (pointB.z || 0),
    };

    const dotProduct =
      vectorBA.x * vectorBC.x +
      vectorBA.y * vectorBC.y +
      vectorBA.z * vectorBC.z;

    const magBA = Math.sqrt(
      vectorBA.x * vectorBA.x + vectorBA.y * vectorBA.y + vectorBA.z * vectorBA.z
    );
    const magBC = Math.sqrt(
      vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y + vectorBC.z * vectorBC.z
    );

    if (magBA === 0 || magBC === 0) return 0;

    const cosine = Math.max(-1.0, Math.min(1.0, dotProduct / (magBA * magBC)));
    const radians = Math.acos(cosine);
    return Math.round((radians * 180) / Math.PI);
  }

  /**
   * Evaluates Squat execution.
   * Valid Rep: Knee flexion < 90° (hip below knee), return to extension > 160°.
   * Form check: Back/torso alignment (should not collapse excessively forward).
   */
  public analyzeSquat(landmarks: Landmark3D[]): RepetitionFeedback {
    const hip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const knee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const ankle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const shoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];

    const kneeAngle = this.calculateAngle(hip, knee, ankle);
    const backAngle = this.calculateAngle(shoulder, hip, knee);

    let formFeedback = 'Maintain proper depth';

    // Track minimum knee angle during current repetition descent
    if (this.squatStage === 'DOWN') {
      this.squatMinAngleReached = Math.min(this.squatMinAngleReached, kneeAngle);
      // Check excessive forward lean (backAngle collapsing < 50 deg)
      if (backAngle < 55) {
        this.squatFormFault = true;
        formFeedback = 'Keep chest upright, avoid hunching!';
      }
    }

    // State Transition: Standing -> Squat Descent
    if (kneeAngle < 90 && this.squatStage === 'UP') {
      this.squatStage = 'DOWN';
      this.squatMinAngleReached = kneeAngle;
      this.squatFormFault = false;
      formFeedback = 'Good depth, now push up!';
    }

    // State Transition: Squat Descent -> Return to Standing
    if (kneeAngle > 160 && this.squatStage === 'DOWN') {
      this.squatStage = 'UP';
      this.squatTotalReps += 1;

      // Verification check: Must have reached deep squat (< 95 deg) and no severe form fault
      if (this.squatMinAngleReached <= 95 && !this.squatFormFault) {
        this.squatValidReps += 1;
        formFeedback = 'Excellent valid rep!';
      } else {
        formFeedback = this.squatMinAngleReached > 95
          ? 'Rep rejected: Insufficient depth (thighs must reach parallel)'
          : 'Rep rejected: Form breakdown (excessive trunk lean)';
      }
    }

    return {
      totalReps: this.squatTotalReps,
      validReps: this.squatValidReps,
      currentStage: this.squatStage,
      formFeedback,
      isCurrentRepValid: !this.squatFormFault,
      jointAngle: kneeAngle,
      secondaryAngle: backAngle,
    };
  }

  /**
   * Evaluates Push-up execution.
   * Valid Rep: Elbow flexion < 90° (chest to floor) and extension > 160°.
   * Strict anti-cheat: Collinearity of Shoulder, Hip, Ankle (160° - 180°).
   * Rejects reps with sagging hips or piking.
   */
  public analyzePushup(landmarks: Landmark3D[]): RepetitionFeedback {
    const shoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const elbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
    const wrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
    const hip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const ankle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];

    const elbowAngle = this.calculateAngle(shoulder, elbow, wrist);
    const bodyAlignmentAngle = this.calculateAngle(shoulder, hip, ankle);

    let formFeedback = 'Lower chest to 90 degrees';

    // Back alignment check (collinearity range: 155° to 185°)
    const hasBackFault = bodyAlignmentAngle < 155 || bodyAlignmentAngle > 195;

    if (this.pushupStage === 'DOWN') {
      this.pushupMinElbowAngle = Math.min(this.pushupMinElbowAngle, elbowAngle);
      if (hasBackFault) {
        this.pushupFormFault = true;
        formFeedback = 'Warning: Keep your body straight! Avoid hip sagging or piking.';
      }
    }

    // State Transition: Top plank -> Bottom chest touch
    if (elbowAngle < 90 && this.pushupStage === 'UP') {
      this.pushupStage = 'DOWN';
      this.pushupMinElbowAngle = elbowAngle;
      this.pushupFormFault = hasBackFault;
      formFeedback = 'Good depth, push up!';
    }

    // State Transition: Push back to plank lock-out
    if (elbowAngle > 160 && this.pushupStage === 'DOWN') {
      this.pushupStage = 'UP';
      this.pushupTotalReps += 1;

      if (this.pushupMinElbowAngle <= 95 && !this.pushupFormFault) {
        this.pushupValidReps += 1;
        formFeedback = 'Rep counted! Clean execution.';
      } else {
        formFeedback = this.pushupMinElbowAngle > 95
          ? 'Rep rejected: Did not lower fully to 90°.'
          : 'Rep rejected: Disqualified due to hip sag/pike.';
      }
    }

    return {
      totalReps: this.pushupTotalReps,
      validReps: this.pushupValidReps,
      currentStage: this.pushupStage,
      formFeedback,
      isCurrentRepValid: !this.pushupFormFault,
      jointAngle: elbowAngle,
      secondaryAngle: bodyAlignmentAngle,
    };
  }

  /**
   * Vertical Jump Measurement (Power & Explosiveness)
   * Tracks vertical hip displacement (landmarks 23 & 24) over calibrated standing baseline.
   * Calibrates pixel-to-cm ratio dynamically using standing ankle-to-shoulder ratio.
   */
  public analyzeVerticalJump(landmarks: Landmark3D[], timestampMs: number): JumpMetric {
    const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];

    const currentMidHipY = (leftHip.y + rightHip.y) / 2;

    // Establish standing baseline on initialization or grounded state
    if (this.standingHipYBaseline === null) {
      this.standingHipYBaseline = currentMidHipY;
      const standingHeightPx = Math.abs(leftAnkle.y - leftShoulder.y);
      this.standingTorsoLengthPx = standingHeightPx;
      return {
        baselineHeight: this.standingHipYBaseline,
        maxDisplacementNormalized: 0,
        estimatedJumpCm: 0,
        isJumping: false,
        flightTimeMs: 0,
      };
    }

    // In MediaPipe normalized coordinates, y=0 is top, y=1 is bottom.
    // Jumping upward causes currentMidHipY to decrease relative to baseline.
    const verticalDisplacementNormalized = this.standingHipYBaseline - currentMidHipY;

    // Threshold for jump takeoff (upward displacement > 4% of frame)
    const JUMP_TAKEOFF_THRESHOLD = 0.04;

    if (verticalDisplacementNormalized > JUMP_TAKEOFF_THRESHOLD) {
      if (!this.isAirborne) {
        this.isAirborne = true;
        this.jumpStartTime = timestampMs;
        this.jumpApexDisplacement = verticalDisplacementNormalized;
      } else {
        // Track apex
        this.jumpApexDisplacement = Math.max(
          this.jumpApexDisplacement,
          verticalDisplacementNormalized
        );
      }
    } else if (this.isAirborne && verticalDisplacementNormalized <= 0.02) {
      // Landing detected
      this.isAirborne = false;
      const flightDuration = timestampMs - this.jumpStartTime;

      // Calculate jump height using both displacement scaling & kinematic ballistic formula
      // h = 1/2 * g * (t/2)^2
      const timeBasedHeightCm = (0.5 * 980.665 * Math.pow(flightDuration / 2000, 2));

      // Pixel-ratio calibrated jump height
      const torsoRatio = (this.standingTorsoLengthPx && this.standingTorsoLengthPx > 0)
        ? (this.jumpApexDisplacement / this.standingTorsoLengthPx)
        : 0;
      const pixelCalibratedHeightCm = torsoRatio * (this.athleteHeightCm * 0.55);

      // Weighted fusion for robustness against camera perspective distortion
      this.lastJumpCm = Math.round(
        timeBasedHeightCm > 10 && timeBasedHeightCm < 150
          ? (timeBasedHeightCm * 0.6 + pixelCalibratedHeightCm * 0.4)
          : pixelCalibratedHeightCm
      );
    }

    return {
      baselineHeight: this.standingHipYBaseline,
      maxDisplacementNormalized: Math.max(0, this.jumpApexDisplacement),
      estimatedJumpCm: this.lastJumpCm,
      isJumping: this.isAirborne,
      flightTimeMs: this.isAirborne ? timestampMs - this.jumpStartTime : 0,
    };
  }

  /**
   * Shuttle Run (4x10m Agility Test)
   * Tracks bounding box / ankle crossing beyond lateral bounds.
   */
  public analyzeShuttleRun(
    landmarks: Landmark3D[],
    timestampMs: number,
    leftBoundaryX: number = 0.2,
    rightBoundaryX: number = 0.8
  ): ShuttleMetric {
    const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const rightAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];
    const midAnkleX = (leftAnkle.x + rightAnkle.x) / 2;

    let isCrossed = false;
    const cooldownMs = 1500; // Prevent duplicate triggers on immediate turn

    if (
      this.shuttleDirection === 'RIGHT' &&
      midAnkleX > rightBoundaryX &&
      timestampMs - this.shuttleLastCrossTimestamp > cooldownMs
    ) {
      this.shuttleSplits += 1;
      this.shuttleDirection = 'LEFT';
      const splitTime = this.shuttleLastCrossTimestamp > 0
        ? timestampMs - this.shuttleLastCrossTimestamp
        : 0;
      this.shuttleSplitDurations.push(splitTime);
      this.shuttleLastCrossTimestamp = timestampMs;
      isCrossed = true;
    } else if (
      this.shuttleDirection === 'LEFT' &&
      midAnkleX < leftBoundaryX &&
      timestampMs - this.shuttleLastCrossTimestamp > cooldownMs
    ) {
      this.shuttleSplits += 1;
      this.shuttleDirection = 'RIGHT';
      const splitTime = timestampMs - this.shuttleLastCrossTimestamp;
      this.shuttleSplitDurations.push(splitTime);
      this.shuttleLastCrossTimestamp = timestampMs;
      isCrossed = true;
    }

    return {
      completedSplits: this.shuttleSplits,
      currentDirection: this.shuttleDirection,
      splitTimesMs: this.shuttleSplitDurations,
      isBoundaryCrossed: isCrossed,
    };
  }

  /**
   * Resets all internal counters for a new workout session.
   */
  public reset(): void {
    this.squatStage = 'UP';
    this.squatTotalReps = 0;
    this.squatValidReps = 0;
    this.squatMinAngleReached = 180;
    this.squatFormFault = false;

    this.pushupStage = 'UP';
    this.pushupTotalReps = 0;
    this.pushupValidReps = 0;
    this.pushupMinElbowAngle = 180;
    this.pushupFormFault = false;

    this.standingHipYBaseline = null;
    this.jumpApexDisplacement = 0;
    this.isAirborne = false;
    this.lastJumpCm = 0;

    this.shuttleSplits = 0;
    this.shuttleDirection = 'RIGHT';
    this.shuttleLastCrossTimestamp = 0;
    this.shuttleSplitDurations = [];
  }
}
