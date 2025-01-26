"use client";

import React, { useState, useEffect } from "react";
import styles from "./LightCard.module.scss";
import ItemCard from "@/app/components/ItemCard/ItemCard";
import Image from "next/image";
import ToggleButton from "@/app/components/ToggleButton/ToggleButton";
import { useRoomDispatch } from "@/app/context/RoomProvider";
import { PriceType } from "@/app/types/types";

interface LightOption {
  title: string;
  price: number;
  priceType?: string;
  details: string[];
  detailsTitle: string[];
  isSelected: boolean;
  image: string;
  marginBlockStart?: string;
}

interface LightCardProps {
  isCollapsed?: boolean;
  id?: string;
}

const lightOptions: LightOption[] = [
  {
    title: "PACK PROFOTO",
    price: 15,
    detailsTitle: ["(2) Flash Profoto", "(1) Disparador Air Remote Profoto"],
    details: [
      "+2 A ESCOGER:",
      "(1) Softbox Profoto RFI 3’ Octa (90cm)",
      "(1) Softbox Phottix Octa Adpt Profoto (110cm)",
      "(1) Fresnel 6000 con Adapt Profoto",
      "(2) Umbrella Profoto White L",
      "(2) Tela difusora Profoto Umbrella L",
      "(2) Umbrella Profoto White S",
      "(2) Zoom reflector Profoto",
      "(1) ProGlob 360º",
      "(1) Beauty Dish White Profoto + Grid 25º + Difusor",
    ],
    isSelected: false,
    image: "/images/myfuckingstudio_PROFOTO.png",
    marginBlockStart: "-70px",
  },
  {
    title: "PACK LUZ CONTINUA",
    price: 15,
    detailsTitle: [
      "(1) Aputure Amaran 200D",
      "(1) NANLITE FORZA 500D",
      "(1) Led Tube Aputure Amaran T4C 120cm RGB",
      "(3) LED Panels 3360 Lux/m Duo Color and Colored Jellies",
    ],
    details: [
      "+2 A ESCOGER:",
      "(2) Softbox rectangular Grid 20x90cm con montura Bowens y Profoto",
      "(2) Softbox rectangular Grid 35x160cm con montura Bowens y Profoto",
      "(2) Zoom Reflector",
      "(2) Mini Octa",
    ],
    isSelected: false,
    image: "/images/myfuckingstudio_CONTINUA.png",
    marginBlockStart: "-60px",
  },
];

const LightCard: React.FC<LightCardProps> = ({ isCollapsed = true, id }) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, boolean>
  >({});

  const { updateFormData } = useRoomDispatch();

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  // Update the global context whenever selectedOptions changes
  useEffect(() => {
    updateFormData("lightOptions", selectedOptions);
  }, [selectedOptions, updateFormData]);

  const handleOptionToggle = (optionTitle: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionTitle]: !prev[optionTitle],
    }));
  };

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`${styles.card} ${collapsed ? styles.collapsed : ""}`}
      id={id}
    >
      <div className={styles.headerRow} onClick={handleToggleCollapse}>
        <h3 className={styles.title}>Iluminación</h3>

        {collapsed ? (
          <Image
            src="/icons/+.png"
            alt="+"
            width={22}
            height={22}
            className={styles.plus}
          />
        ) : (
          <Image
            src="/icons/-.png"
            alt="-"
            width={11}
            height={11}
            className={styles.minus}
          />
        )}
      </div>
      {!collapsed && (
        <>
          <p className={styles.subtitle}>
            (PACK ELINCHROM INCLUIDO EN EL ALQUILER)
            <button className={styles.includeButton}>Ver qué incluye</button>
          </p>
          <div className={styles.options}>
            {lightOptions.map((option) => (
              <ItemCard
                key={option.title}
                image={option.image}
                title={option.title}
                price={option.price}
                priceType={PriceType.Hour}
                details={option.details}
                marginBlockStart={option.marginBlockStart}
                detailsTitle={option.detailsTitle}
                isSelected={selectedOptions[option.title]}
                onToggle={() => handleOptionToggle(option.title)}
              />
            ))}
          </div>
          <p className={styles.checkInfo}>
            30 MIN. DE ASISTENCIA Y ESQUEMA DE ILUMINACIÓN
            <ToggleButton
              isOn={selectedOptions["ASISTENCIA_30_MIN"] || false}
              onToggle={() => {
                const newValue = !selectedOptions["ASISTENCIA_30_MIN"];
                setSelectedOptions((prev) => ({
                  ...prev,
                  ASISTENCIA_30_MIN: newValue,
                }));
                updateFormData("ASISTENCIA_30_MIN", newValue);
              }}
            />
          </p>

          <p className={styles.aditionalInfo}>
            Asistencia de iluminación de 30 minutos ( 80€ ) orientada a
            fotógrafos y profesionales para montar y diseñar el esquema de
            iluminación. No incluye permanencia de nuestro staff en el set tras
            la instalación, ni solución de problemas durante el shooting.
            Recogida adicional del equipo y plató disponible por 20€ extra.
          </p>
        </>
      )}
    </div>
  );
};

export default LightCard;
