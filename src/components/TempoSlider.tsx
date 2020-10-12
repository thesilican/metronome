import React, { useEffect, useRef } from "react";

type TempoSliderProps = {
  tempo: number;
  onUpdateTempo: (tempo: number) => void;
};

export default function TempoSlider(props: TempoSliderProps) {
  const { onUpdateTempo, tempo } = props;
  const sliderRef = useRef(null as HTMLInputElement | null);
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const wheel = (e: WheelEvent) => {
      const newTempo = Math.round((tempo + Math.sign(e.deltaY) * 5) / 5) * 5;
      onUpdateTempo(newTempo);
    };
    slider.addEventListener("wheel", wheel);
    return () => {
      slider.removeEventListener("wheel", wheel);
    };
  }, [sliderRef, tempo, onUpdateTempo]);

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

  return (
    <div>
      <input
        ref={sliderRef}
        type="range"
        min={30}
        max={200}
        value={props.tempo}
        onChange={(e) => props.onUpdateTempo(parseInt(e.target.value, 10))}
      ></input>
    </div>
  );
}
