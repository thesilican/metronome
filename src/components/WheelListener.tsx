import React, { Fragment, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce/lib";
import { Ticker } from "../lib/ticker";
import { nextCommonTempoUp, nextCommonTempoDown } from "../util";

type WheelListenerProps = {
  tempo: number;
  previewTempo: number;
  ticker: Ticker;
  onTempoChange: (tempo: number) => void;
  onFinishTempoChange: () => void;
};

export default function WheelListener(props: WheelListenerProps) {
  const {
    tempo,
    previewTempo,
    onTempoChange,
    onFinishTempoChange,
    ticker,
  } = props;
  const [scrollCounter, setScrollCounter] = useState(0);

  const prevTempo = previewTempo === -1 ? tempo : previewTempo;

  const delayedResetScrollCounter = useDebouncedCallback(() => {
    setScrollCounter(0);
  }, 125);

  const delayedFinishTempoChange = useDebouncedCallback(() => {
    onFinishTempoChange();
  }, 500);

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      const getNextTempo =
        e.deltaY > 0 ? nextCommonTempoUp : nextCommonTempoDown;
      let nextTempo = getNextTempo(prevTempo);
      if (scrollCounter > 2) {
        nextTempo = getNextTempo(nextTempo);
        nextTempo = getNextTempo(nextTempo);
      }
      setScrollCounter((count) => count + 1);
      onTempoChange(nextTempo);
      delayedResetScrollCounter.callback();
      delayedFinishTempoChange.callback();
      ticker.play();
    };
    document.addEventListener("wheel", handler);
    return () => document.removeEventListener("wheel", handler);
  }, [
    delayedFinishTempoChange,
    delayedResetScrollCounter,
    onTempoChange,
    prevTempo,
    scrollCounter,
    ticker,
  ]);

  return <Fragment />;
}
