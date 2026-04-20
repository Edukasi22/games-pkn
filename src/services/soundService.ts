class SoundService {
  private audioCtx: AudioContext | null = null;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  playBuzz() {
    this.playTone(150, 'sawtooth', 0.5, 0.2);
    this.playTone(100, 'sawtooth', 0.5, 0.2);
  }

  playClick() {
    this.playTone(800, 'sine', 0.1, 0.05);
  }

  playSuccess() {
    this.playTone(523.25, 'sine', 0.2); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.2), 100); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.4), 200); // G5
  }

  playFail() {
    this.playTone(200, 'square', 0.3);
    setTimeout(() => this.playTone(150, 'square', 0.5), 200);
  }

  playStart() {
    this.playTone(440, 'triangle', 0.3);
    setTimeout(() => this.playTone(880, 'triangle', 0.5), 150);
  }
}

export const soundService = new SoundService();
