import React, { useEffect, useState } from "react";
import ArrowKeyListener from "./components/ArrowKeyListener";
import SpaceKeyListener from "./components/SpaceKeyListener";
import StartButton from "./components/StartButton";
import TempoSlider from "./components/TempoSlider";
import TempoTypingListener from "./components/TempoTypingListener";
import TickerUnsticker from "./components/TickerUnsticker";
import WheelListener from "./components/WheelListener";
import { Metronome, Ticker } from "./lib/metronome";
import styles from "./styles/App.module.scss";

export default function App() {
  const [metronome] = useState(() => new Metronome());
  const [ticker] = useState(() => new Ticker());
  const [tempo, setTempo] = useState(60);
  const [playing, setPlaying] = useState(false);
  const [previewTempo, setPreviewTempo] = useState(-1);

  useEffect(() => {
    metronome.initAudio();
    ticker.initAudio();
  }, [metronome, ticker]);

  useEffect(() => {
    metronome.setTempo(tempo);
  }, [metronome, tempo]);
  useEffect(() => {
    if (playing && previewTempo === -1) {
      metronome.start();
    } else {
      metronome.stop();
    }
  }, [metronome, playing, previewTempo]);

  const handleTogglePlaying = () => {
    setPlaying((playing) => !playing);
  };
  const handleTempoChange = (tempo: number) => {
    setPreviewTempo(tempo);
  };
  const handleFinishTempoChange = () => {
    // Slightly sanitize
    const newTempo = Math.max(1, previewTempo);
    setTempo(newTempo);
    setPreviewTempo(-1);
  };

  return (
    <div className={styles.App}>
      <div />
      <StartButton
        tempo={tempo}
        previewTempo={previewTempo}
        playing={playing}
        onTogglePlaying={handleTogglePlaying}
        metronome={metronome}
      />
      <TempoSlider
        tempo={tempo}
        previewTempo={previewTempo}
        ticker={ticker}
        onTempoChange={handleTempoChange}
        onFinishTempoChange={handleFinishTempoChange}
      />
      <WheelListener
        ticker={ticker}
        tempo={tempo}
        previewTempo={previewTempo}
        onTempoChange={handleTempoChange}
        onFinishTempoChange={handleFinishTempoChange}
      />
      <SpaceKeyListener onStartStop={handleTogglePlaying} />
      <TempoTypingListener
        previewTempo={previewTempo}
        onTempoChange={handleTempoChange}
        onFinishTempoChange={handleFinishTempoChange}
      />
      <ArrowKeyListener
        ticker={ticker}
        tempo={tempo}
        previewTempo={previewTempo}
        onTempoChange={handleTempoChange}
        onFinishTempoChange={handleFinishTempoChange}
      />
      <TickerUnsticker ticker={ticker} />
    </div>
  );
}
