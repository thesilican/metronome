import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Metronome } from "../lib/metronome";
import styles from "../styles/StartButton.module.scss";

type StartButtonProps = {
  metronome: Metronome;
  onTogglePlaying: () => void;
  isPreviewTempo: boolean;
  tempo: number;
  playing: boolean;
};

export default function StartButton(props: StartButtonProps) {
  const { onTogglePlaying, metronome } = props;
  const buttonRef = useRef(null as HTMLDivElement | null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        button?.blur();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onTogglePlaying]);

  useEffect(() => {
    const handler = () => {
      console.log("Tick");
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

  console.log(props.isPreviewTempo);

  return (
    <div>
      <div
        ref={buttonRef}
        className={cn(styles.StartButton, {
          [styles.play]: props.playing,
          [styles.pulse]: pulse && !props.isPreviewTempo,
        })}
        onClick={onTogglePlaying}
      >
        <span
          className={cn(styles.label, { [styles.large]: props.isPreviewTempo })}
        >
          {props.tempo}
        </span>
      </div>
    </div>
  );
}
