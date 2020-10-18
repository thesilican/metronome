import React, { Fragment, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce/lib";
import { range } from "../util";

type TempoTypingListenerProps = {
  previewTempo: number;
  onTempoChange: (newTempo: number) => void;
  onFinishTempoChange: () => void;
};

const validKeys = [...range(10).map((x) => "" + x), "Backspace"];

export default function TempoTypingListener(props: TempoTypingListenerProps) {
  const { previewTempo, onTempoChange, onFinishTempoChange } = props;

  const delayedFinishTempoUpdating = useDebouncedCallback(() => {
    onFinishTempoChange();
  }, 750);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (validKeys.includes(e.key)) {
        const prevTempo = previewTempo === -1 ? 0 : previewTempo;
        let num, newTempo;
        if (e.key === "Backspace") {
          newTempo = Math.floor(prevTempo / 10);
          console.log(newTempo);
        } else {
          num = parseInt(e.key, 10);
          newTempo = prevTempo * 10 + num;
        }
        const restrictedTempo = Math.min(newTempo, 999);
        onTempoChange(restrictedTempo);
        delayedFinishTempoUpdating.callback();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [delayedFinishTempoUpdating, onTempoChange, previewTempo]);
  return <Fragment />;
}
