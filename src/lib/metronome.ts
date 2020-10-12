import { noop } from "../util";

const clickSound = `${process.env.PUBLIC_URL}/assets/click.mp3`;
// const bruhSound = `${process.env.PUBLIC_URL}/assets/bruh.mp3`;
const metronomeSound = clickSound;

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
  }
  async initAudio() {
    this.audioCtx = new window.AudioContext();

    // Buffer
    this.buffer = await this.audioCtx.decodeAudioData(
      await (await fetch(metronomeSound)).arrayBuffer()
    );

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
    this.scheduledBuffers!.set(time, source);
    source.onended = () => this.scheduledBuffers.delete(time);
  }
  private clearScheduled() {
    for (const [time, source] of this.scheduledBuffers.entries()) {
      source.stop(time);
      source.onended = noop;
    }
    this.scheduledBuffers.clear();
  }
  async start() {
    if (!this.initialized) await this.initAudio();
    this.playing = true;
    this.nextTick = this.audioCtx!.currentTime;
    // Start immediately
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
}

export class Ticker {
  initialized: boolean;
  private audioCtx: AudioContext | null;
  private buffer: AudioBuffer | null;
  private gain: GainNode | null;

  constructor(tempo = 60) {
    this.initialized = false;

    this.audioCtx = null;
    this.buffer = null;
    this.gain = null;
  }

  async initAudio() {
    this.audioCtx = new window.AudioContext();

    // Buffer
    this.buffer = await this.audioCtx.decodeAudioData(
      await (await fetch(metronomeSound)).arrayBuffer()
    );

    // Gain
    this.gain = this.audioCtx.createGain();
    this.gain.gain.value = 0.1;

    this.gain.connect(this.audioCtx.destination);
    this.initialized = true;
  }

  async play() {
    if (!this.initialized) await this.initAudio();
    const source = this.audioCtx!.createBufferSource();
    source.buffer = this.buffer!;
    source.connect(this.gain!);
    source.start(this.audioCtx!.currentTime);
  }
}
