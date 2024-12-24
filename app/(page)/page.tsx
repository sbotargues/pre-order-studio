"use client";

import React, { useEffect } from "react";
import styles from "./page.module.scss";
import Header from "../components/Header/Header";
import StepsHeader from "../components/StepsHeader/StepsHeader";
import RoomCard from "../components/RoomCard/RoomCard";
import { roomConfigurations } from "../constants/roomConfig";
import { useRoomState, useRoomDispatch } from "../context/RoomProvider";
import { Rooms } from "../types/types";
import TargetCard from "../components/SecondaryCards/TargetCard/TargetCard";
import LightCard from "../components/SecondaryCards/LightCard/LightCard";

const IndexPage = () => {
  const { selectedRoom, isRoomCollapsed, currentStep } = useRoomState();
  const { selectRoom, setRoomCollapsed, setCurrentStep } = useRoomDispatch();

  useEffect(() => {
    if (selectedRoom) {
      setRoomCollapsed(true);
      setCurrentStep(1);
    } else {
      setRoomCollapsed(false);
      setCurrentStep(0);
    }
  }, [selectedRoom, setRoomCollapsed, setCurrentStep]);

  const handlePlusClick = (room: Rooms) => {
    if (selectedRoom === room) {
      selectRoom(null);
      setRoomCollapsed(false);
    } else {
      selectRoom(room);
      setRoomCollapsed(true);
    }
  };

  console.log("currentStep", currentStep);

  const renderStep = () => {
    return (
      <>
        <TargetCard isCollapsed={currentStep <= 2} />
        <LightCard isCollapsed={currentStep !== 2} />
      </>
    );
  };

  return (
    <div>
      <Header />
      <StepsHeader currentStep={currentStep} selectedRoom={selectedRoom} />
      <div className={styles.section}>
        {Object.keys(roomConfigurations).map((roomKey) => {
          const config = roomConfigurations[roomKey as Rooms];

          if (isRoomCollapsed && selectedRoom !== roomKey) return null;

          return (
            <RoomCard
              key={roomKey}
              config={config}
              onPlusClick={() => handlePlusClick(roomKey as Rooms)}
            />
          );
        })}
      </div>
      {isRoomCollapsed && (
        <div className={styles.stepsContainer}>{renderStep()}</div>
      )}
    </div>
  );
};

export default IndexPage;
