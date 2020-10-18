import React, { Fragment, useEffect } from "react";

type SpaceKeyListenerProps = {
  onStartStop: () => void;
};

export default function SpaceKeyListener(props: SpaceKeyListenerProps) {
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
