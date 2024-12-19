"use client";

import React, { useEffect } from "react";
import styles from "./page.module.scss";
import Header from "../components/Header/Header";
import StepsHeader from "../components/StepsHeader/StepsHeader";
import RoomCard from "../components/RoomCard/RoomCard";
import { roomConfigurations } from "../constants/roomConfig";
import { useRoomState, useRoomDispatch } from "../context/RoomProvider";
import { Rooms } from "../types/types";

const IndexPage = () => {
  const { selectedRoom, isRoomCollapsed, currentStep } = useRoomState();
  const { selectRoom, setRoomCollapsed, setCurrentStep } = useRoomDispatch();

  useEffect(() => {
    if (isRoomCollapsed) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
  }, [isRoomCollapsed, setCurrentStep]);

  const handlePlusClick = (room: Rooms) => {
    if (selectedRoom === room) {
      selectRoom(null);
      setRoomCollapsed(false);
    } else {
      selectRoom(room);
      setRoomCollapsed(true);
    }
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
    </div>
  );
};

export default IndexPage;
