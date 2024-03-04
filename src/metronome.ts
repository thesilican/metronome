let baseUrl = import.meta.env.BASE_URL ?? "/";
if (!baseUrl.endsWith("/")) {
  baseUrl += "/";
}
const clickUrl = new URL(`${baseUrl}click.mp3`, window.location.href);

export class Metronome extends EventTarget {
  private _tempo: number;
  get tempo() {
    return this._tempo;
  }

  private audioContext: AudioContext | undefined;
  private audioBuffer: AudioBuffer | undefined;
  private timeout: NodeJS.Timeout | undefined;
  private startTime: number = 0;
  private tickCount: number = 0;
  private scheduled = new Map<number, AudioBufferSourceNode>();

  constructor(tempo: number = 120) {
    super();
    this._tempo = tempo;
  }

  async init() {
    const audioContext = new AudioContext();
    this.audioContext = audioContext;

    const data = await (await fetch(clickUrl)).arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(data);
    this.audioBuffer = audioBuffer;
  }

  async start() {
    if (!this.audioContext) {
      await this.init();
    }

    this.startTime = this.audioContext!.currentTime;
    this.tickCount = 0;
    this.tick();
  }

  private tick = () => {
    const audioContext = this.audioContext!;

    // Schedule audio clicks
    for (let i = 0; i < 10; i++) {
      const tick = this.tickCount + i;
      if (this.scheduled.has(tick)) {
        continue;
      }
      const source = this.createSource();
      const startTime = this.startTime + tick * (60 / this._tempo);
      source.start(startTime);
      source.addEventListener("ended", () => {
        this.scheduled.delete(tick);
      });
      this.scheduled.set(tick, source);
    }

    // Set next tick timeout, accounting for drift
    const now = audioContext.currentTime;
    const target = this.startTime + this.tickCount * (60 / this._tempo);
    const drift = target - now;
    this.timeout = setTimeout(this.tick, (60 / this._tempo + drift) * 1000);
    this.tickCount++;

    // Pulse
    this.dispatchEvent(new Event("pulse"));
  };

  private createSource() {
    const audioContext = this.audioContext!;
    const source = audioContext.createBufferSource();
    source.buffer = this.audioBuffer!;
    source.connect(audioContext.destination);
    return source;
  }

  stop() {
    // Clear timeout
    clearTimeout(this.timeout);
    this.timeout = undefined;

    // Clear scheduled audio clicks
    for (const source of this.scheduled.values()) {
      source.stop();
    }
    this.scheduled.clear();
  }

  async setTempo(tempo: number) {
    if (!this.audioContext) {
      await this.init();
    }

    const running = this.timeout !== undefined;

    clearTimeout(this.timeout);
    this.timeout = undefined;
    for (const source of this.scheduled.values()) {
      source.stop();
    }
    this.scheduled.clear();
    this._tempo = tempo;

    if (running) {
      this.startTime = this.audioContext!.currentTime;
      this.tickCount = 1;
      this.timeout = setTimeout(this.tick, (60 / this._tempo) * 1000);
    }
  }
}
