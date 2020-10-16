import React, { Fragment, useCallback, useEffect } from "react";
import { commonTempos, debounce, range } from "../util";

type TempoTypingListenerProps = {
  previewTempo: number;
  onUpdateTempo: (newTempo: number) => void;
  onFinishTempoUpdating: (finalTempo: number) => void;
};

const validKeys = [...range(10).map((x) => "" + x), "Backspace"];

export default function TempoTypingListener(props: TempoTypingListenerProps) {
  const { previewTempo, onUpdateTempo, onFinishTempoUpdating } = props;

  const delayedFinishTempoUpdating = useCallback(
    debounce(onFinishTempoUpdating, 750),
    [onFinishTempoUpdating]
  );

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      const prevTempo = previewTempo === -1 ? 0 : previewTempo;
      if (validKeys.includes(e.key)) {
        let num, newTempo;
        if (e.key === "Backspace") {
          newTempo = Math.floor(prevTempo / 10);
          console.log(newTempo);
        } else {
          num = parseInt(e.key, 10);
          newTempo = prevTempo * 10 + num;
        }
        const restrictedTempo = Math.min(newTempo, 999);
        onUpdateTempo(restrictedTempo);
        delayedFinishTempoUpdating(restrictedTempo);
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [delayedFinishTempoUpdating, onUpdateTempo, previewTempo]);
  return <Fragment />;
}
