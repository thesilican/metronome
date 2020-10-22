import React, { Fragment, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce/lib";
import { Ticker } from "../lib/ticker";
import { nextCommonTempoDown, nextCommonTempoUp } from "../util";

type ArrowKeyListenerProps = {
  tempo: number;
  ticker: Ticker;
  previewTempo: number;
  onTempoChange: (tempo: number) => void;
  onFinishTempoChange: () => void;
};

export default function ArrowKeyListener(props: ArrowKeyListenerProps) {
  const {
    previewTempo,
    tempo,
    onTempoChange,
    onFinishTempoChange,
    ticker,
  } = props;
  const prevTempo = previewTempo === -1 ? tempo : previewTempo;

  const delayedFinishTempoChange = useDebouncedCallback(() => {
    onFinishTempoChange();
  }, 500);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        const getNextTempo =
          e.key === "ArrowRight" ? nextCommonTempoUp : nextCommonTempoDown;
        let newTempo = getNextTempo(prevTempo);
        if (e.shiftKey) {
          newTempo = getNextTempo(newTempo);
          newTempo = getNextTempo(newTempo);
          newTempo = getNextTempo(newTempo);
        }
        onTempoChange(newTempo);
        delayedFinishTempoChange.callback();
        ticker.play();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return <Fragment />;
}
