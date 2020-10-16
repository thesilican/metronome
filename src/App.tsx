import React, { useCallback, useEffect, useMemo, useState } from "react";
import PlayPauseListener from "./components/PlayPauseListener";
import StartButton from "./components/StartButton";
import TempoSlider from "./components/TempoSlider";
import TempoTypingListener from "./components/TempoTypingListener";
import { Prefetch } from "./lib/assets";
import { Metronome, Ticker } from "./lib/metronome";
import "./styles/App.module.scss";
import styles from "./styles/App.module.scss";
import { closestCommonTempo, commonTempos } from "./util";

function App() {
  const [ticker] = useState(useMemo(() => new Ticker(), []));
  const [metronome] = useState(useMemo(() => new Metronome(), []));
  const [playing, setPlaying] = useState(false);
  const [tempo, setTempo] = useState(60);
  const [tempoUpdating, setTempoUpdating] = useState(false);
  const [previewTempo, setPreviewTempo] = useState(-1);

  // General
  const handleStartTempoUpdate = useCallback(() => {
    setTempoUpdating(true);
  }, []);
  const handleFinishTempoUpdate = useCallback(() => {
    setTempoUpdating(false);
  }, []);
  const handleTogglePlaying = useCallback(() => {
    setPlaying(!playing);
  }, [playing]);

  // Slider
  const handleSliderTempoChange = useCallback(
    (tempo: number) => {
      handleStartTempoUpdate();
      setTempo(tempo);
      ticker.play();
    },
    [handleStartTempoUpdate, ticker]
  );

  // Tempo Typing Listener
  const handleUpdateTypingTempo = useCallback((tempo: number) => {
    setTempoUpdating(true);
    setPreviewTempo(tempo);
  }, []);
  const handleFinishTypingTempo = useCallback((finalTempo: number) => {
    const restrictedTempo = Math.max(
      Math.min(finalTempo, Math.max(...commonTempos)),
      Math.min(...commonTempos)
    );
    setTempoUpdating(false);
    setTempo(restrictedTempo);
    setPreviewTempo(-1);
  }, []);

  // Basically init audio whenever possible
  // useEffect(() => {
  //   const events = ["click", "keydown", "wheel"];
  //   const initAudio = () => {
  //     metronome.initAudio();
  //     ticker.initAudio();
  //     events.forEach((evt) => window.removeEventListener(evt, initAudio));
  //   };
  //   events.forEach((evt) => window.addEventListener(evt, initAudio));
  //   return () => {
  //     events.forEach((evt) => window.removeEventListener(evt, initAudio));
  //   };
  // }, [metronome, ticker]);

  // Keypress tempos
  // const delayFinishTempoUpdate = useCallback(
  //   debounce((tempo: number) => {
  //     setTempoUpdating(false);
  //     setTempo(tempo);
  //     setPreviewTempo(0);
  //   }, 500),
  //   []
  // );
  // const validKeys = useMemo(() => range(0, 10).map((x) => x.toString()), []);
  // useEffect(() => {
  //   const onKeypress = (evt: KeyboardEvent) => {
  //     if (previewTempo > 100) return;
  //     if (validKeys.includes(evt.key)) {
  //       setTempoUpdating(true);
  //       const num = parseInt(evt.key, 10);
  //       const newTempo = previewTempo * 10 + num;
  //       setPreviewTempo(previewTempo * 10 + num);
  //       delayFinishTempoUpdate(newTempo);
  //     }
  //   };
  //   window.addEventListener("keydown", onKeypress);
  //   return () => {
  //     window.removeEventListener("keydown", onKeypress);
  //   };
  // }, [delayFinishTempoUpdate, previewTempo, validKeys]);

  // Set metronome and tempo based on result
  useEffect(() => {
    metronome.setTempo(tempo);
  }, [metronome, tempo]);
  useEffect(() => {
    if (playing) {
      metronome.start();
    } else {
      metronome.stop();
    }
  }, [metronome, playing]);

  return (
    <div className={styles.App}>
      <PlayPauseListener onStartStop={handleTogglePlaying} />
      <TempoTypingListener
        previewTempo={previewTempo}
        onFinishTempoUpdating={handleFinishTypingTempo}
        onUpdateTempo={handleUpdateTypingTempo}
      />
      <Prefetch />
      <div />
      <StartButton
        bigNumber={tempoUpdating}
        tempo={previewTempo === -1 ? tempo : previewTempo}
        playing={playing}
        onTogglePlaying={handleTogglePlaying}
      />
      <div />
      <TempoSlider
        tempo={tempo}
        onUpdateTempo={handleSliderTempoChange}
        onFinishedUpdatingTempo={handleFinishTempoUpdate}
      />
      <div />
    </div>
  );
}

export default App;
