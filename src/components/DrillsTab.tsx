import { useState } from "react";
import "../lib/drills";
import { dailyDrills } from "../lib/drills";
import styles from "./DrillsTab.module.css";

export function DrillsTab() {
  const [drills] = useState(() => {
    const now = new Date();
    const timestamp = now.getTime() - now.getTimezoneOffset() * 60 * 1000;
    const seed = Math.floor(timestamp / 1000 / 60 / 60 / 24);
    return dailyDrills(seed);
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Daily Piano Drills</h1>
      {Object.entries(drills).map(([header, drills]) => (
        <>
          <p className={styles.header}>{header}</p>
          <ul className={styles.list} key={header}>
            {drills.map((drill) => (
              <li key={drill}>{drill}</li>
            ))}
          </ul>
        </>
      ))}
    </div>
  );
}
