import { tickSound } from "./assets";

export class Ticker {
  initialized: boolean;
  private audioCtx: AudioContext | null;
  private buffer: AudioBuffer | null;
  private gain: GainNode | null;

  constructor() {
    this.initialized = false;

    this.audioCtx = null;
    this.buffer = null;
    this.gain = null;
  }

  async initAudio() {
    if (this.initialized) return;
    this.audioCtx = new window.AudioContext();

    // Buffer
    this.buffer = await this.audioCtx.decodeAudioData(await tickSound.get());

    // Gain
    this.gain = this.audioCtx.createGain();
    this.gain.gain.value = 0.1;

    this.gain.connect(this.audioCtx.destination);
    this.initialized = true;
  }

  async play() {
    if (!this.initialized) await this.initAudio();
    // Don't play if suspended
    if (this.audioCtx?.state === "suspended") return;
    const source = this.audioCtx!.createBufferSource();
    source.buffer = this.buffer!;
    source.connect(this.gain!);
    source.start(this.audioCtx!.currentTime);
  }
}
