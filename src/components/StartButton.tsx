import cn from "classnames";
import React, { useEffect, useRef } from "react";
import styles from "../styles/StartButton.module.scss";

type StartButtonProps = {
  onTogglePlaying: () => void;
  bigNumber: boolean;
  tempo: number;
  playing: boolean;
};

export default function StartButton(props: StartButtonProps) {
  const buttonRef = useRef(null as HTMLDivElement | null);
  const { onTogglePlaying } = props;

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

  return (
    <div>
      <div
        ref={buttonRef}
        className={cn(styles.StartButton, { [styles.play]: props.playing })}
        onClick={onTogglePlaying}
      >
        <span className={cn(styles.label, { [styles.large]: props.bigNumber })}>
          {props.tempo}
        </span>
      </div>
    </div>
  );
}
