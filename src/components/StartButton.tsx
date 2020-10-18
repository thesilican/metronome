import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";
import styles from "../styles/StartButton.module.scss";
import { Metronome } from "../lib/metronome";

type StartButtonProps = {
  metronome: Metronome;
  playing: boolean;
  tempo: number;
  previewTempo: number;
  onTogglePlaying: () => void;
};

export default function StartButton(props: StartButtonProps) {
  const { playing, tempo, onTogglePlaying, metronome, previewTempo } = props;
  const buttonRef = useRef(null as HTMLDivElement | null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const handler = () => {
      setPulse(true);
    };
    metronome.addEventListener("tick", handler);
    return () => metronome.removeEventListener("tick", handler);
  }, [metronome]);

  useEffect(() => {
    if (pulse) {
      setTimeout(() => setPulse(false), 100);
    }
  }, [pulse]);

  const isPreviewTempo = previewTempo !== -1;
  const displayTempo = isPreviewTempo ? previewTempo : tempo;

  return (
    <div>
      <div
        ref={buttonRef}
        className={cn(styles.StartButton, {
          [styles.play]: playing,
          [styles.pulse]: pulse && !isPreviewTempo,
        })}
        onClick={onTogglePlaying}
      >
        <span className={cn(styles.label, { [styles.large]: isPreviewTempo })}>
          {displayTempo}
        </span>
      </div>
    </div>
  );
}
