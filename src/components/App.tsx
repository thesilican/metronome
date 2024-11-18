import questionSvg from "../assets/question.svg";
import tuningForkSvg from "../assets/tuning-fork.svg";
import metronomeSvg from "../assets/metronome.svg";
import { MetronomeTab } from "./MetronomeTab";
import { useState } from "react";
import styles from "./App.module.css";
import { TunerTab } from "./TunerTab";
import cn from "classnames";
import { AboutTab } from "./AboutTab";

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
          <button
            className={cn(styles.tabButton, tab === 2 && styles.active)}
            style={{ backgroundImage: `url("${questionSvg}")` }}
            onClick={() => setTab(2)}
          />
        </div>
      </div>
      {tab === 0 && <MetronomeTab />}
      {tab === 1 && <TunerTab />}
      {tab === 2 && <AboutTab />}
    </div>
  );
}
