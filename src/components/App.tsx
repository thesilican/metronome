import cn from "classnames";
import { useState } from "react";
import { AboutTab } from "./AboutTab";
import styles from "./App.module.css";
import { MetronomeTab } from "./MetronomeTab";
import { TunerTab } from "./TunerTab";

export function App() {
  const [tab, setTab] = useState(0);

  return (
    <div className={styles.app}>
      <div className={styles.headerRow}>
        <div className={styles.tabsRow}>
          <button
            className={cn(styles.tabButton, tab === 0 && styles.active)}
            onClick={() => setTab(0)}
          >
            {metronome}
          </button>
          <button
            className={cn(styles.tabButton, tab === 1 && styles.active)}
            onClick={() => setTab(1)}
          >
            {tuningFork}
          </button>
          <button
            className={cn(styles.tabButton, tab === 2 && styles.active)}
            onClick={() => setTab(2)}
          >
            {question}
          </button>
        </div>
      </div>
      {tab === 0 && <MetronomeTab />}
      {tab === 1 && <TunerTab />}
      {tab === 2 && <AboutTab />}
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

const question = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    fill="white"
    className="bi bi-question-lg"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14"
    />
  </svg>
);
