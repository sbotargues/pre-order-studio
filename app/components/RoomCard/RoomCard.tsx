"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./RoomCard.module.scss";
import { Rooms } from "@/app/types/types";

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
  const [checkInDate, setCheckInDate] = useState("11/NOV/24");
  const [checkInTime, setCheckInTime] = useState("09:00");
  const [checkOutDate, setCheckOutDate] = useState("11/NOV/24");
  const [checkOutTime, setCheckOutTime] = useState("14:00");
  const [numPersons, setNumPersons] = useState(1);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handlePlusClick = () => {
    onPlusClick(config as unknown as Rooms);
    toggleCollapse();
  };

  return (
    <div
      className={styles.roomCard}
      style={{
        backgroundColor: config.backgroundColor,
      }}
    >
      <div
        className={`${styles.card} ${
          isCollapsed ? styles.collapsed : styles.expanded
        }`}
      >
        <div
          className={`${styles.cardHeader} ${
            config.position === "left"
              ? styles.left
              : config.position === "right"
              ? styles.right
              : styles.center
          }`}
        >
          <Image
            src={config.image}
            alt="Room preview"
            width={config.imageWidth}
            height={config.imageHeight}
            className={styles.roomImage}
          />
          <Image
            onClick={handlePlusClick}
            src="/images/+.png"
            alt="+"
            width={18}
            height={18}
            className={styles.plus}
          />
        </div>

        {!isCollapsed && (
          <div className={styles.cardDetails}>
            <div className={styles.dateTime}>
              <div className={styles.field}>
                <label>CHECK-IN*</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className={styles.datepicker}
                  />
                  <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className={styles.timepicker}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label>CHECK-OUT*</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className={styles.datepicker}
                  />
                  <input
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    className={styles.timepicker}
                  />
                </div>
              </div>
            </div>
            <div className={styles.guests}>
              <label>Nº PERSONAS*</label>
              <input
                type="number"
                value={numPersons}
                onChange={(e) => setNumPersons(Number(e.target.value))}
                className={styles.guestsInput}
                min="1"
                max="10"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
