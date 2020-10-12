import React, { useCallback, useMemo, useState } from "react";
import StartButton from "./components/StartButton";
import TempoSlider from "./components/TempoSlider";
import { Metronome, Ticker } from "./lib/metronome";
import "./styles/App.module.scss";
import styles from "./styles/App.module.scss";

function App() {
  const [ticker] = useState(useMemo(() => new Ticker(), []));
  const [metronome] = useState(useMemo(() => new Metronome(), []));
  const [playing, setPlaying] = useState(false);
  const [tempo, setTempo] = useState(60);

  const handleTogglePlaying = useCallback(async () => {
    if (!metronome.playing) {
      await metronome.start();
      setPlaying(true);
    } else {
      await metronome.stop();
      setPlaying(false);
    }
  }, [metronome]);
  const handleTempoChange = useCallback(
    (tempo: number) => {
      setTempo(tempo);
      ticker.play();
      metronome.setTempo(tempo);
    },
    [metronome, ticker]
  );

  return (
    <div className={styles.App}>
      <div />
      <StartButton
        tempo={metronome.tempo}
        onClick={handleTogglePlaying}
        playing={playing}
      />
      <div />
      <TempoSlider onUpdateTempo={handleTempoChange} tempo={tempo} />
      <div />
    </div>
  );
}

export default App;
