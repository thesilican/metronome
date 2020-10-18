import React, { useState } from "react";
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

  return !visible ? null : (
    <div onClick={handleClick} className={styles.TickerUnsticker}>
      <span className={styles.label}>Click anywhere to start</span>
    </div>
  );
}
