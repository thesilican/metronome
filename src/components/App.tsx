import questionSvg from "../assets/question.svg";
import tuningForkSvg from "../assets/tuning-fork.svg";
import metronomeSvg from "../assets/metronome.svg";
import { MetronomeControls } from "./MetronomeControls";
import { useState } from "react";
import styles from "./App.module.css";
import { TunerControls } from "./TunerControls";
import cn from "classnames";

export function App() {
  const [tab, setTab] = useState(0);

  return (
    <div className={styles.app}>
      <div className={styles.headerRow}>
        <div className={styles.tabsRow}>
          <button
            className={cn(styles.tabButton, tab === 0 && styles.active)}
            style={{ backgroundImage: `url("${metronomeSvg}")` }}
            onClick={() => setTab(0)}
          />
          <button
            className={cn(styles.tabButton, tab === 1 && styles.active)}
            style={{ backgroundImage: `url("${tuningForkSvg}")` }}
            onClick={() => setTab(1)}
          />
        </div>
        <button
          className={styles.helpButton}
          style={{ backgroundImage: `url("${questionSvg}")` }}
        />
      </div>
      {tab === 0 && <MetronomeControls />}
      {tab === 1 && <TunerControls />}
    </div>
  );
}
