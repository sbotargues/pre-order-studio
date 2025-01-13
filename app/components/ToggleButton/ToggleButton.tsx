"use client";

import React from "react";
import styles from "./ToggleButton.module.scss";
import { useRoomState } from "@/app/context/RoomProvider"; // Importar el contexto

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
  const { selectedRoomConfig } = useRoomState();
  const backgroundColor = selectedRoomConfig?.backgroundColor || "#ccc";

  return (
    <div
      className={`${border ? styles.borderToggleButton : styles.toggleButton} ${
        isOn ? styles.on : styles.off
      }`}
      style={isOn ? { backgroundColor } : {}}
      onClick={onToggle}
    >
      <div className={styles.toggleCircle}></div>
    </div>
  );
};

export default ToggleButton;
