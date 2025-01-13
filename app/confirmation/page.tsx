"use client";

import React from "react";
import styles from "./confirmation.module.scss";
import Image from "next/image";
import { useRoomState } from "../context/RoomProvider";
import Header from "../components/Header/Header";
import { RoomColors, Rooms } from "../types/types";

const ConfirmationPage = () => {
  const { formData, selectedRoom } = useRoomState();

  const {
    selectedRoomDetails = {},
    checkInDetails = {},
    lightOptions = {},
    accessoryOptions = {},
    backgroundsOptions = {},
    selectedServices = {},
    clientType = "No especificado",
    brandName = "Carmen",
    contactPerson = "No especificado",
    email = "No especificado",
    phone = "No especificado",
  } = formData || {};

  const backgroundColor = selectedRoom
    ? {
        [Rooms.ONECSTUDIO]: RoomColors.ONECSTUDIO,
        [Rooms.FOURDSTUDIO]: RoomColors.FOURDSTUDIO,
        [Rooms.CUBESTUDIO]: RoomColors.CUBESTUDIO,
        [Rooms.HOMESTUDIO]: RoomColors.HOMESTUDIO,
      }[selectedRoom] || "#f5efe2"
    : "#f5efe2";

  console.log({
    selectedRoom,
    checkInDetails,
    lightOptions,
    selectedRoomDetails,
    accessoryOptions,
    backgroundsOptions,
    clientType,
    brandName,
    contactPerson,
    email,
    phone,
    selectedServices,
  });
  return (
    <>
      <Header />
      <div
        className={styles.confirmationContainer}
        style={{ backgroundColor: backgroundColor }}
      >
        <p className={styles.banner}>
          Gracias <span>{brandName}</span>, <br />
          contactaremos contigo ASAP
        </p>

        <div className={styles.content}>
          <div className={styles.header}>
            <Image
              src="/images/LOGO_NEGRO.png"
              alt="Logo"
              width={110}
              height={100}
              className={styles.logo}
            />
            <p className={styles.ticketInfo}>PRE-ORDER Nº0139</p>
          </div>
          <div className={styles.subHeader}>
            <p className={styles.dateTime}>{checkInDetails.checkInTime}</p>
            <p className={styles.dateTime}>{checkInDetails.checkInTime}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationPage;
