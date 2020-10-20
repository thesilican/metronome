import React, { useEffect } from "react";
import cn from "classnames";
import styles from "../styles/SettingsDropdown.module.scss";

type SettingsDropdownProps = {
  shown: boolean;
  invis: boolean;
  onToggleShow: () => void;
};

export default function SettingsDropdown(props: SettingsDropdownProps) {
  const { shown, onToggleShow, invis } = props;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "o") {
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
        <h1>Options</h1>
        <p>WIP</p>
      </div>
      <div className={cn(styles.showHide)} onClick={onToggleShow}>
        <i className="material-icons md-24">
          {shown ? "expand_less" : "expand_more"}
        </i>
        <span className={styles.label}>Options</span>
      </div>
    </div>
  );
}
