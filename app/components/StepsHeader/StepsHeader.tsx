"use client";

import React from "react";
import styles from "./StepsHeader.module.scss";
import { RoomColors, Rooms } from "@/app/types/types";

interface StepsHeaderProps {
  currentStep: number;
  selectedRoom: Rooms | null;
}

const StepsHeader: React.FC<StepsHeaderProps> = ({
  currentStep,
  selectedRoom,
}) => {
  const progressMapping = [10, 50, 75, 100];
  const progressPercentage = progressMapping[currentStep];

  const studies = [
    {
      name: "1C Studio",
      room: Rooms.ONECSTUDIO,
      backgroundColor: RoomColors.ONECSTUDIO,
    },
    {
      name: "The Cube",
      room: Rooms.CUBESTUDIO,
      backgroundColor: RoomColors.CUBESTUDIO,
    },
    {
      name: "4D Studio",
      room: Rooms.FOURDSTUDIO,
      backgroundColor: RoomColors.FOURDSTUDIO,
    },
    {
      name: "Home",
      room: Rooms.HOMESTUDIO,
      backgroundColor: RoomColors.HOMESTUDIO,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div
          className={`${styles.progress} ${
            currentStep === 0 ? styles.initialStep : ""
          }`}
          style={{
            backgroundColor:
              currentStep !== 0
                ? studies.find((study) => study.room === selectedRoom)
                    ?.backgroundColor
                : "",
            width: `${progressPercentage}%`,
          }}
        ></div>
      </div>
      {currentStep === 0 ? (
        <p className={styles.title}>
          Tu <span>pre-order*</span> en menos de 1 minuto y sin tarjeta de
          crédito
        </p>
      ) : (
        <div className={styles.buttons}>
          {studies.map((study) => (
            <button
              key={study.room}
              className={`${styles.button} ${
                selectedRoom === study.room ? styles.activeButton : ""
              }`}
              style={{
                backgroundColor:
                  selectedRoom === study.room
                    ? study.backgroundColor
                    : "transparent",
              }}
            >
              {study.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepsHeader;
