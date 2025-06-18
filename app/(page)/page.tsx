"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import styles from "./page.module.scss";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import StepsHeader from "../components/StepsHeader/StepsHeader";
import RoomCard from "../components/RoomCard/RoomCard";
import { roomConfigurations } from "../constants/roomConfig";
import { useRoomState, useRoomDispatch } from "../context/RoomProvider";
import { Rooms } from "../types/types";
import TargetCard from "../components/SecondaryCards/TargetCard/TargetCard";
import AssetsCards from "../components/SecondaryCards/AssetsCards/AssetsCards";

const IndexPage = () => {
  const {
    selectedRoom,
    isRoomCollapsed,
    currentStep,
    formData,
    selectedRoomConfig,
  } = useRoomState();
  const { selectRoom, setRoomCollapsed, setCurrentStep, resetFormData } =
    useRoomDispatch();
  const router = useRouter();

  const handleContinue = () => {
    console.log("Form data to be sent:", formData);

    // Comentar o forzar el paso directo a la página de confirmación
    /* 
    fetch("/api/holded", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Data sent successfully!");
          router.push("/confirmation");
        } else {
          console.error("Failed to send data");
        }
      })
      .catch((error) => console.error("Error sending data:", error));
    */

    // Forzar redirección
    router.push("/confirmation");
  };

  useEffect(() => {
    if (selectedRoom) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
  }, [selectedRoom, setCurrentStep]);

  const handlePlusClick = (room: Rooms) => {
    if (selectedRoom === room) {
      selectRoom(null);
      resetFormData();
      setRoomCollapsed(false);
    } else {
      selectRoom(room);
      setRoomCollapsed(true);
    }
  };

  const renderStep = () => {
    return (
      <>
        <AssetsCards isCollapsed={currentStep !== 2} />
        <TargetCard
          isCollapsed={currentStep <= 2}
          config={selectedRoomConfig}
        />
      </>
    );
  };

  return (
    <div className={styles.page}>
      <Header />
      <StepsHeader currentStep={currentStep} selectedRoom={selectedRoom} />
      <div className={styles.container}>
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
            {renderStep()}
            <button
              style={
                currentStep >= 2
                  ? { backgroundColor: selectedRoomConfig?.backgroundColor }
                  : {}
              }
              className={styles.continueButton}
              onClick={handleContinue}
              disabled={currentStep < 2}
            >
              Enviar
            </button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default IndexPage;
