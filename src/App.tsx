import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Metronome } from "./metronome";

const STANDARD_TEMPOS = [
  42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 76, 80, 84, 88, 92,
  96, 100, 104, 108, 112, 116, 120, 126, 132, 138, 144, 152, 160, 168, 176, 184,
  192, 200, 208,
];

const MAX_TEMPO = 999;

const text = localStorage.getItem("metronome-tempo");
const tempo = text ? parseInt(text, 10) : 120;
const METRONOME = new Metronome(tempo);

export function App() {
  const startStopRef = useRef<HTMLButtonElement>(null);
  const tempoValueRef = useRef<HTMLInputElement>(null);
  const tempoSliderRef = useRef<HTMLInputElement>(null);
  const metronomeRef = useRef(METRONOME);
  const [tempo, setTempo] = useState(metronomeRef.current.tempo);
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
    const metronome = metronomeRef.current;
    if (!startStop) {
      return;
    }
    const handleAnimationEnd = (e: AnimationEvent) => {
      if (e.animationName === "pulse") {
        startStop.classList.remove("pulse");
      }
    };
    const handlePulse = () => {
      startStop.classList.add("pulse");
    };
    metronome.addEventListener("pulse", handlePulse);
    startStop.addEventListener("animationend", handleAnimationEnd);
    return () => {
      metronome.stop();
      metronome.removeEventListener("pulse", handlePulse);
      startStop.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [startStopRef, metronomeRef]);

  useEffect(() => {
    metronomeRef.current.setTempo(tempo);
  }, [metronomeRef, tempo]);

  useEffect(() => {
    const metronome = metronomeRef.current;
    if (playing) {
      metronome.start();
    } else {
      metronome.stop();
    }
  }, [metronomeRef, playing]);

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
    <div className="app">
      <div className="controls">
        <div />
        <button
          className="start-stop"
          ref={startStopRef}
          onClick={handleStartStopChange}
          tabIndex={-1}
        >
          {playing ? "Stop" : "Start"}
        </button>
        <div className="tempo-controls" onSubmit={(e) => e.preventDefault()}>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              className="tempo-value"
              type="number"
              ref={tempoValueRef}
              value={tempo === 0 ? "" : tempo}
              onFocus={(e) => e.target.select()}
              onChange={handleTempoInputChange}
              tabIndex={-1}
            />
          </form>
          <input
            className="tempo-slider"
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
    </div>
  );
}
