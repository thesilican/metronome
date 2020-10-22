import { noop } from "../util";
import { clickSound } from "./assets";

// https://glitch.com/edit/#!/metronomes
export class Metronome {
  tempo: number;
  initialized: boolean;
  playing: boolean;
  private interval: NodeJS.Timeout | null;
  private nextTick: number;
  private audioCtx: AudioContext | null;
  private buffer: AudioBuffer | null;
  private gain: GainNode | null;
  private scheduledBuffers: Map<number, AudioBufferSourceNode>;
  private scheduledTimeouts: Map<number, NodeJS.Timeout>;
  private tickEventListener: EventTarget;

  constructor(tempo = 60) {
    this.tempo = tempo;
    this.initialized = false;
    this.playing = false;

    this.audioCtx = null;
    this.buffer = null;
    this.gain = null;
    this.interval = null;
    this.nextTick = 0;
    this.scheduledBuffers = new Map();
    this.scheduledTimeouts = new Map();
    this.tickEventListener = new EventTarget();
  }
  async initAudio() {
    if (this.initialized) return;
    this.audioCtx = new window.AudioContext();

    // Buffer
    this.buffer = await this.audioCtx.decodeAudioData(await clickSound.get());

    // Gain
    this.gain = this.audioCtx.createGain();
    this.gain.gain.value = 1;

    this.gain.connect(this.audioCtx.destination);
    this.initialized = true;
  }
  private tick() {
    const curTime = this.audioCtx!.currentTime;
    const secondsPerTick = 60 / this.tempo;
    const ticksToSchedule = 5 / secondsPerTick;
    if (curTime > this.nextTick - ticksToSchedule) {
      for (let i = 0; i < ticksToSchedule; i++) {
        this.scheduleNew(this.nextTick);
        this.nextTick += secondsPerTick;
      }
    }
  }
  private scheduleNew(time: number) {
    const source = this.audioCtx!.createBufferSource();
    source.buffer = this.buffer!;
    source.connect(this.gain!);
    source.start(time);
    source.onended = () => this.scheduledBuffers.delete(time);

    const diff = time - this.audioCtx!.currentTime;
    const timeout = setTimeout(() => {
      this.tickEventListener.dispatchEvent(new Event("tick"));
      this.scheduledTimeouts.delete(time);
    }, diff * 1000);

    this.scheduledBuffers.set(time, source);
    this.scheduledTimeouts.set(time, timeout);
  }
  private clearScheduled() {
    for (const [time, source] of this.scheduledBuffers.entries()) {
      source.stop(time);
      source.onended = noop;
    }
    this.scheduledBuffers.clear();
    for (const timeout of this.scheduledTimeouts.values()) {
      clearTimeout(timeout);
    }
    this.scheduledTimeouts.clear();
  }
  async start() {
    if (!this.initialized) await this.initAudio();
    this.playing = true;
    // Start first tick after 0.5 second
    this.nextTick = this.audioCtx!.currentTime;

    this.tick();
    this.interval = setInterval(this.tick.bind(this), 1000);
  }
  async stop() {
    if (!this.initialized) await this.initAudio();
    this.playing = false;
    if (this.interval === null) return;
    clearInterval(this.interval);
    this.interval = null;
    this.clearScheduled();
  }
  async setTempo(newTempo: number) {
    if (!this.initialized) await this.initAudio();
    if (newTempo < 10 || newTempo > 1000) return;
    this.tempo = newTempo;
    if (this.interval !== null) {
      this.stop();
      this.start();
    }
  }
  addEventListener(type: "tick", callback: () => void) {
    this.tickEventListener.addEventListener(type, callback);
  }
  removeEventListener(type: "tick", callback: () => void) {
    this.tickEventListener.removeEventListener(type, callback);
  }
}
