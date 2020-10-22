import React, { useCallback, useEffect, useState } from "react";
import { Metronome } from "../lib/metronome";
import { Ticker } from "../lib/ticker";
import styles from "../styles/TickerUnsticker.module.scss";

type TickerUnsticker = {
  ticker: Ticker;
  metronome: Metronome;
};

export default function TickerUnsticker(props: TickerUnsticker) {
  const { ticker, metronome } = props;
  const [visible, setVisible] = useState(true);

  const initAudio = useCallback(() => {
    metronome.initAudio();
    ticker.initAudio();
  }, [metronome, ticker]);

  const handleClick = () => {
    initAudio();
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    const handler = () => {
      initAudio();
      setVisible(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [initAudio, visible]);

  return !visible ? null : (
    <div onClick={handleClick} className={styles.TickerUnsticker}>
      <span className={styles.label}>Click anywhere to start</span>
    </div>
  );
}
