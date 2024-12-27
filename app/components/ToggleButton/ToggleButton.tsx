"use client";

import React from "react";
import styles from "./ToggleButton.module.scss";

interface ToggleButtonProps {
  isOn: boolean;
  onToggle: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isOn, onToggle }) => {
  return (
    <div
      className={`${styles.toggleButton} ${isOn ? styles.on : styles.off}`}
      onClick={onToggle}
    >
      <div className={styles.toggleCircle}></div>
    </div>
  );
};

export default ToggleButton;
