"use client";

import React, { useState, useEffect } from "react";
import styles from "./AccessoriesCard.module.scss";
import Image from "next/image";
import ItemCard from "@/app/components/ItemCard/ItemCard";
import { useRoomDispatch } from "@/app/context/RoomProvider";

interface AccessoryOption {
  title: string;
  price: string;
  details: string[];
  detailsTitle: string[];
  isSelected: boolean;
  image: string;
}

interface AccessoriesCardProps {
  isCollapsed?: boolean;
}

const accessoryOptions: AccessoryOption[] = [
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
  {
    title: "STEAMER",
    price: "10€/día",
    detailsTitle: [],
    details: [],
    isSelected: false,
    image: "/images/steamer.png",
  },
  {
    title: "TRÍPODE",
    price: "8€/día",
    detailsTitle: [],
    details: [],
    isSelected: false,
    image: "/images/tripod.png",
  },
];

const AccessoriesCard: React.FC<AccessoriesCardProps> = ({
  isCollapsed = true,
}) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, boolean>
  >({});

  const { updateFormData } = useRoomDispatch();

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  // Update global context whenever selectedOptions changes
  useEffect(() => {
    updateFormData("accessoryOptions", selectedOptions);
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
        <h3 className={styles.title}>Accesorios</h3>

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
            {accessoryOptions.map((option) => (
              <ItemCard
                key={option.title}
                image={option.image}
                title={option.title}
                price={option.price}
                details={option.details}
                detailsTitle={option.detailsTitle}
                isSelected={selectedOptions[option.title]}
                onToggle={() => handleOptionToggle(option.title)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AccessoriesCard;
