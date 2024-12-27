"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./AccessoriesCard.module.scss";
import Image from "next/image";

interface LightOption {
  title: string;
  description: string;
  price: string;
  details: string[];
  isSelected: boolean;
}

interface AccessoriesCardProps {
  isCollapsed?: boolean;
}

const lightOptions: LightOption[] = [
  {
    title: "PACK PROFOTO",
    description: "15€/h",
    price: "15€/h",
    details: [
      "Flash Profoto",
      "Disparador Air Remote Profoto",
      "+2 A ESCOGER:",
      "Softbox Profoto RFI 3’ Octa (90cm)",
      "Softbox Phottix Octa Adpt Profoto (110cm)",
      "Fresnel 6000 con Adapt Profoto",
      "Umbrella Profoto White L",
      "Telá difusora Profoto Umbrella L",
    ],
    isSelected: false,
  },
  {
    title: "PACK LUZ CONTINUA",
    description: "15€/h",
    price: "15€/h",
    details: [
      "Aputure Amaran 200D",
      "NANLITE FORZA 500D",
      "Led Tube Aputure Amaran T4C",
      "LED Panels 3360 Lux/m Duo Color",
      "+2 A ESCOGER:",
      "Softbox rectangular Grid 20x90cm",
      "Zoom Reflector",
      "Mini Octa",
    ],
    isSelected: false,
  },
];

const AccessoriesCard: React.FC<AccessoriesCardProps> = ({
  isCollapsed = true,
}) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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
          <p className={styles.subtitle}>
            (PACK ELINCHROM INCLUIDO EN EL ALQUILER)
            <button className={styles.includeButton}>Ver qué incluye</button>
          </p>
          <div className={styles.options}>
            {lightOptions.map((option) => (
              <div
                key={option.title}
                className={`${styles.option} ${
                  selectedOption === option.title ? styles.selected : ""
                }`}
              >
                <div
                  className={styles.optionHeader}
                  onClick={() => handleOptionToggle(option.title)}
                >
                  <p className={styles.optionTitle}>{option.title}</p>
                  <p className={styles.optionPrice}>{option.description}</p>
                  <input
                    type="checkbox"
                    className={styles.toggleSwitch}
                    checked={selectedOption === option.title}
                    readOnly
                  />
                </div>
                {selectedOption === option.title && (
                  <ul className={styles.details}>
                    {option.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AccessoriesCard;
