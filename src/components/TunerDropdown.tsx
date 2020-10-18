import React, { useEffect, useState } from "react";
import styles from "../styles/TunerDropdown.module.scss";
import cn from "classnames";

type TunerDropdownProps = {
  onStopMetronome: () => void;
};

export default function TunerDropdown(props: TunerDropdownProps) {
  const { onStopMetronome } = props;
  const [shown, setShown] = useState(false);

  const handleShowHide = () => {
    setShown(!shown);
  };

  useEffect(() => {
    if (shown) {
      onStopMetronome();
    }
  }, [shown, onStopMetronome]);

  return (
    <div className={cn(styles.wrapper, { [styles.hidden]: !shown })}>
      <div className={cn(styles.tray)}>
        <div className={cn(styles.tuner)}>
          <h1>Work in progress</h1>
        </div>
        <div className={cn(styles.showHide)} onClick={handleShowHide}>
          <i className="material-icons md-36">
            {shown ? "expand_less" : "expand_more"}
          </i>
          <span className={styles.label}>Tuner</span>
        </div>
      </div>
    </div>
  );
}
