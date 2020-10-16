import React, { Fragment, useEffect } from "react";

type PlayPauseListenerProps = {
  onStartStop: () => void;
};

export default function PlayPauseListener(props: PlayPauseListenerProps) {
  const { onStartStop } = props;
  useEffect(() => {
    const handler = (evt: KeyboardEvent) => {
      if (evt.code === "Space") {
        onStartStop();
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [onStartStop]);
  return <Fragment />;
}
