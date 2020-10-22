import React, { useCallback, useRef } from "react";
import { useDebouncedCallback } from "use-debounce/lib";
import { Ticker } from "../lib/ticker";
import styles from "../styles/TempoSlider.module.scss";
import { closestCommonTempo, commonTempos } from "../util";

type TempoSliderProps = {
  tempo: number;
  previewTempo: number;
  ticker: Ticker;
  onTempoChange: (tempo: number) => void;
  onFinishTempoChange: () => void;
};

export default function TempoSlider(props: TempoSliderProps) {
  const {
    tempo,
    previewTempo,
    ticker,
    onTempoChange,
    onFinishTempoChange,
  } = props;
  const sliderRef = useRef(null as HTMLInputElement | null);

  const handleTempoChange = useCallback(
    (tempo: number) => {
      ticker.play();
      onTempoChange(tempo);
    },
    [onTempoChange, ticker]
  );

  const delayedFinishUpdatingTempo = useDebouncedCallback(() => {
    onFinishTempoChange();
  }, 200);

  const displayTempo = previewTempo === -1 ? tempo : previewTempo;
  const tempoAdjusted = commonTempos.indexOf(closestCommonTempo(displayTempo));
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTempo = commonTempos[parseInt(e.target.value, 10)];
    handleTempoChange(newTempo);
    delayedFinishUpdatingTempo.callback();
  };

  return (
    <div className={styles.wrapper}>
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
