import cn from "classnames";
import { useState } from "react";
import { AboutTab } from "./AboutTab";
import styles from "./App.module.css";
import { DrillsTab } from "./DrillsTab";
import { MetronomeTab } from "./MetronomeTab";
import { TunerTab } from "./TunerTab";

export function App() {
  const [tab, setTab] = useState(0);

  return (
    <div className={styles.app}>
      <div className={styles.headerRow}>
        <div className={styles.tabsRow}>
          <button
            title="Metronome"
            className={cn(styles.tabButton, tab === 0 && styles.active)}
            onClick={() => setTab(0)}
          >
            {metronome}
          </button>
          <button
            title="Tuner"
            className={cn(styles.tabButton, tab === 1 && styles.active)}
            onClick={() => setTab(1)}
          >
            {tuningFork}
          </button>
          <button
            title="Drills"
            className={cn(styles.tabButton, tab === 2 && styles.active)}
            onClick={() => setTab(2)}
          >
            {musicNote}
          </button>
          <button
            title="About"
            className={cn(styles.tabButton, tab === 3 && styles.active)}
            onClick={() => setTab(3)}
          >
            {question}
          </button>
        </div>
      </div>
      {tab === 0 && <MetronomeTab />}
      {tab === 1 && <TunerTab />}
      {tab === 2 && <DrillsTab />}
      {tab === 3 && <AboutTab />}
    </div>
  );
}

const metronome = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 37 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.3395 5.13375C19.6131 3.62208 17.4606 3.62208 16.7342 5.13376L5.1998 29.137C4.56177 30.4648 5.52939 32.0033 7.00247 32.0033H30.0713C31.5443 32.0033 32.512 30.4648 31.8739 29.137L20.3395 5.13375ZM18.5368 7.33644C17.6338 7.33644 16.9018 8.09807 16.9018 9.0376V12.4399C15.9989 12.4399 15.2669 13.2016 15.2669 14.1411C15.2669 15.0806 15.9989 15.8422 16.9018 15.8422V19.2446C15.9989 19.2446 15.2669 20.0062 15.2669 20.9457C15.2669 21.8853 15.9989 22.6469 16.9018 22.6469V26.0492H12.8145C11.9116 26.0492 11.1796 26.8108 11.1796 27.7504C11.1796 28.6899 11.9116 29.4515 12.8145 29.4515H16.9018H20.1717H24.259C25.162 29.4515 25.894 28.6899 25.894 27.7504C25.894 26.8108 25.162 26.0492 24.259 26.0492H20.1717V22.6469C21.0747 22.6469 21.8066 21.8853 21.8066 20.9457C21.8066 20.0062 21.0747 19.2446 20.1717 19.2446V15.8422C21.0747 15.8422 21.8066 15.0806 21.8066 14.1411C21.8066 13.2016 21.0747 12.4399 20.1717 12.4399V9.0376C20.1717 8.09807 19.4397 7.33644 18.5368 7.33644Z"
      fill="white"
    />
  </svg>
);

const tuningFork = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 37 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 4C11.8954 4 11 4.89543 11 6V14C11 18.1936 13.5495 21.7174 17 22.7165V30C17 31.1046 17.8954 32 19 32C20.1046 32 21 31.1046 21 30V22.7165C24.4505 21.7174 27 18.1936 27 14V6C27 4.89543 26.1046 4 25 4C23.8954 4 23 4.89543 23 6V6.20404V14C23 16.7614 21.2091 19 19 19C16.7909 19 15 16.7614 15 14V6.20404V6C15 4.89543 14.1046 4 13 4Z"
      fill="white"
    />
  </svg>
);

const musicNote = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 37 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="27" r="5" fill="white" />
    <path d="M11 6C11 4.89543 11.8954 4 13 4H15V27H11V6Z" fill="white" />
    <circle cx="26" cy="27" r="5" fill="white" />
    <path d="M27 4H29C30.1046 4 31 4.89543 31 6V27H27V4Z" fill="white" />
    <path
      d="M13 8C11.8954 8 11 7.10457 11 6C11 4.89543 11.8954 4 13 4L29 4C30.1046 4 31 4.89543 31 6C31 7.10457 30.1046 8 29 8L13 8Z"
      fill="white"
    />
  </svg>
);

const question = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 37 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.1271 12.0687C9.45381 12.0687 8.90853 11.5157 9.01285 10.8623C9.66481 6.89333 12.7374 4 18.0692 4C23.4035 4 27 7.17333 27 11.5017C27 14.6377 25.4234 16.8403 22.7563 18.4387C20.1484 19.9763 19.404 21.0473 19.404 23.1287V23.1987C19.404 23.5081 19.2791 23.8048 19.0568 24.0236C18.8345 24.2424 18.533 24.3653 18.2186 24.3653H16.3931C16.0808 24.3653 15.781 24.244 15.5591 24.0278C15.3371 23.8115 15.2108 23.5177 15.2077 23.2103L15.2006 22.7437C15.0987 19.8947 16.3315 18.0747 19.1005 16.4157C21.5425 14.941 22.4125 13.7673 22.4125 11.6837C22.4125 9.39933 20.6155 7.72167 17.8464 7.72167C15.4543 7.72167 13.7924 8.956 13.2518 10.993C13.0953 11.5857 12.5927 12.0687 11.9716 12.0687H10.1271ZM17.2893 32C18.7639 32 19.8853 30.894 19.8853 29.4567C19.8853 28.0147 18.7639 26.9087 17.2893 26.9087C15.8526 26.9087 14.7122 28.0147 14.7122 29.4543C14.7122 30.894 15.8526 32 17.2893 32Z"
      fill="white"
    />
  </svg>
);
