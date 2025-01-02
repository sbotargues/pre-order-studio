"use client";

import React, { useEffect, useRef } from "react";
import styles from "./page.module.scss";
import Header from "../components/Header/Header";
import StepsHeader from "../components/StepsHeader/StepsHeader";
import RoomCard from "../components/RoomCard/RoomCard";
import { roomConfigurations } from "../constants/roomConfig";
import { useRoomState, useRoomDispatch } from "../context/RoomProvider";
import { Rooms } from "../types/types";
import TargetCard from "../components/SecondaryCards/TargetCard/TargetCard";
import AssetsCards from "../components/SecondaryCards/AssetsCards/AssetsCards";

const IndexPage = () => {
  const { selectedRoom, isRoomCollapsed, currentStep } = useRoomState();
  const { selectRoom, setRoomCollapsed, setCurrentStep } = useRoomDispatch();

  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const handleContinue = () => {
    console.log("Continue");
  };

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

  const renderStep = (config: any) => {
    return (
      <>
        <TargetCard isCollapsed={currentStep <= 2} config={config} />
        <AssetsCards isCollapsed={currentStep !== 2} config={config} />
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
        <>
          {renderStep(roomConfigurations[selectedRoom as Rooms])}
          <button
            ref={continueButtonRef}
            className={styles.continueButton}
            style={{ backgroundColor: roomConfigurations[selectedRoom as Rooms]?.backgroundColor }}
            onClick={handleContinue}
          >
            Enviar
          </button>
        </>
      )}
    </div>
  );
};

export default IndexPage;
