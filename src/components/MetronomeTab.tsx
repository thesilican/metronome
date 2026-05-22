import cn from "classnames";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Metronome } from "../lib/metronome";
import styles from "./MetronomeTab.module.css";

const STANDARD_TEMPOS = [
	42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 76, 80, 84, 88, 92,
	96, 100, 104, 108, 112, 116, 120, 126, 132, 138, 144, 152, 160, 168, 176, 184,
	192, 200, 208,
];

const MIN_TEMPO = 1;
const MAX_TEMPO = 999;

const tempoText = localStorage.getItem("metronome-tempo");
const tempo = tempoText ? parseInt(tempoText, 10) : 120;
const metronome = new Metronome(tempo);

export function MetronomeTab() {
	const startStopRef = useRef<HTMLButtonElement>(null);
	const tempoValueRef = useRef<HTMLInputElement>(null);
	const tempoSliderRef = useRef<HTMLInputElement>(null);
	const [tempo, setTempo] = useState(() => metronome.getTempo());
	const [playing, setPlaying] = useState(() => metronome.isPlaying());
	const [spaceDown, setSpaceDown] = useState(false);
	const [sliderDragging, setSliderDragging] = useState(false);
	const [valueEditing, setValueEditing] = useState(false);

	let slider = STANDARD_TEMPOS.length - 1;
	for (let i = 0; i < STANDARD_TEMPOS.length; i++) {
		if (STANDARD_TEMPOS[i] >= tempo) {
			slider = i;
			break;
		}
	}

	useEffect(() => {
		const startStop = startStopRef.current;
		const tempoSlider = tempoSliderRef.current;
		const tempoValue = tempoValueRef.current;
		if (!startStop || !tempoSlider || !tempoValue) {
			return;
		}
		const handleAnimationEnd = (e: AnimationEvent) => {
			if (e.animationName === styles.pulse) {
				startStop.classList.remove(styles.pulse);
			}
		};
		const handlePulse = () => {
			startStop.classList.add(styles.pulse);
		};
		const handlePlay = () => {
			setPlaying(true);
		};
		const handlePause = () => {
			setPlaying(false);
		};
		const handlePointerDown = () => {
			setSliderDragging(true);
		};
		const handlePointerUp = () => {
			setSliderDragging(false);
		};
		const handleFocus = () => {
			setValueEditing(true);
		};
		const handleBlur = () => {
			setValueEditing(false);
		};
		metronome.addEventListener("pulse", handlePulse);
		metronome.addEventListener("play", handlePlay);
		metronome.addEventListener("pause", handlePause);
		startStop.addEventListener("animationend", handleAnimationEnd);
		tempoSlider.addEventListener("pointerdown", handlePointerDown);
		tempoSlider.addEventListener("pointerup", handlePointerUp);
		tempoValue.addEventListener("focus", handleFocus);
		tempoValue.addEventListener("blur", handleBlur);
		return () => {
			metronome.stop();
			metronome.removeEventListener("pulse", handlePulse);
			metronome.removeEventListener("play", handlePlay);
			metronome.removeEventListener("pause", handlePause);
			startStop.removeEventListener("animationend", handleAnimationEnd);
			tempoSlider.removeEventListener("pointerdown", handlePointerDown);
			tempoSlider.removeEventListener("pointerup", handlePointerUp);
			tempoValue.removeEventListener("focus", handleFocus);
			tempoValue.removeEventListener("blur", handleBlur);
		};
	}, []);

	useEffect(() => {
		const tempoValue = tempoValueRef.current;
		if (!tempoValue) {
			return;
		}
		const handleKeydown = (e: KeyboardEvent) => {
			if (e.code === "Space") {
				e.preventDefault();
				if (metronome.isPlaying()) {
					metronome.stop();
				} else {
					metronome.start();
				}
				setSpaceDown(true);
			} else if (e.code === "Enter" || e.code === "NumpadEnter") {
				e.preventDefault();
				if (document.activeElement === tempoValue) {
					tempoValue.blur();
				} else {
					tempoValue.select();
				}
			} else if (e.code === "Escape") {
				e.preventDefault();
				tempoValue.blur();
			} else if (e.code === "ArrowUp") {
				e.preventDefault();
				tempoSliderRef.current?.blur();
				setTempo((tempo) => Math.min(tempo + 1, MAX_TEMPO));
			} else if (e.code === "ArrowDown") {
				e.preventDefault();
				tempoSliderRef.current?.blur();
				setTempo((tempo) => Math.max(tempo - 1, MIN_TEMPO));
			} else if (e.code === "ArrowLeft") {
				e.preventDefault();
				tempoSliderRef.current?.blur();
				setTempo(STANDARD_TEMPOS[Math.max(0, slider - 1)]);
			} else if (e.code === "ArrowRight") {
				e.preventDefault();
				tempoSliderRef.current?.blur();
				setTempo(
					STANDARD_TEMPOS[Math.min(STANDARD_TEMPOS.length - 1, slider + 1)],
				);
			} else if (!Number.isNaN(parseInt(e.key, 10))) {
				if (document.activeElement === tempoValue) {
					return;
				}
				setTempo(parseInt(e.key, 10));
				tempoValue.focus();
				e.preventDefault();
			}
		};
		const handleKeyup = (e: KeyboardEvent) => {
			if (e.code === "Space") {
				e.preventDefault();
				setSpaceDown(false);
			}
		};
		window.addEventListener("keydown", handleKeydown);
		window.addEventListener("keyup", handleKeyup);
		return () => {
			window.removeEventListener("keydown", handleKeydown);
			window.removeEventListener("keyup", handleKeyup);
		};
	}, [slider]);

	useEffect(() => {
		if (sliderDragging || valueEditing) {
			return;
		}
		if (tempo < MIN_TEMPO || tempo > MAX_TEMPO) {
			return;
		}
		localStorage.setItem("metronome-tempo", tempo.toString());
		if (tempo !== metronome.getTempo()) {
			metronome.setTempo(tempo);
		}
	}, [tempo, sliderDragging, valueEditing]);

	const handleStartStopChange = () => {
		if (metronome.isPlaying()) {
			metronome.stop();
		} else {
			metronome.start();
		}
	};

	const handleTempoInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.value.match(/[0-9]*/)) {
			return;
		}
		if (e.target.value === "") {
			setTempo(0);
			return;
		}
		const number = parseInt(e.target.value, 10);
		if (number <= MAX_TEMPO) {
			setTempo(number);
		}
	};

	const handleTempoSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		setTempo(STANDARD_TEMPOS[value]);
	};

	return (
		<div className={styles.controls}>
			<button
				className={cn(
					styles.startStop,
					playing && styles.playing,
					spaceDown && styles.space,
				)}
				ref={startStopRef}
				onClick={handleStartStopChange}
				tabIndex={-1}
				type="button"
			>
				{playing ? pauseSvg : playSvg}
			</button>
			<div className={styles.tempoControls}>
				<input
					className={styles.tempoValue}
					type="number"
					inputMode="numeric"
					ref={tempoValueRef}
					value={tempo === 0 ? "" : tempo}
					onClick={(e) => e.currentTarget.select()}
					onChange={handleTempoInputChange}
					tabIndex={-1}
				/>
				<input
					className={styles.tempoSlider}
					type="range"
					ref={tempoSliderRef}
					min={0}
					max={STANDARD_TEMPOS.length - 1}
					value={slider}
					onChange={handleTempoSliderChange}
					tabIndex={-1}
				/>
			</div>
		</div>
	);
}

const playSvg = (
	<svg
		width="100"
		height="100"
		viewBox="0 0 60 60"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		role="presentation"
	>
		<path d="M8 0L60 30L8 60V0Z" fill="white" />
	</svg>
);

const pauseSvg = (
	<svg
		width="100"
		height="100"
		viewBox="0 0 60 60"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		role="presentation"
	>
		<rect x="3" width="18" height="60" fill="white" />
		<rect x="39" width="18" height="60" fill="white" />
	</svg>
);
