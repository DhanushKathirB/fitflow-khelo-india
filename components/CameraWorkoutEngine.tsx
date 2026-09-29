"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  Play,
  Square,
  RefreshCw,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Award,
  Video,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  QrCode,
  HeartPulse,
  CheckCircle2,
  Settings,
  HelpCircle
} from 'lucide-react';
import { PoseAnalyzer, Landmark3D, POSE_LANDMARKS } from '@/lib/vision/poseAnalyzer';
import { globalVoiceCoach } from '@/lib/audio/voiceCoach';
import { AsymmetryDetector, AsymmetryReport } from '@/lib/vision/asymmetryDetector';
import TalentPassportModal from '@/components/TalentPassportModal';
import AnatomicalFigureSimulator from '@/components/AnatomicalFigureSimulator';

type ExerciseType = 'pushup' | 'squat' | 'vertical_jump' | 'shuttle_run';

export default function CameraWorkoutEngine() {
  const [exercise, setExercise] = useState<ExerciseType>('pushup');
  const [isExercising, setIsExercising] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [simMode, setSimMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [poseReady, setPoseReady] = useState<boolean>(false);
  const [isDetectingPerson, setIsDetectingPerson] = useState<boolean>(false);

  // Stats from PoseAnalyzer
  const [validReps, setValidReps] = useState<number>(0);
  const [totalReps, setTotalReps] = useState<number>(0);
  const [currentAngle, setCurrentAngle] = useState<number>(180);
  const [formFeedback, setFormFeedback] = useState<string>('Stand in front of camera to begin');
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [jumpHeightCm, setJumpHeightCm] = useState<number>(0);
  const [shuttleSplits, setShuttleSplits] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Biomechanical Asymmetry Report
  const [asymmetryReport, setAsymmetryReport] = useState<AsymmetryReport | null>(null);

  // Passport Modal State
  const [showPassport, setShowPassport] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyzerRef = useRef<PoseAnalyzer>(new PoseAnalyzer(172));
  const asymmetryDetectorRef = useRef<AsymmetryDetector>(new AsymmetryDetector());
  const poseRef = useRef<any>(null);
  const simTimerRef = useRef<NodeJS.Timeout | null>(null);
  const workoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevValidRepsRef = useRef<number>(0);
  const activeStreamRef = useRef<MediaStream | null>(null);

  // Toggle Voice Coach
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    globalVoiceCoach.setMuted(nextMuted);
  };

  // Initialize or reset analyzer
  const handleReset = useCallback(() => {
    analyzerRef.current.reset();
    setValidReps(0);
    setTotalReps(0);
    setCurrentAngle(180);
    setJumpHeightCm(0);
    setShuttleSplits(0);
    setElapsedSeconds(0);
    setVerificationResult(null);
    setAsymmetryReport(null);
    prevValidRepsRef.current = 0;
    setFormFeedback('Ready for test. Position full body in frame.');
  }, []);

  // Timer
  useEffect(() => {
    if (isExercising) {
      globalVoiceCoach.playWhistle();
      globalVoiceCoach.speak('Test started! Maintain full depth.', true);
      workoutTimerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          if (next === 30) globalVoiceCoach.speak('Halfway mark! Keep the cadence up.');
          if (next === 50) globalVoiceCoach.speak('Ten seconds left! Final push.');
          return next;
        });
      }, 1000);
    } else {
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
    }
    return () => {
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
    };
  }, [isExercising]);

  // Audio Voice trigger when valid reps increment
  useEffect(() => {
    if (validReps > prevValidRepsRef.current && isExercising) {
      globalVoiceCoach.playRepSuccessChime();
      globalVoiceCoach.speak(`${validReps}`, true);
      prevValidRepsRef.current = validReps;
    }
  }, [validReps, isExercising]);

  // Enumerate cameras on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoInputs = devices.filter((d) => d.kind === 'videoinput');
          setAvailableDevices(videoInputs);
          if (videoInputs.length > 0 && !selectedDeviceId) {
            setSelectedDeviceId(videoInputs[0].deviceId);
          }
        })
        .catch((err) => console.warn('Device enumeration error:', err));
    }
  }, [selectedDeviceId]);

  // Initialize MediaPipe Pose in browser
  useEffect(() => {
    let isMounted = true;

    const initMediaPipe = async () => {
      if (typeof window === 'undefined') return;
      try {
        const { Pose } = await import('@mediapipe/pose');
        if (!isMounted) return;

        const pose = new Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        pose.onResults((results: any) => {
          if (!isMounted) return;
          if (results.poseLandmarks && results.poseLandmarks.length > 0) {
            setIsDetectingPerson(true);
            handleRealPoseResults(results.poseLandmarks);
          } else {
            setIsDetectingPerson(false);
          }
        });

        poseRef.current = pose;
        setPoseReady(true);
      } catch (err) {
        console.warn('MediaPipe Pose library loader notice:', err);
      }
    };

    initMediaPipe();

    return () => {
      isMounted = false;
      if (poseRef.current) {
        try {
          poseRef.current.close();
        } catch (e) {}
        poseRef.current = null;
      }
    };
  }, []);

  // Draw simulated or real skeletal overlay on canvas
  const drawSkeleton = useCallback(
    (landmarks: Landmark3D[], angleText: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (simMode) {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      // Landmarks dots
      landmarks.forEach((pt, index) => {
        const px = pt.x * canvas.width;
        const py = pt.y * canvas.height;

        ctx.beginPath();
        ctx.arc(px, py, 5, 0, 2 * Math.PI);
        ctx.fillStyle =
          index === POSE_LANDMARKS.LEFT_ELBOW || index === POSE_LANDMARKS.LEFT_KNEE
            ? '#f97316'
            : '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Connections
      const connect = (idxA: number, idxB: number, color = '#38bdf8') => {
        const pA = landmarks[idxA];
        const pB = landmarks[idxB];
        if (!pA || !pB) return;
        ctx.beginPath();
        ctx.moveTo(pA.x * canvas.width, pA.y * canvas.height);
        ctx.lineTo(pB.x * canvas.width, pB.y * canvas.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
      };

      connect(POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER, '#38bdf8');
      connect(POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW, '#f97316');
      connect(POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST, '#f97316');
      connect(POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW, '#f97316');
      connect(POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST, '#f97316');

      connect(POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP, '#10b981');
      connect(POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP, '#10b981');
      connect(POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP, '#10b981');

      connect(POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE, '#f59e0b');
      connect(POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE, '#f59e0b');
      connect(POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE, '#f59e0b');
      connect(POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE, '#f59e0b');

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(angleText, 20, 35);
    },
    [simMode]
  );

  // Process live real landmarks from MediaPipe
  const handleRealPoseResults = useCallback(
    (landmarksRaw: any[]) => {
      const landmarks: Landmark3D[] = landmarksRaw.map((lm) => ({
        x: lm.x,
        y: lm.y,
        z: lm.z || 0,
        visibility: lm.visibility,
      }));

      if (exercise === 'pushup') {
        const feedback = analyzerRef.current.analyzePushup(landmarks);
        setValidReps(feedback.validReps);
        setTotalReps(feedback.totalReps);
        setCurrentAngle(feedback.jointAngle);
        setFormFeedback(feedback.formFeedback);
        setIsFormValid(feedback.isCurrentRepValid);

        const asym = asymmetryDetectorRef.current.analyzePushupKinematics(
          landmarks,
          (a, b, c) => analyzerRef.current.calculateAngle(a, b, c)
        );
        setAsymmetryReport(asym);
        drawSkeleton(landmarks, `Elbow: ${feedback.jointAngle}° | Reps: ${feedback.validReps}`);
      } else if (exercise === 'squat') {
        const feedback = analyzerRef.current.analyzeSquat(landmarks);
        setValidReps(feedback.validReps);
        setTotalReps(feedback.totalReps);
        setCurrentAngle(feedback.jointAngle);
        setFormFeedback(feedback.formFeedback);
        setIsFormValid(feedback.isCurrentRepValid);

        const asym = asymmetryDetectorRef.current.analyzeSquatKinematics(
          landmarks,
          (a, b, c) => analyzerRef.current.calculateAngle(a, b, c)
        );
        setAsymmetryReport(asym);
        drawSkeleton(landmarks, `Knee: ${feedback.jointAngle}° | Reps: ${feedback.validReps}`);
      } else if (exercise === 'vertical_jump') {
        const jumpMetric = analyzerRef.current.analyzeVerticalJump(landmarks, Date.now());
        setJumpHeightCm(jumpMetric.estimatedJumpCm);
        setCurrentAngle(Math.round(jumpMetric.maxDisplacementNormalized * 100));
        setFormFeedback(jumpMetric.isJumping ? 'AIRBORNE! Tracking apex...' : 'Explode upward on the whistle!');
        drawSkeleton(landmarks, `Jump: ${jumpMetric.estimatedJumpCm} cm | Flight: ${jumpMetric.flightTimeMs}ms`);
      } else if (exercise === 'shuttle_run') {
        const shuttleMetric = analyzerRef.current.analyzeShuttleRun(landmarks, Date.now());
        setShuttleSplits(shuttleMetric.completedSplits);
        setFormFeedback(`Direction: ${shuttleMetric.currentDirection} | Splits: ${shuttleMetric.completedSplits}/4`);
        drawSkeleton(landmarks, `Splits: ${shuttleMetric.completedSplits}/4 | Boundary Crossing`);
      }
    },
    [exercise, drawSkeleton]
  );

  // Progressive resilient camera starter
  const startCamera = async (targetDeviceId?: string) => {
    setCameraError(null);
    setSimMode(false);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraError('Webcam API is unavailable. Ensure you are on https:// or http://localhost:3000.');
      return;
    }

    // Stop any existing tracks
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((t) => t.stop());
      activeStreamRef.current = null;
    }

    const deviceConstraint = targetDeviceId || selectedDeviceId;

    // Ordered list of fallback constraints from specific to generic
    const constraintAttempts: MediaStreamConstraints[] = [
      deviceConstraint
        ? { video: { deviceId: { exact: deviceConstraint }, width: { ideal: 640 }, height: { ideal: 480 } } }
        : { video: { width: { ideal: 640 }, height: { ideal: 480 } } },
      { video: { width: { ideal: 640 }, height: { ideal: 480 } } },
      { video: true },
    ];

    let stream: MediaStream | null = null;
    let lastErr: any = null;

    for (const constraints of constraintAttempts) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (stream) break;
      } catch (err: any) {
        lastErr = err;
      }
    }

    if (!stream) {
      console.warn('All webcam constraint attempts failed:', lastErr);
      const isDenied =
        lastErr?.name === 'NotAllowedError' ||
        lastErr?.name === 'PermissionDeniedError' ||
        lastErr?.message?.includes('Permission');
      const isNotFound =
        lastErr?.name === 'NotFoundError' || lastErr?.name === 'DevicesNotFoundError';
      const isBusy = lastErr?.name === 'NotReadableError' || lastErr?.name === 'TrackStartError';

      const errorMsg = isDenied
        ? 'Camera permission denied. Please allow camera permissions in your browser URL bar (look for the camera/padlock icon).'
        : isNotFound
        ? 'No webcam detected on this device. Plug in a camera or use AI Simulation mode.'
        : isBusy
        ? 'Camera is in use by another application (e.g. Zoom, Google Meet). Please close other camera apps and retry.'
        : `Could not start webcam: ${lastErr?.name || lastErr?.message || 'Device constraint error'}.`;

      setCameraError(errorMsg);
      setFormFeedback(errorMsg);
      return;
    }

    activeStreamRef.current = stream;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch((playErr) => {
          console.warn('Video play was delayed, waiting for user gesture:', playErr);
        });
      };
      setIsCameraActive(true);
      setCameraError(null);
      setFormFeedback('Camera live! Position your full body in view.');
    }
  };

  const stopCamera = () => {
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => track.stop());
      activeStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsExercising(false);
    if (simTimerRef.current) clearInterval(simTimerRef.current);
  };

  // Video Frame Loop for Real Camera
  useEffect(() => {
    if (!isCameraActive || simMode) return;

    let animId: number;
    let isProcessing = false;

    const processFrame = async () => {
      const video = videoRef.current;
      if (video && video.readyState >= 2 && !video.paused) {
        if (poseRef.current && !isProcessing) {
          isProcessing = true;
          try {
            await poseRef.current.send({ image: video });
          } catch (e) {
            // Frame skip
          } finally {
            isProcessing = false;
          }
        }
      }
      animId = requestAnimationFrame(processFrame);
    };

    animId = requestAnimationFrame(processFrame);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isCameraActive, simMode, handleRealPoseResults]);

  // Simulation mode loop
  useEffect(() => {
    if (!isExercising || !simMode) return;

    let simCycle = 0;
    const interval = setInterval(() => {
      simCycle += 0.08;
      const t = simCycle;
      const mockLandmarks: Landmark3D[] = Array(33).fill(null).map(() => ({ x: 0.5, y: 0.5, z: 0 }));

      if (exercise === 'squat') {
        const flexionFactor = (Math.sin(t) + 1) / 2;
        const kneeY = 0.65;
        const hipY = 0.45 + flexionFactor * 0.18;

        mockLandmarks[POSE_LANDMARKS.LEFT_SHOULDER] = { x: 0.48, y: 0.25 + flexionFactor * 0.12, z: 0 };
        mockLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER] = { x: 0.52, y: 0.25 + flexionFactor * 0.12, z: 0 };
        mockLandmarks[POSE_LANDMARKS.LEFT_HIP] = { x: 0.47, y: hipY, z: 0 };
        mockLandmarks[POSE_LANDMARKS.RIGHT_HIP] = { x: 0.53, y: hipY, z: 0 };
        mockLandmarks[POSE_LANDMARKS.LEFT_KNEE] = { x: 0.47, y: kneeY, z: 0 };
        mockLandmarks[POSE_LANDMARKS.RIGHT_KNEE] = { x: 0.53, y: kneeY, z: 0 };
        mockLandmarks[POSE_LANDMARKS.LEFT_ANKLE] = { x: 0.46, y: 0.85, z: 0 };
        mockLandmarks[POSE_LANDMARKS.RIGHT_ANKLE] = { x: 0.54, y: 0.85, z: 0 };

        const feedback = analyzerRef.current.analyzeSquat(mockLandmarks);
        setValidReps(feedback.validReps);
        setTotalReps(feedback.totalReps);
        setCurrentAngle(feedback.jointAngle);
        setFormFeedback(feedback.formFeedback);
        setIsFormValid(feedback.isCurrentRepValid);

        const asym = asymmetryDetectorRef.current.analyzeSquatKinematics(
          mockLandmarks,
          (a, b, c) => analyzerRef.current.calculateAngle(a, b, c)
        );
        setAsymmetryReport(asym);
        drawSkeleton(mockLandmarks, `Knee: ${feedback.jointAngle}° | Symmetry: ${asym.symmetryScorePct}%`);
      } else if (exercise === 'pushup') {
        const flexionFactor = (Math.sin(t) + 1) / 2;
        const chestY = 0.5 + flexionFactor * 0.12;

        mockLandmarks[POSE_LANDMARKS.LEFT_SHOULDER] = { x: 0.35, y: chestY, z: 0 };
        mockLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER] = { x: 0.37, y: chestY, z: 0 };
        mockLandmarks[POSE_LANDMARKS.LEFT_ELBOW] = { x: 0.32, y: chestY - 0.06 * flexionFactor, z: 0 };
        mockLandmarks[POSE_LANDMARKS.RIGHT_ELBOW] = { x: 0.34, y: chestY - 0.06 * flexionFactor, z: 0 };
        mockLandmarks[POSE_LANDMARKS.LEFT_WRIST] = { x: 0.35, y: 0.68, z: 0 };
        mockLandmarks[POSE_LANDMARKS.RIGHT_WRIST] = { x: 0.37, y: 0.68, z: 0 };
        mockLandmarks[POSE_LANDMARKS.LEFT_HIP] = { x: 0.55, y: chestY + 0.02, z: 0 };
        mockLandmarks[POSE_LANDMARKS.RIGHT_HIP] = { x: 0.57, y: chestY + 0.02, z: 0 };
        mockLandmarks[POSE_LANDMARKS.LEFT_ANKLE] = { x: 0.82, y: 0.68, z: 0 };
        mockLandmarks[POSE_LANDMARKS.RIGHT_ANKLE] = { x: 0.84, y: 0.68, z: 0 };

        const feedback = analyzerRef.current.analyzePushup(mockLandmarks);
        setValidReps(feedback.validReps);
        setTotalReps(feedback.totalReps);
        setCurrentAngle(feedback.jointAngle);
        setFormFeedback(feedback.formFeedback);
        setIsFormValid(feedback.isCurrentRepValid);

        const asym = asymmetryDetectorRef.current.analyzePushupKinematics(
          mockLandmarks,
          (a, b, c) => analyzerRef.current.calculateAngle(a, b, c)
        );
        setAsymmetryReport(asym);
        drawSkeleton(mockLandmarks, `Elbow: ${feedback.jointAngle}° | Symmetry: ${asym.symmetryScorePct}%`);
      } else if (exercise === 'vertical_jump') {
        const jumpDisplacement = Math.max(0, Math.sin(t * 1.5)) * 0.18;
        mockLandmarks[POSE_LANDMARKS.LEFT_SHOULDER] = { x: 0.5, y: 0.35 - jumpDisplacement, z: 0 };
        mockLandmarks[POSE_LANDMARKS.LEFT_HIP] = { x: 0.5, y: 0.55 - jumpDisplacement, z: 0 };
        mockLandmarks[POSE_LANDMARKS.RIGHT_HIP] = { x: 0.52, y: 0.55 - jumpDisplacement, z: 0 };
        mockLandmarks[POSE_LANDMARKS.LEFT_ANKLE] = { x: 0.5, y: 0.85 - jumpDisplacement, z: 0 };

        const jumpMetric = analyzerRef.current.analyzeVerticalJump(mockLandmarks, Date.now());
        setJumpHeightCm(jumpMetric.estimatedJumpCm);
        setCurrentAngle(Math.round(jumpMetric.maxDisplacementNormalized * 100));
        setFormFeedback(jumpMetric.isJumping ? 'AIRBORNE! Tracking apex...' : 'Explode upward on the whistle!');
        drawSkeleton(mockLandmarks, `Jump: ${jumpMetric.estimatedJumpCm} cm | Flight: ${jumpMetric.flightTimeMs}ms`);
      } else if (exercise === 'shuttle_run') {
        const posX = 0.5 + Math.sin(t * 0.8) * 0.38;
        mockLandmarks[POSE_LANDMARKS.LEFT_ANKLE] = { x: posX - 0.02, y: 0.85, z: 0 };
        mockLandmarks[POSE_LANDMARKS.RIGHT_ANKLE] = { x: posX + 0.02, y: 0.85, z: 0 };
        mockLandmarks[POSE_LANDMARKS.LEFT_SHOULDER] = { x: posX, y: 0.35, z: 0 };

        const shuttleMetric = analyzerRef.current.analyzeShuttleRun(mockLandmarks, Date.now());
        setShuttleSplits(shuttleMetric.completedSplits);
        setFormFeedback(`Direction: ${shuttleMetric.currentDirection} | Splits: ${shuttleMetric.completedSplits}/4`);
        drawSkeleton(mockLandmarks, `Splits: ${shuttleMetric.completedSplits} | X-Pos: ${Math.round(posX * 100)}%`);
      }
    }, 60);

    simTimerRef.current = interval;
    return () => clearInterval(interval);
  }, [isExercising, simMode, exercise, drawSkeleton]);

  // Submit test to verification API
  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/assessments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteId: 'ATH-LIVE-USER-01',
          age: 17,
          gender: 'M',
          exerciseType: exercise,
          rawScore:
            exercise === 'vertical_jump'
              ? jumpHeightCm
              : exercise === 'shuttle_run'
              ? shuttleSplits
              : validReps,
          validReps,
          totalReps: totalReps || validReps,
          durationSeconds: Math.max(1, elapsedSeconds),
          hasSensorTelemetry: true,
          sensorHeartRateDelta: 34,
        }),
      });

      const data = await response.json();
      setVerificationResult(data);
      globalVoiceCoach.speak('Assessment Certified! Official Khelo India verification signature issued.', true);
    } catch (err) {
      console.error('Error submitting assessment', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-100">
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase">
              MediaPipe 3D Pose
            </span>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Anti-Cheat Form Engine
            </span>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase flex items-center gap-1">
              <HeartPulse className="w-3 h-3" /> Kinematic Asymmetry AI
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            Real-Time AI Camera Biomechanics
          </h2>
          <p className="text-xs text-slate-400">
            Calculates 3D joint angles, voice coaches rep counts, and alerts against bilateral asymmetry.
          </p>
        </div>

        {/* Audio Coach Mute Toggle + Exercise Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg border text-xs font-bold transition-colors flex items-center gap-1.5 ${
              isMuted
                ? 'bg-slate-800 border-slate-700 text-slate-400'
                : 'bg-orange-500/20 border-orange-500/40 text-orange-300'
            }`}
            title={isMuted ? 'Unmute Audio Coach' : 'Mute Audio Coach'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="text-[11px] hidden sm:inline">{isMuted ? 'Muted' : 'Audio Coach ON'}</span>
          </button>

          <div className="flex flex-wrap gap-1.5">
            {(['pushup', 'squat', 'vertical_jump', 'shuttle_run'] as ExerciseType[]).map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setExercise(ex);
                  handleReset();
                }}
                disabled={isExercising}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  exercise === ex
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {ex.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Camera Error Help Banner */}
      {cameraError && (
        <div className="bg-rose-950/70 border border-rose-500/50 p-4 rounded-xl text-xs text-rose-200 space-y-2 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>Camera Initialization Notice</span>
            </div>
            <button
              onClick={() => {
                setSimMode(true);
                setIsCameraActive(true);
                setCameraError(null);
              }}
              className="text-[11px] font-bold underline text-amber-300 hover:text-white"
            >
              Skip to AI Simulation &rarr;
            </button>
          </div>

          <p className="text-slate-300 leading-relaxed">{cameraError}</p>

          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
              Browser Permission Quick Fix:
            </div>
            <div>1. Click the <span className="text-white font-semibold">Camera / Lock</span> icon on the left side of your browser URL bar.</div>
            <div>2. Change Camera permission to <span className="text-emerald-400 font-bold">Allow</span>.</div>
            <div>3. Click the <span className="text-orange-400 font-semibold">Retry Camera Feed</span> button below.</div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => startCamera()}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-xs transition-all shadow-md"
            >
              Retry Camera Feed
            </button>
            <button
              onClick={() => {
                setSimMode(true);
                setIsCameraActive(true);
                setCameraError(null);
                setFormFeedback('AI Kinematic Simulation active.');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs transition-all"
            >
              Launch AI Kinematic Simulation
            </button>
          </div>
        </div>
      )}

      {/* Main Vision Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Video / Skeleton Canvas Feed OR Anatomical Figure Simulator */}
        <div className="lg:col-span-8 flex flex-col">
          {isCameraActive && simMode ? (
            <AnatomicalFigureSimulator
              exercise={exercise}
              currentAngle={currentAngle}
              validReps={validReps}
              totalReps={totalReps}
              formFeedback={formFeedback}
              isFormValid={isFormValid}
              jumpHeightCm={jumpHeightCm}
              shuttleSplits={shuttleSplits}
            />
          ) : (
            <div className="relative aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
              {/* Live Camera Video (Mirrored for natural mirror-like athletic movement) */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
                  !isCameraActive || simMode ? 'hidden' : ''
                }`}
              />

              {/* Biometric Skeleton Overlay Canvas (mirrored identically to align with video) */}
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className={`absolute inset-0 w-full h-full object-contain pointer-events-none z-10 ${
                  !simMode ? 'transform -scale-x-100' : ''
                }`}
              />

              {!isCameraActive && (
                <div className="text-center p-6 z-20">
                  <Video className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
                  <h3 className="font-bold text-white text-base">Camera Inactive</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                    Connect your webcam for certified athletic form validation, or use AI Simulation mode to test with animated kinematics.
                  </p>

                  {availableDevices.length > 1 && (
                    <div className="mb-4 max-w-xs mx-auto text-left">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Select Camera Device:
                      </label>
                      <select
                        value={selectedDeviceId}
                        onChange={(e) => setSelectedDeviceId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none"
                      >
                        {availableDevices.map((d, i) => (
                          <option key={d.deviceId || i} value={d.deviceId}>
                            {d.label || `Camera ${i + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => startCamera()}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-xs flex items-center gap-2 transition-all shadow-md shadow-orange-600/20"
                    >
                      <Camera className="w-4 h-4" /> Start Webcam
                    </button>
                    <button
                      onClick={() => {
                        setSimMode(true);
                        setIsCameraActive(true);
                        setCameraError(null);
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs flex items-center gap-2 transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" /> Launch 3D Muscle Simulator
                    </button>
                  </div>
                </div>
              )}

              {/* In-Frame Live Rep / Angle Overlay */}
              {isCameraActive && (
                <div className="absolute top-3 left-3 z-30 flex flex-col gap-2">
                  <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 shadow-lg">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Joint Angle</span>
                    <div className="text-lg font-black text-white">{currentAngle}°</div>
                  </div>

                  <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 shadow-lg">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Elapsed</span>
                    <div className="text-sm font-bold text-amber-400">{elapsedSeconds}s</div>
                  </div>

                  {!simMode && (
                    <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/60 flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isDetectingPerson ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
                        }`}
                      />
                      <span className="text-[10px] font-bold text-slate-300">
                        {isDetectingPerson ? 'Athlete Locked' : 'Searching Body'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Form Guidance Toast Banner */}
              {isCameraActive && (
                <div
                  className={`absolute bottom-3 left-3 right-3 z-30 px-3.5 py-2 rounded-lg text-xs font-semibold backdrop-blur-md border flex items-center justify-between transition-colors ${
                    isFormValid
                      ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isFormValid ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{formFeedback}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {simMode ? 'AI Kinematic Generator' : 'MediaPipe Vision Live'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <div className="flex items-center gap-2.5">
              {!isExercising ? (
                <button
                  onClick={() => {
                    if (!isCameraActive) startCamera();
                    setIsExercising(true);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" /> Start Exercise Session
                </button>
              ) : (
                <button
                  onClick={() => setIsExercising(false)}
                  className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
                >
                  <Square className="w-4 h-4 fill-white" /> Pause Workout
                </button>
              )}

              <button
                onClick={handleReset}
                className="px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>

              {isCameraActive && (
                <button
                  onClick={stopCamera}
                  className="px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 text-xs font-semibold transition-colors"
                >
                  Stop Camera
                </button>
              )}

              {/* Mode Switcher */}
              <button
                onClick={() => {
                  if (simMode) {
                    startCamera();
                  } else {
                    stopCamera();
                    setSimMode(true);
                    setIsCameraActive(true);
                  }
                }}
                className="px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700 shadow-sm"
                title="Switch between Live Webcam and 3D Anatomical Muscle Simulator"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{simMode ? 'Switch to Live Webcam' : 'Switch to 3D Muscle Simulator'}</span>
              </button>
            </div>

            <button
              onClick={handleSubmitAssessment}
              disabled={isSubmitting || (validReps === 0 && jumpHeightCm === 0 && shuttleSplits === 0)}
              className="px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-orange-600/20"
            >
              <Award className="w-4 h-4" />
              {isSubmitting ? 'Verifying...' : 'Certify & Submit Score'}
            </button>
          </div>
        </div>

        {/* Right: Live Biometric HUD & Asymmetry Report */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Rep Counter Metric Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg">
            <span className="text-xs uppercase font-extrabold text-orange-400 tracking-wider">
              {exercise === 'vertical_jump'
                ? 'Power & Apex Height'
                : exercise === 'shuttle_run'
                ? 'Agility Splits'
                : 'Repetition Verification'}
            </span>

            {exercise === 'vertical_jump' ? (
              <div className="mt-3">
                <div className="text-4xl font-black text-white">
                  {jumpHeightCm} <span className="text-lg font-normal text-slate-400">cm</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">Calibrated from standing baseline</div>
              </div>
            ) : exercise === 'shuttle_run' ? (
              <div className="mt-3">
                <div className="text-4xl font-black text-white">
                  {shuttleSplits} <span className="text-lg font-normal text-slate-400">/ 4 splits</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">4x10m boundary turnaround crossing</div>
              </div>
            ) : (
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <div className="text-4xl font-black text-emerald-400">{validReps}</div>
                  <div className="text-xs text-slate-400">Valid Reps</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-500">{totalReps}</div>
                  <div className="text-xs text-slate-400">Total Attempts</div>
                </div>
              </div>
            )}

            {/* Form Accuracy Progress Bar */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">Form Accuracy Rate</span>
                <span className="font-bold text-white">
                  {totalReps > 0 ? Math.round((validReps / totalReps) * 100) : 100}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${totalReps > 0 ? Math.round((validReps / totalReps) * 100) : 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Real-Time Kinetic Asymmetry & Injury Risk Card */}
          {asymmetryReport && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-lg text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-blue-400" />
                  Bilateral Symmetry
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    asymmetryReport.injuryRiskTier === 'LOW'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {asymmetryReport.injuryRiskTier} INJURY RISK
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Kinetic Balance:</span>
                <span className="font-bold text-white">{asymmetryReport.symmetryScorePct}%</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Left vs Right Angle:</span>
                <span className="font-mono text-slate-400">
                  L: {asymmetryReport.leftAngleDeg}° | R: {asymmetryReport.rightAngleDeg}° (Δ
                  {asymmetryReport.bilateralDeltaDeg}°)
                </span>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                {asymmetryReport.clinicalFeedback}
              </p>
            </div>
          )}

          {/* Verification Certificate Result Card */}
          {verificationResult && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 shadow-lg text-xs animate-in fade-in space-y-3">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  SAI Khelo India Certified
                </span>
                <span className="text-[10px] font-mono text-emerald-300">
                  +{verificationResult.verification.ufpPointsAwarded} UFP
                </span>
              </div>

              <div className="space-y-1 text-slate-300">
                <div>
                  Status: <span className="font-bold text-white">{verificationResult.verification.status}</span>
                </div>
                <div>
                  Talent Tier:{' '}
                  <span className="font-bold text-amber-300">
                    {verificationResult.kheloIndiaEvaluation.talentTier}
                  </span>
                </div>
                <div>
                  Percentile:{' '}
                  <span className="font-bold text-white">
                    {verificationResult.kheloIndiaEvaluation.percentileRank}th
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowPassport(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                <QrCode className="w-3.5 h-3.5" />
                View Khelo India Talent Passport
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Talent Passport Modal */}
      <TalentPassportModal
        isOpen={showPassport}
        onClose={() => setShowPassport(false)}
        athlete={{
          id: 'ATH-LIVE-USER-01',
          kheloIndiaId: 'KI-2026-LIVE-001',
          name: 'Dhanush Kathir',
          age: 17,
          gender: 'M',
          state: 'Haryana',
          district: 'Bhiwani',
          institution: 'FitFlow National Training Center',
          compositeScore: verificationResult
            ? verificationResult.kheloIndiaEvaluation.compositeScore
            : 96.4,
          verificationStatus: 'Verified',
          isHighPotential: true,
          metrics: verificationResult
            ? verificationResult.kheloIndiaEvaluation.pillarScores
            : {
                upperBodyStrength: 96,
                coreStrength: 92,
                lowerBodyPower: 98,
                agility: 94,
                speed: 95,
              },
          certifiedHash: verificationResult
            ? verificationResult.verification.hmacSignature
            : undefined,
        }}
      />
    </div>
  );
}
