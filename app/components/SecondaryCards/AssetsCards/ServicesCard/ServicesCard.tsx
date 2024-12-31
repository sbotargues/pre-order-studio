"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./ServicesCard.module.scss";
import Image from "next/image";
import ItemCard from "@/app/components/ItemCard/ItemCard";

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

const ServicesCard: React.FC<ServicesCardProps> = ({
  isCollapsed = true,
}) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  useEffect(() => {
    if (!collapsed && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [collapsed]);

  const handleOptionToggle = (optionTitle: string) => {
    setSelectedOption((prev) => (prev === optionTitle ? null : optionTitle));
  };

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${collapsed ? styles.collapsed : ""}`}
    >
      <div className={styles.headerRow} onClick={handleToggleCollapse}>
        <h3 className={styles.title}>Accesorios</h3>

        <Image
          src="/icons/+.png"
          alt="+"
          width={22}
          height={22}
          className={styles.plus}
        />
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

export default ServicesCard;
