import cn from "classnames";
import React, { useEffect, useState } from "react";
import ArrowKeyListener from "./components/ArrowKeyListener";
import SettingsDropdown from "./components/SettingsDropdown";
import SpaceKeyListener from "./components/SpaceKeyListener";
import StartButton from "./components/StartButton";
import TempoSlider from "./components/TempoSlider";
import TempoTypingListener from "./components/TempoTypingListener";
import TickerUnsticker from "./components/TickerUnsticker";
import TunerDropdown from "./components/TunerDropdown";
import WheelListener from "./components/WheelListener";
import { Metronome } from "./lib/metronome";
import { Ticker } from "./lib/ticker";
import styles from "./styles/App.module.scss";
import { maxTempo, minTempo } from "./util";

export default function App() {
  const [metronome] = useState(() => new Metronome());
  const [ticker] = useState(() => new Ticker());
  const [tempo, setTempo] = useState(60);
  const [playing, setPlaying] = useState(false);
  const [previewTempo, setPreviewTempo] = useState(-1);
  const [tunerShown, setTunerShown] = useState(false);
  const [settingsShown, setSettingsShown] = useState(false);

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
    const newTempo = Math.min(Math.max(previewTempo, minTempo), maxTempo);
    setTempo(newTempo);
    setPreviewTempo(-1);
  };
  const handleToggleTunerShow = () => {
    if (!settingsShown) {
      setTunerShown(!tunerShown);
      setSettingsShown(false);
    }
  };
  const handleToggleSettingsShow = () => {
    if (!tunerShown) {
      setSettingsShown(!settingsShown);
      setTunerShown(false);
    }
  };

  useEffect(() => {
    if (tunerShown) {
      setPlaying(false);
    }
  }, [tunerShown]);

  return (
    <div className={cn(styles.App)}>
      <TickerUnsticker metronome={metronome} ticker={ticker} />
      <div>
        <TunerDropdown
          shown={tunerShown}
          invis={settingsShown}
          onToggleShow={handleToggleTunerShow}
        />
        <SettingsDropdown
          shown={settingsShown}
          invis={tunerShown}
          onToggleShow={handleToggleSettingsShow}
        />
      </div>
      <div
        className={cn(styles.metronome, {
          [styles.shrink]: tunerShown || settingsShown,
        })}
      >
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
      </div>
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
    </div>
  );
}
