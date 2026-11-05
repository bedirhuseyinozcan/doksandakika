import { Platform } from 'react-native';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { useSettingsStore } from '../stores/useSettingsStore';
import {
  SOUND_TAP_URI,
  SOUND_SUCCESS_URI,
  SOUND_WARNING_URI,
  SOUND_ERROR_URI,
  SOUND_WIN_URI,
  SOUND_WHISTLE_URI,
} from './soundGenerator';

interface IToneStep {
  freq: number;
  durationMs: number;
  delayMs?: number;
  type?: OscillatorType;
  gain?: number;
}

class SoundService {
  private audioCtx: AudioContext | null = null;
  private soundCache = new Map<string, AudioPlayer>();
  private nativeInitialized = false;

  constructor() {
    this.initNativeAudio();
  }

  private async initNativeAudio(): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: 'duckOthers',
      });
      this.nativeInitialized = true;
    } catch {
      
    }
  }

  private isEnabled(): boolean {
    try {
      return useSettingsStore.getState().soundEnabled;
    } catch {
      return true;
    }
  }

  private async playNativeSound(uri: string): Promise<void> {
    if (!this.isEnabled() || Platform.OS === 'web') return;
    try {
      let player = this.soundCache.get(uri);
      if (!player) {
        player = createAudioPlayer({ uri });
        this.soundCache.set(uri, player);
      } else {
        await player.seekTo(0);
      }
      player.play();
    } catch {
      
    }
  }

  private getAudioContext(): AudioContext | null {
    if (Platform.OS !== 'web') return null;
    try {
      if (!this.audioCtx && typeof window !== 'undefined') {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  private playSequence(steps: IToneStep[]): void {
    if (!this.isEnabled() || Platform.OS !== 'web') return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      for (const step of steps) {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        const startSec = now + (step.delayMs ?? 0) / 1000;
        const durationSec = Math.max(0.02, step.durationMs / 1000);
        const peakGain = step.gain ?? 0.12;

        osc.type = step.type ?? 'sine';
        osc.frequency.setValueAtTime(step.freq, startSec);

        gainNode.gain.setValueAtTime(0.001, startSec);
        gainNode.gain.exponentialRampToValueAtTime(peakGain, startSec + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startSec + durationSec);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(startSec);
        osc.stop(startSec + durationSec + 0.01);
      }
    } catch {
      
    }
  }


  public playTap(): void {
    if (Platform.OS === 'web') {
      this.playSequence([{ freq: 520, durationMs: 35, type: 'triangle', gain: 0.08 }]);
    } else {
      this.playNativeSound(SOUND_TAP_URI);
    }
  }

  public playSuccess(): void {
    if (Platform.OS === 'web') {
      this.playSequence([
        { freq: 523.25, durationMs: 90, delayMs: 0, type: 'triangle', gain: 0.12 },
        { freq: 659.25, durationMs: 110, delayMs: 75, type: 'triangle', gain: 0.13 },
        { freq: 783.99, durationMs: 180, delayMs: 150, type: 'sine', gain: 0.15 },
      ]);
    } else {
      this.playNativeSound(SOUND_SUCCESS_URI);
    }
  }

  public playWarning(): void {
    if (Platform.OS === 'web') {
      this.playSequence([
        { freq: 440, durationMs: 70, delayMs: 0, type: 'sine', gain: 0.09 },
        { freq: 370, durationMs: 90, delayMs: 65, type: 'sine', gain: 0.09 },
      ]);
    } else {
      this.playNativeSound(SOUND_WARNING_URI);
    }
  }

  public playError(): void {
    if (Platform.OS === 'web') {
      this.playSequence([
        { freq: 210, durationMs: 110, delayMs: 0, type: 'sawtooth', gain: 0.1 },
        { freq: 145, durationMs: 170, delayMs: 95, type: 'sawtooth', gain: 0.11 },
      ]);
    } else {
      this.playNativeSound(SOUND_ERROR_URI);
    }
  }

  public playWinFanfare(): void {
    if (Platform.OS === 'web') {
      this.playSequence([
        { freq: 523.25, durationMs: 100, delayMs: 0, type: 'triangle', gain: 0.13 },
        { freq: 659.25, durationMs: 100, delayMs: 90, type: 'triangle', gain: 0.13 },
        { freq: 783.99, durationMs: 100, delayMs: 180, type: 'triangle', gain: 0.14 },
        { freq: 1046.5, durationMs: 280, delayMs: 270, type: 'sine', gain: 0.16 },
      ]);
    } else {
      this.playNativeSound(SOUND_WIN_URI);
    }
  }

  public playWhistle(): void {
    if (Platform.OS === 'web') {
      this.playSequence([
        { freq: 2800, durationMs: 120, delayMs: 0, type: 'sine', gain: 0.15 },
        { freq: 3100, durationMs: 140, delayMs: 100, type: 'sine', gain: 0.18 },
        { freq: 2800, durationMs: 160, delayMs: 220, type: 'sine', gain: 0.15 },
      ]);
    } else {
      this.playNativeSound(SOUND_WHISTLE_URI);
    }
  }
}

export const soundService = new SoundService();
