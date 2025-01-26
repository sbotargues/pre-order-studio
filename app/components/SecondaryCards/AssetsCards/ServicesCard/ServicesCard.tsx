"use client";

import React, { useState, useEffect } from "react";
import styles from "./ServicesCard.module.scss";
import Image from "next/image";
import ItemCard from "@/app/components/ItemCard/ItemCard";
import { useRoomDispatch } from "@/app/context/RoomProvider";
import { PriceType } from "@/app/types/types";

interface ServicesOption {
  title: string;
  price: number;
  priceType?: string;
  details: string[];
  detailsTitle: string[];
  isSelected: boolean;
  image: string;
  marginBlockStart?: string;
  width?: string;
}

interface ServicesCardProps {
  isCollapsed?: boolean;
}

const servicesOptions: ServicesOption[] = [
  {
    title: "CÁTERING BÁSICO",
    price: 15,
    priceType: PriceType.PAX,
    detailsTitle: [],
    details: [],
    isSelected: false,
    image: "/images/myfuckingstudio_CATERING.png",
    width: "90%",
  },
  {
    title: "ASISTENTE FULLTIME",
    price: 300,
    priceType: PriceType.NormalWithExcepction,
    detailsTitle: [],
    details: [],
    isSelected: false,
    image: "/images/myfuckingstudio_ASISTENTE.png",
    width: "90%",
  },
];

const ServicesCard: React.FC<ServicesCardProps> = ({ isCollapsed = true }) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, boolean>
  >({});
  const { updateFormData } = useRoomDispatch();

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  // Sync selected services with global context
  useEffect(() => {
    updateFormData("selectedServices", selectedOptions);
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
    <div className={`${styles.card} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.headerRow} onClick={handleToggleCollapse}>
        <h3 className={styles.title}>Servicios</h3>

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
          <div className={styles.options}>
            {servicesOptions.map((option) => (
              <ItemCard
                key={option.title}
                image={option.image}
                title={option.title}
                price={option.price}
                priceType={option.priceType}
                details={option.details}
                detailsTitle={option.detailsTitle}
                isSelected={selectedOptions[option.title] || false}
                onToggle={() => handleOptionToggle(option.title)}
                width={option.width}
              />
            ))}
          </div>
          <p className={styles.aditionalInfo}>
            *Asistente FullTime de Fotografía, iluminación y digitech. Nuestros
            asistentes te acompañarán en todo el proceso para conseguir el mejor
            resultado. Serán tu mano derecha y el respaldo para resolver
            cualquier incidencia que pueda suceder. Precio: desde 300€
            dependiendo del proyecto.
          </p>
        </>
      )}
    </div>
  );
};

export default ServicesCard;
