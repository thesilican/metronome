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
  const [previewTempo, setPreviewTempo] = useState(-1);

  // General
  const handleTogglePlaying = useCallback(() => {
    setPlaying(!playing);
  }, [playing]);

  // Slider
  const handleSliderTempoChange = useCallback(
    (tempo: number) => {
      setPlaying(false);
      setPreviewTempo(tempo);
      ticker.play();
    },
    [ticker]
  );
  const handleSliderFinishTempoChange = useCallback(() => {
    setTempo(previewTempo);
    setPreviewTempo(-1);
  }, [previewTempo]);

  // Tempo Typing Listener
  const handleUpdateTypingTempo = useCallback((tempo: number) => {
    setPreviewTempo(tempo);
  }, []);
  const handleFinishTypingTempo = useCallback((finalTempo: number) => {
    const restrictedTempo = Math.max(
      Math.min(finalTempo, Math.max(...commonTempos)),
      Math.min(...commonTempos)
    );
    setTempo(restrictedTempo);
    setPreviewTempo(-1);
  }, []);

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

  console.log(tempo, previewTempo);

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
        metronome={metronome}
        isPreviewTempo={previewTempo !== -1}
        tempo={previewTempo === -1 ? tempo : previewTempo}
        playing={playing}
        onTogglePlaying={handleTogglePlaying}
      />
      <div />
      <TempoSlider
        tempo={tempo}
        previewTempo={previewTempo}
        onUpdateTempo={handleSliderTempoChange}
        onFinishedUpdatingTempo={handleSliderFinishTempoChange}
      />
      <div />
    </div>
  );
}

export default App;
