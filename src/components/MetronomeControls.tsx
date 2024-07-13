import { ChangeEvent, useEffect, useRef, useState } from "react";
import pauseSvg from "../assets/pause.svg";
import playSvg from "../assets/play.svg";
import { Metronome } from "../metronome";
import styles from "./MetronomeControls.module.css";

const STANDARD_TEMPOS = [
  42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 76, 80, 84, 88, 92,
  96, 100, 104, 108, 112, 116, 120, 126, 132, 138, 144, 152, 160, 168, 176, 184,
  192, 200, 208,
];

const MAX_TEMPO = 999;

const text = localStorage.getItem("metronome-tempo");
const tempo = text ? parseInt(text, 10) : 120;
const metronome = new Metronome(tempo);

export function MetronomeControls() {
  const startStopRef = useRef<HTMLButtonElement>(null);
  const tempoValueRef = useRef<HTMLInputElement>(null);
  const tempoSliderRef = useRef<HTMLInputElement>(null);
  const [tempo, setTempo] = useState(() => metronome.tempo);
  const [playing, setPlaying] = useState(false);

  let slider = STANDARD_TEMPOS.length - 1;
  for (let i = 0; i < STANDARD_TEMPOS.length; i++) {
    if (STANDARD_TEMPOS[i] >= tempo) {
      slider = i;
      break;
    }
  }

  useEffect(() => {
    const startStop = startStopRef.current;
    if (!startStop) {
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
    metronome.addEventListener("pulse", handlePulse);
    startStop.addEventListener("animationend", handleAnimationEnd);
    return () => {
      metronome.stop();
      metronome.removeEventListener("pulse", handlePulse);
      startStop.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [startStopRef]);

  useEffect(() => {
    metronome.setTempo(tempo);
  }, [tempo]);

  useEffect(() => {
    if (playing) {
      metronome.start();
    } else {
      metronome.stop();
    }
  }, [playing]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((x) => !x);
      } else if (e.code === "Enter") {
        e.preventDefault();
        if (document.activeElement === tempoValueRef.current) {
          tempoValueRef.current?.blur();
        } else {
          tempoValueRef.current?.select();
        }
      } else if (e.code === "Escape") {
        e.preventDefault();
        tempoValueRef.current?.blur();
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        tempoSliderRef.current?.blur();
        setTempo((tempo) => Math.min(tempo + 1, MAX_TEMPO));
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        tempoSliderRef.current?.blur();
        setTempo((tempo) => Math.max(tempo - 1, 1));
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        tempoSliderRef.current?.blur();
        setTempo(STANDARD_TEMPOS[Math.max(0, slider - 1)]);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        tempoSliderRef.current?.blur();
        setTempo(
          STANDARD_TEMPOS[Math.min(STANDARD_TEMPOS.length - 1, slider + 1)]
        );
      } else if (!isNaN(parseInt(e.key))) {
        if (document.activeElement === tempoValueRef.current) {
          return;
        }
        tempoValueRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [slider]);

  useEffect(() => {
    localStorage.setItem("metronome-tempo", tempo.toString());
  }, [tempo]);

  const handleStartStopChange = () => {
    setPlaying(!playing);
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
        className={styles.startStop}
        ref={startStopRef}
        onClick={handleStartStopChange}
        tabIndex={-1}
        style={{ backgroundImage: `url("${playing ? pauseSvg : playSvg}")` }}
      />
      <div
        className={styles.tempoControls}
        onSubmit={(e) => e.preventDefault()}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className={styles.tempoValue}
            type="number"
            inputMode="numeric"
            ref={tempoValueRef}
            value={tempo === 0 ? "" : tempo}
            onFocus={(e) => e.target.select()}
            onChange={handleTempoInputChange}
            tabIndex={-1}
          />
        </form>
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
