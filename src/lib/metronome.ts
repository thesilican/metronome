import clickUrl from "../assets/click.wav";

const clickAudioData = fetch(clickUrl);

export class Metronome extends EventTarget {
	private ctx: AudioContext | undefined;
	private audioElement: HTMLAudioElement | undefined;
	private clickBuffer: AudioBuffer | undefined;
	private clickTrack: AudioBufferSourceNode | undefined;
	private clickGain: GainNode | undefined;
	private destination: MediaStreamAudioDestinationNode | undefined;
	private tempo: number;

	getTempo() {
		return this.tempo;
	}

	isPlaying() {
		return this.audioElement && !this.audioElement.paused;
	}

	constructor(tempo: number = 120) {
		super();
		this.tempo = tempo;
	}

	private async init() {
		const ctx = new AudioContext();
		ctx.addEventListener("statechange", () => {
			if (["interrupted", "suspended"].includes(ctx.state)) {
				this.stop();
			}
		});
		this.ctx = ctx;

		const destination = ctx.createMediaStreamDestination();
		this.destination = destination;

		const audioElement = document.createElement("audio");
		document.body.appendChild(audioElement);
		audioElement.srcObject = destination.stream;
		audioElement.loop = true;
		audioElement.addEventListener("play", () => {
			if (!this.isPlaying()) {
				this.start();
			}
			this.dispatchEvent(new Event("play"));
		});
		audioElement.addEventListener("pause", () => {
			if (this.isPlaying()) {
				this.stop();
			}
			this.dispatchEvent(new Event("pause"));
		});
		this.audioElement = audioElement;

		const data = await (await clickAudioData).arrayBuffer();
		this.clickBuffer = await ctx.decodeAudioData(data);
	}

	async start() {
		if (!this.ctx) {
			await this.init();
		}
		const ctx = this.ctx;
		const audioElement = this.audioElement;
		if (!audioElement || !ctx) {
			throw new Error("uninitialized");
		}

		// Resume if interrupted
		if (["interrupted", "suspended"].includes(ctx.state)) {
			ctx.resume();
		}
		this.setClickTrack(this.tempo);
		await audioElement.play();
	}

	async stop() {
		if (!this.ctx) {
			await this.init();
		}
		const audioElement = this.audioElement;
		if (!audioElement) {
			throw new Error("uninitialized");
		}

		audioElement.pause();
		await this.removeClickTrack();
	}

	async setTempo(tempo: number) {
		if (!this.ctx) {
			await this.init();
		}
		const ctx = this.ctx;
		const destination = this.destination;
		if (!ctx || !destination) {
			throw new Error("uninitialized");
		}

		if (this.isPlaying()) {
			await this.removeClickTrack();
			this.tempo = tempo;
			this.setClickTrack(this.tempo);
		} else {
			this.tempo = tempo;
		}
	}

	private setClickTrack(tempo: number) {
		if (this.clickTrack) {
			return;
		}

		const ctx = this.ctx;
		const clickBuffer = this.clickBuffer;
		const destination = this.destination;
		if (!clickBuffer || !ctx || !destination) {
			throw new Error("uninitialized");
		}

		const sampleRate = clickBuffer.sampleRate;
		const clickArray = clickBuffer.getChannelData(0);

		// We want the audio buffer to last 1 minute
		// Thus if the tempo is 60bpm, we want 60 clicks
		// If the tempo is 120bpm, we want 120 clicks
		const numClicks = Math.round(tempo);
		const length = Math.round((numClicks * sampleRate * 60) / tempo);
		const outputBuffer = ctx.createBuffer(1, length, sampleRate);
		for (let i = 0; i < numClicks; i++) {
			const offset = Math.round((i * sampleRate * 60) / tempo);
			outputBuffer.copyToChannel(clickArray, 0, offset);
		}

		const clickGain = ctx.createGain();
		clickGain.connect(destination);
		this.clickGain = clickGain;

		const clickTrack = ctx.createBufferSource();
		clickTrack.buffer = outputBuffer;
		clickTrack.loop = true;
		clickTrack.connect(clickGain);
		this.clickTrack = clickTrack;

		clickTrack.start(ctx.currentTime + 0.1);
	}

	private async removeClickTrack() {
		const ctx = this.ctx;
		if (!ctx) {
			throw new Error("uninitialized");
		}

		if (this.clickTrack && this.clickGain) {
			const clickTrack = this.clickTrack;
			const clickGain = this.clickGain;
			this.clickTrack = undefined;
			this.clickGain = undefined;
			// Shut off value
			const now = ctx.currentTime;
			clickGain.gain.linearRampToValueAtTime(0, now + 0.01);
			await new Promise((res) => setTimeout(res, 100));
			clickTrack.stop();
			clickTrack.disconnect();
		}
	}
}
