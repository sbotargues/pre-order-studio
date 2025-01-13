"use client";

import React, { useState, useEffect } from "react";
import styles from "./ServicesCard.module.scss";
import Image from "next/image";
import ItemCard from "@/app/components/ItemCard/ItemCard";
import { useRoomDispatch } from "@/app/context/RoomProvider";

interface ServicesOption {
  title: string;
  price: string;
  details: string[];
  detailsTitle: string[];
  isSelected: boolean;
  image: string;
}

interface ServicesCardProps {
  isCollapsed?: boolean;
}

const servicesOptions: ServicesOption[] = [
  {
    title: "PACK PROFOTO",
    price: "15€/h",
    detailsTitle: [],
    details: [],
    isSelected: false,
    image: "/images/flashProfoto.png",
  },
  {
    title: "PACK LUZ CONTINUA",
    price: "15€/h",
    detailsTitle: [],
    details: [],
    isSelected: false,
    image: "/images/flashProfoto.png",
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
        <div className={styles.options}>
          {servicesOptions.map((option) => (
            <ItemCard
              key={option.title}
              image={option.image}
              title={option.title}
              price={option.price}
              details={option.details}
              detailsTitle={option.detailsTitle}
              isSelected={selectedOptions[option.title] || false}
              onToggle={() => handleOptionToggle(option.title)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesCard;
