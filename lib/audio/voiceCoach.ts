/**
 * FITFLOW: REAL-TIME AUDIO AI COACH & SOUND SYNTHESIZER
 * Uses browser Web Speech API & Web Audio API (Zero External Asset Dependency).
 * Delivers real-time voice feedback, whistle blasts, rep countdowns, and form alerts.
 */

export class VoiceCoach {
  private isMuted: boolean = false;
  private audioCtx: AudioContext | null = null;
  private lastSpokenText: string = '';
  private lastSpokenTime: number = 0;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Speaks verbal form correction or rep count using synthesized voice.
   * Throttles repeating phrases to prevent audio overlapping.
   */
  public speak(text: string, priority: boolean = false, minIntervalMs: number = 1800): void {
    if (this.isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    const now = Date.now();
    if (!priority && text === this.lastSpokenText && now - this.lastSpokenTime < minIntervalMs) {
      return;
    }

    if (priority) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05; // Slightly athletic upbeat pace
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    // Pick crisp English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.lastSpokenText = text;
    this.lastSpokenTime = now;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Synthesizes athletic whistle blast for test start or completion.
   */
  public playWhistle(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Classic referee dual-tone whistle modulation
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(2800, now + 0.1);
    osc.frequency.setValueAtTime(2400, now + 0.25);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  /**
   * Synthesizes valid repetition success chime (upward bright harmonic).
   */
  public playRepSuccessChime(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.12); // A5

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Synthesizes form fault alert tone (dull low frequency).
   */
  public playFormFaultTone(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.linearRampToValueAtTime(180, now + 0.2);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }
}

export const globalVoiceCoach = new VoiceCoach();
