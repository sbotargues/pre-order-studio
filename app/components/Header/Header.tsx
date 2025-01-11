"use client";

import React from "react";
import Image from "next/image";
import styles from "./Header.module.scss";
import { usePathname } from "next/navigation";
import { RoomColors, Rooms } from "@/app/types/types";
import { useRoomState } from "@/app/context/RoomProvider";

const Header = () => {
  const pathname = usePathname(); // Detecta la ruta actual
  const { selectedRoom } = useRoomState(); // Detecta la sala seleccionada en el estado

  // Define el color del header según la ruta y la sala seleccionada
  const headerColor =
    pathname === "/confirmation"
      ? selectedRoom
        ? {
            [Rooms.ONECSTUDIO]: RoomColors.ONECSTUDIO,
            [Rooms.FOURDSTUDIO]: RoomColors.FOURDSTUDIO,
            [Rooms.CUBESTUDIO]: RoomColors.CUBESTUDIO,
            [Rooms.HOMESTUDIO]: RoomColors.HOMESTUDIO,
          }[selectedRoom] || "#f5efe2"
        : "#f5efe2"
      : "#f5efe2";

  return (
    <div className={styles.container} style={{ backgroundColor: headerColor }}>
      <Image
        src="/images/LOGO_NEGRO.png"
        alt="Logo"
        width={110}
        height={100}
        style={{ objectFit: "contain" }}
      />
      <p className={styles.title}>pre-order*</p>
    </div>
  );
};

export default Header;
