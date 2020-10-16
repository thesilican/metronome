import { networkInterfaces } from "os";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  closestCommonTempo,
  commonTempos,
  debounce,
  nextCommonTempoDown,
  nextCommonTempoUp,
} from "../util";
import styles from "../styles/TempoSlider.module.scss";

type TempoSliderProps = {
  tempo: number;
  onUpdateTempo: (tempo: number) => void;
  onFinishedUpdatingTempo: () => void;
};

export default function TempoSlider(props: TempoSliderProps) {
  const { onUpdateTempo, tempo, onFinishedUpdatingTempo } = props;
  const [scrollCounter, setScrollCounter] = useState(0);
  const sliderRef = useRef(null as HTMLInputElement | null);

  // For accelerated scrolling
  const resetScrollCounter = useCallback(
    debounce(() => {
      setScrollCounter(0);
    }, 125),
    []
  );
  const finishUpdatingTempo = useCallback(
    debounce(() => {
      onFinishedUpdatingTempo();
    }, 200),
    [onFinishedUpdatingTempo]
  );

  // Handle scroll wheeling
  // Including accelerated scrolling
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const wheel = (e: WheelEvent) => {
      const nextFunc = e.deltaY > 0 ? nextCommonTempoUp : nextCommonTempoDown;
      let newTempo = tempo;
      newTempo = nextFunc(newTempo);
      if (scrollCounter > 2) {
        newTempo = nextFunc(newTempo);
        newTempo = nextFunc(newTempo);
      }
      setScrollCounter(scrollCounter + 1);
      onUpdateTempo(newTempo);
      resetScrollCounter();
      finishUpdatingTempo();
    };
    document.addEventListener("wheel", wheel);
    return () => document.removeEventListener("wheel", wheel);
  }, [
    sliderRef,
    tempo,
    onUpdateTempo,
    scrollCounter,
    resetScrollCounter,
    finishUpdatingTempo,
  ]);

  useEffect(() => {
    const slider = sliderRef.current;
    const blur = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        slider?.blur();
      }
    };
    document.addEventListener("keydown", blur);
    return () => {
      document.removeEventListener("keydown", blur);
    };
  }, [sliderRef]);

  const tempoAdjusted = commonTempos.indexOf(closestCommonTempo(tempo));
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTempo = commonTempos[parseInt(e.target.value, 10)];
    onUpdateTempo(newTempo);
    finishUpdatingTempo();
  };

  return (
    <div>
      <input
        className={styles.slider}
        ref={sliderRef}
        type="range"
        min={0}
        max={commonTempos.length - 1}
        value={tempoAdjusted}
        onChange={handleSliderChange}
      ></input>
    </div>
  );
}
