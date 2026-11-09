'use client';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tarot_sound_muted');
      this.isMuted = stored === 'true';
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('tarot_sound_muted', muted ? 'true' : 'false');
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Generates a soft rustle / card riffle sound
   */
  public playShuffle(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const count = 12;
    const now = ctx.currentTime;

    for (let i = 0; i < count; i++) {
      const startTime = now + (i * 0.04) + (Math.random() * 0.015);
      const bufferSize = ctx.sampleRate * 0.035;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let j = 0; j < bufferSize; j++) {
        data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.3));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800 + Math.random() * 600, startTime);
      filter.Q.setValueAtTime(3.5, startTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08 + Math.random() * 0.04, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.035);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(startTime);
    }
  }

  /**
   * Generates a soft paper slide sound for dealing a card
   */
  public playCardDeal(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.08);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  }

  /**
   * Generates a crisp paper flip swoosh
   */
  public playCardFlip(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Quick swoosh
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - (i / bufferSize));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.06);
    filter.frequency.exponentialRampToValueAtTime(500, now + 0.12);
    filter.Q.setValueAtTime(2, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  }

  /**
   * Resonant occult harmonic bell / Tibetan singing bowl chime
   */
  public playChime(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const frequencies = [528, 1056, 1584]; // 528 Hz transformation frequency + harmonics
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.1, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
    masterGain.connect(ctx.destination);

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = 1 / (idx + 1.2);
      oscGain.gain.setValueAtTime(amp, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8 + idx * 0.3);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 2.5);
    });
  }
}

export const sound = new SoundEngine();
