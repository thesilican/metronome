import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/StartButton.module.scss";
import cn from "classnames";

type StartButtonProps = {
  tempo: number;
  playing: boolean;
  onClick: () => void;
};

export default function StartButton(props: StartButtonProps) {
  const buttonRef = useRef(null as HTMLButtonElement | null);
  const { onClick } = props;

  useEffect(() => {
    const button = buttonRef.current;
    const onKeyDown = (e: KeyboardEvent) => {
      button?.blur();
      if (e.code === "Space") {
        onClick();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClick]);

  return (
    <div>
      <button
        ref={buttonRef}
        className={cn(styles.StartButton, { [styles.play]: props.playing })}
        onClick={props.onClick}
      >
        {props.tempo}
      </button>
    </div>
  );
}
