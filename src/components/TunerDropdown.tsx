import cn from "classnames";
import React, { useEffect, useRef } from "react";
import styles from "../styles/TunerDropdown.module.scss";

type TunerDropdownProps = {
  shown: boolean;
  invis: boolean;
  onToggleShow: () => void;
};

export default function TunerDropdown(props: TunerDropdownProps) {
  const { shown, invis, onToggleShow } = props;
  const toggleRef = useRef(null as HTMLDivElement | null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "t") {
        onToggleShow();
      }
      if (e.key === "Escape" && shown) {
        onToggleShow();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onToggleShow, shown]);

  return (
    <div
      className={cn(styles.wrapper, {
        [styles.hidden]: !shown,
        [styles.invis]: !shown && invis,
      })}
    >
      <div className={cn(styles.tray)}>
        <h1>Tuner</h1>
        <p>WIP</p>
      </div>
      <div
        className={cn(styles.showHide)}
        onClick={onToggleShow}
        ref={toggleRef}
      >
        <i className="material-icons md-24">
          {shown ? "expand_less" : "expand_more"}
        </i>
        <span className={styles.label}>Tuner</span>
      </div>
    </div>
  );
}
