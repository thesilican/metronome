import styles from "./AboutTab.module.css";

export function AboutTab() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Metronome</h1>
      <p>
        by <a href="https://thesilican.com">Bryan Chen</a>
      </p>
      <h2 className={styles.header}>Keyboard Controls</h2>
      <div className={styles.controls}>
        <p>
          <kbd>Space</kbd> - Play/Pause
        </p>
        <p>
          <kbd>Enter</kbd> - Start typing tempo
        </p>
        <p>
          <kbd>0-9</kbd> - Type tempo
        </p>
        <p>
          <kbd>&#8593;</kbd> - Increase tempo
        </p>
        <p>
          <kbd>&#8595;</kbd> - Decrease tempo
        </p>
        <p>
          <kbd>&#8594;</kbd> - Increase tempo step
        </p>
        <p>
          <kbd>&#8596;</kbd> - Decrease tempo step
        </p>
      </div>
    </div>
  );
}
