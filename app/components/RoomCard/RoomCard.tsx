"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Rooms, Position } from "@/app/types/types";
import DateTimeFields from "../DateTimeFields/DateTimeFields";
import GuestsInput from "../GuestsInput/GuestsInput";
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

  const roomCardRef = useRef<HTMLDivElement | null>(null);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handlePlusClick = () => {
    onPlusClick(config as unknown as Rooms);
    toggleCollapse();
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
        {/* Header */}
        <div
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
              onClick={handlePlusClick}
              src="/icons/+.png"
              alt="+"
              width={18}
              height={18}
              className={styles.plus}
            />
          )}
        </div>

        {/* Details */}
        {!isCollapsed && (
          <div className={styles.cardDetails}>
            <DateTimeFields roomCardRef={roomCardRef}/>
            <GuestsInput />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
