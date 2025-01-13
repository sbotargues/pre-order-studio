"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Rooms, Position } from "@/app/types/types";
import DateTimeFields from "../DateTimeFields/DateTimeFields";
import GuestsInput from "../GuestsInput/GuestsInput";
import { useRoomDispatch, useRoomState } from "@/app/context/RoomProvider";
import styles from "./RoomCard.module.scss";

interface RoomConfig {
  image: string;
  position: "left" | "center" | "right";
  backgroundColor: string;
  imageWidth: number;
  imageHeight: number;
}

interface RoomCardProps {
  config: RoomConfig;
  onPlusClick: (room: Rooms) => void;
}

const RoomCard = ({ config, onPlusClick }: RoomCardProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { isRoomCollapsed } = useRoomState();
  const { updateFormData } = useRoomDispatch();
  const roomCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isRoomCollapsed) {
      setIsCollapsed(false);
    }
  }, [isRoomCollapsed]);

  useEffect(() => {
    updateFormData("selectedRoomDetails", { ...config });
  }, [config, updateFormData]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
    if (!isCollapsed) {
      onPlusClick(config as unknown as Rooms);
    }
  };

  const handlePlusClick = () => {
    if (isCollapsed) {
      onPlusClick(config as unknown as Rooms);
      toggleCollapse();
    }
  };

  return (
    <div
      ref={roomCardRef}
      className={styles.roomCard}
      style={{ backgroundColor: config.backgroundColor }}
    >
      <div
        className={`${styles.card} ${
          isCollapsed ? styles.collapsed : styles.expanded
        }`}
      >
        <div
          onClick={handlePlusClick}
          className={`${isCollapsed ? styles.cardHeader : styles.upHeader} ${
            config.position === Position.LEFT
              ? styles.left
              : config.position === Position.RIGHT
              ? styles.right
              : styles.center
          }`}
        >
          <Image
            src={config.image}
            alt="Room preview"
            width={config.imageWidth}
            height={config.imageHeight}
            className={styles.image}
          />
          {isCollapsed && (
            <Image
              src="/icons/+.png"
              alt="+"
              width={18}
              height={18}
              className={styles.plus}
            />
          )}
        </div>
        {!isCollapsed && (
          <div className={styles.cardDetails}>
            <DateTimeFields roomCardRef={roomCardRef} config={config} />
            <GuestsInput />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
