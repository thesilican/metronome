let baseUrl = import.meta.env.BASE_URL ?? "/";
if (!baseUrl.endsWith("/")) {
  baseUrl += "/";
}
const clickUrl = new URL(`${baseUrl}click.mp3`, window.location.href);
const clickAudioData = fetch(clickUrl);

export class Metronome extends EventTarget {
  private audioContext: AudioContext | undefined;
  private audioElement: HTMLAudioElement | undefined;
  private audioBuffer: AudioBuffer | undefined;
  private destination: MediaStreamAudioDestinationNode | undefined;
  private timeout: NodeJS.Timeout | null = null;
  private startTime = 0;
  private scheduled = new Map<number, [AudioBufferSourceNode, () => void]>();
  private scheduledMax = -1;

  private _tempo: number;
  get tempo() {
    return this._tempo;
  }

  get isPlaying() {
    return this.timeout !== null;
  }

  constructor(tempo: number = 120) {
    super();
    this._tempo = tempo;
  }

  private async init() {
    const audioContext = new AudioContext();
    this.audioContext = audioContext;
    this.audioContext.addEventListener("statechange", () => {
      if (["interrupted", "suspended"].includes(this.audioContext!.state)) {
        if (this.timeout !== null) {
          this.stop();
          this.dispatchEvent(new Event("externalpause"));
        }
      }
    });

    const destination = audioContext.createMediaStreamDestination();
    this.destination = destination;

    const audioElement = document.createElement("audio");
    document.body.appendChild(audioElement);
    audioElement.srcObject = destination.stream;
    audioElement.addEventListener("play", () => {
      if (this.timeout === null) {
        this.start();
        this.dispatchEvent(new Event("externalplay"));
      }
    });
    audioElement.addEventListener("pause", () => {
      if (this.timeout !== null) {
        this.stop();
        this.dispatchEvent(new Event("externalpause"));
      }
    });
    this.audioElement = audioElement;

    const data = await (await clickAudioData).arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(data);
    this.audioBuffer = audioBuffer;
  }

  async start() {
    let bigDelay = this.audioContext === undefined;
    if (this.audioContext === undefined) {
      await this.init();
    }
    // Resume if interrupted
    if (["interrupted", "suspended"].includes(this.audioContext!.state)) {
      bigDelay = true;
      this.audioContext!.resume();
    }
    this.audioElement?.play();

    // Stop existing timeout
    if (this.timeout !== null) {
      clearInterval(this.timeout);
    }
    // Clear existing scheduled audio clicks
    for (const [source, callback] of this.scheduled.values()) {
      source.removeEventListener("ended", callback);
      source.stop();
      source.disconnect();
    }
    this.scheduled.clear();
    this.scheduledMax = -1;

    // Schedule ticks, delay start time by a few ms to prevent audio popping artifact
    this.startTime = this.audioContext!.currentTime + (bigDelay ? 0.3 : 0.1);
    this.scheduleTicks();
    this.timeout = setInterval(this.scheduleTicks, 1000);
  }

  stop() {
    this.audioElement?.pause();

    // Clear timeout
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = null;

    // Clear existing scheduled audio clicks
    for (const [source, callback] of this.scheduled.values()) {
      source.removeEventListener("ended", callback);
      source.stop();
      source.disconnect();
    }
    this.scheduled.clear();
    this.scheduledMax = -1;
  }

  async setTempo(tempo: number) {
    const running = this.timeout !== null;
    if (running) {
      // Clear existing scheduled audio clicks
      for (const [source, callback] of this.scheduled.values()) {
        source.removeEventListener("ended", callback);
        source.stop();
        source.disconnect();
      }
      this.scheduled.clear();
      this.scheduledMax = -1;
      this._tempo = tempo;
      // Set start time in the future with small delay
      this.startTime = this.audioContext!.currentTime + 0.5;
      this.scheduleTicks();
    } else {
      this._tempo = tempo;
    }
  }

  private scheduleTicks = () => {
    const audioContext = this.audioContext!;
    const currentTime = audioContext.currentTime;
    const period = 60 / this._tempo;
    const nextTick = Math.ceil(
      Math.max(0, (currentTime - this.startTime) / period)
    );

    // Schedule 100 audio clicks in the future, should keep up
    // as long as tempo < 6000bpm
    for (let i = 0; i < 100; i++) {
      const tick = nextTick + i;
      if (tick <= this.scheduledMax || this.scheduled.has(tick)) {
        continue;
      }
      this.scheduledMax = Math.max(tick, this.scheduledMax);
      const scheduledTime = this.startTime + tick * period;
      const source = audioContext.createBufferSource();
      source.buffer = this.audioBuffer!;
      source.connect(this.destination!);
      source.start(scheduledTime);
      const callback = () => {
        this.scheduled.delete(tick);
        this.dispatchEvent(new Event("pulse"));
      };
      source.addEventListener("ended", callback);
      this.scheduled.set(tick, [source, callback]);
    }
  };
}
