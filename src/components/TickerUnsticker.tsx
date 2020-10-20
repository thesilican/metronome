import React, { useEffect, useState } from "react";
import { Ticker } from "../lib/metronome";
import styles from "../styles/TickerUnsticker.module.scss";

type TickerUnsticker = {
  ticker: Ticker;
};

export default function TickerUnsticker(props: TickerUnsticker) {
  const { ticker } = props;
  const [visible, setVisible] = useState(() => ticker.isStuck());

  const handleClick = () => {
    ticker.unstickAudio();
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    const handler = () => setVisible(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible]);

  return !visible ? null : (
    <div onClick={handleClick} className={styles.TickerUnsticker}>
      <span className={styles.label}>Click anywhere to start</span>
    </div>
  );
}
