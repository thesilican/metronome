import styles from "./AboutTab.module.css";

export function AboutTab() {
  return (
    <div className={styles.page}>
      <p className={styles.title}>Metronome</p>
      <p>
        by <a href="https://thesilican.com">Bryan Chen</a>
      </p>
    </div>
  );
}
