"use client";

import React from "react";
import styles from "./ToggleButton.module.scss";

interface ToggleButtonProps {
  isOn: boolean;
  onToggle: () => void;
  border?: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isOn,
  onToggle,
  border = false,
}) => {
  return (
    <div
      className={`${border ? styles.borderToggleButton : styles.toggleButton} ${
        isOn ? styles.on : styles.off
      }`}
      onClick={onToggle}
    >
      <div className={styles.toggleCircle}></div>
    </div>
  );
};

export default ToggleButton;
