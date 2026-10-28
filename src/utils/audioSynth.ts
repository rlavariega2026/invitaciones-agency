/**
 * Web Audio API synthesizer for ambient invitation music.
 * Generates gentle, royalty-free background melodies on-demand,
 * ensuring zero broken links, instant playback without streaming delays,
 * and compliance with browser autoplay security policies.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrack: string | null = null;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playNote(freq: number, startTime: number, duration: number, type: OscillatorType = 'sine', decay = 0.8) {
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Smooth attack & exponential decay envelope
      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * decay);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Audio node cleanup safeguard
    }
  }

  // Frequencies (Hz)
  private readonly notes: Record<string, number> = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
  };

  public play(trackId: 'wedding_canon' | 'quince_waltz' | 'kids_cheerful' | 'acoustic_romance' | 'none') {
    if (trackId === 'none') {
      this.stop();
      return;
    }

    this.initContext();
    this.stop();

    this.isPlaying = true;
    this.currentTrack = trackId;

    if (trackId === 'wedding_canon') {
      this.playWeddingCanonLoop();
    } else if (trackId === 'quince_waltz') {
      this.playQuinceWaltzLoop();
    } else if (trackId === 'kids_cheerful') {
      this.playKidsCheerfulLoop();
    } else {
      this.playAcousticRomanceLoop();
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentTrack = null;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(trackId: 'wedding_canon' | 'quince_waltz' | 'kids_cheerful' | 'acoustic_romance' | 'none'): boolean {
    if (this.isPlaying && this.currentTrack === trackId) {
      this.stop();
      return false;
    } else {
      this.play(trackId);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): string | null {
    return this.currentTrack;
  }

  private playWeddingCanonLoop() {
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;
    const tempo = 0.6; // note step length

    // Pachelbel Canon romantic chord arpeggios
    const chords = [
      [this.notes.D3, this.notes.A3, this.notes.D4, this.notes.F4, this.notes.A4],
      [this.notes.A3, this.notes.E4, this.notes.A4, this.notes.C5],
      [this.notes.B3, this.notes.F4, this.notes.B4, this.notes.D5],
      [this.notes.F3, this.notes.C4, this.notes.F4, this.notes.A4],
      [this.notes.G3, this.notes.D4, this.notes.G4, this.notes.B4],
      [this.notes.D3, this.notes.A3, this.notes.D4, this.notes.F4],
      [this.notes.G3, this.notes.D4, this.notes.G4, this.notes.B4],
      [this.notes.A3, this.notes.E4, this.notes.A4, this.notes.C5],
    ];

    let t = now;
    chords.forEach((chord) => {
      chord.forEach((freq, idx) => {
        this.playNote(freq, t + idx * (tempo * 0.4), tempo * 1.5, 'triangle', 0.85);
      });
      t += tempo * 2.2;
    });

    const loopLengthMs = (t - now) * 1000;
    this.timerId = window.setTimeout(() => {
      if (this.isPlaying) {
        this.playWeddingCanonLoop();
      }
    }, loopLengthMs);
  }

  private playQuinceWaltzLoop() {
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;
    const beat = 0.55;

    // 3/4 Waltz rhythm (Bass on 1, chord on 2 and 3)
    const waltzBars = [
      { bass: this.notes.C4, harmony: [this.notes.E4, this.notes.G4, this.notes.C5] },
      { bass: this.notes.A3, harmony: [this.notes.C4, this.notes.E4, this.notes.A4] },
      { bass: this.notes.F3, harmony: [this.notes.A3, this.notes.C4, this.notes.F4] },
      { bass: this.notes.G3, harmony: [this.notes.B3, this.notes.D4, this.notes.G4] },
    ];

    let t = now;
    waltzBars.forEach((bar) => {
      // Beat 1: Warm bass
      this.playNote(bar.bass, t, beat * 1.8, 'sine', 0.9);
      // Beat 2: Shimmering harmony
      bar.harmony.forEach((f) => this.playNote(f, t + beat, beat * 0.9, 'triangle', 0.7));
      // Beat 3: Shimmering harmony
      bar.harmony.forEach((f) => this.playNote(f, t + beat * 2, beat * 0.9, 'triangle', 0.7));
      t += beat * 3;
    });

    const loopLengthMs = (t - now) * 1000;
    this.timerId = window.setTimeout(() => {
      if (this.isPlaying) {
        this.playQuinceWaltzLoop();
      }
    }, loopLengthMs);
  }

  private playKidsCheerfulLoop() {
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;
    const step = 0.28;

    // Upbeat playful melody
    const melody = [
      this.notes.C4, this.notes.E4, this.notes.G4, this.notes.C5,
      this.notes.G4, this.notes.E4, this.notes.F4, this.notes.A4,
      this.notes.G4, this.notes.E4, this.notes.D4, this.notes.C4,
    ];

    let t = now;
    melody.forEach((freq, i) => {
      this.playNote(freq, t + i * step, step * 1.2, 'sine', 0.6);
    });

    const loopLengthMs = melody.length * step * 1000 + 400;
    this.timerId = window.setTimeout(() => {
      if (this.isPlaying) {
        this.playKidsCheerfulLoop();
      }
    }, loopLengthMs);
  }

  private playAcousticRomanceLoop() {
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;
    const step = 0.35;

    const pattern = [
      this.notes.A3, this.notes.C4, this.notes.E4, this.notes.A4,
      this.notes.F3, this.notes.A3, this.notes.C4, this.notes.F4,
      this.notes.G3, this.notes.B3, this.notes.D4, this.notes.G4,
      this.notes.E3, this.notes.G3, this.notes.B3, this.notes.E4,
    ];

    let t = now;
    pattern.forEach((freq, idx) => {
      this.playNote(freq, t + idx * step, step * 1.5, 'triangle', 0.8);
    });

    const loopLengthMs = pattern.length * step * 1000;
    this.timerId = window.setTimeout(() => {
      if (this.isPlaying) {
        this.playAcousticRomanceLoop();
      }
    }, loopLengthMs);
  }

  public playPaperFlip() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.12);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start();
    } catch {}
  }
}

export const musicPlayer = new AudioSynthesizer();
