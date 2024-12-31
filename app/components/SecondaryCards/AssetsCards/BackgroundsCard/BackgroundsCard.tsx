"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./BackgroundsCard.module.scss";
import ToggleButton from "@/app/components/ToggleButton/ToggleButton";
import Image from "next/image";

interface BackgroundOptions {
  title: string;
  color: string; // Color for the background
  textColor: string; // Color for the text
}

interface BackgroundsCardProps {
  isCollapsed?: boolean;
}

const backgroundsOptions = [
  {
    title: "S-1 Super White/Super Blanco",
    color: "#FBF9F9",
    textColor: "#000000",
  },
  {
    title: "S-66 Pure White/Blanco Puro",
    color: "#FFFFFF",
    textColor: "#000000",
  },
  { title: "S-50 White/Blanco", color: "#FBF8EC", textColor: "#000000" },
  { title: "S-51 Bone/Hueso", color: "#F2E8E1", textColor: "#000000" },
  { title: "S-53 Pecan/Cappuccino", color: "#CBAD96", textColor: "#000000" },
  { title: "S-19 Egg Nog/Ponche", color: "#E6CFB7", textColor: "#000000" },
  { title: "S-79 Almond/Almendra", color: "#E4B585", textColor: "#000000" },
  { title: "S-76 Mocha/Café", color: "#BE936F", textColor: "#FFFFFF" },
  { title: "S-80 Cocoa/Cacao", color: "#93633F", textColor: "#FFFFFF" },
  { title: "S-17 Sienna", color: "#A05524", textColor: "#FFFFFF" },
  { title: "S-16 Chestnut/Castaña", color: "#773D29", textColor: "#FFFFFF" },
  {
    title: "S-12 Studio Gray/Gris Estudio",
    color: "#C8BFB5",
    textColor: "#000000",
  },
  {
    title: "S-57 Gray Tint/Tinte Gris",
    color: "#C7C6C4",
    textColor: "#000000",
  },
  { title: "S-61 TV Gray", color: "#B6AFA6", textColor: "#000000" },
  { title: "S-60 Focus Gray", color: "#B1B1B1", textColor: "#000000" },
  {
    title: "S-9 Stone Gray/Gris Piedra",
    color: "#A4A4A6",
    textColor: "#000000",
  },
  {
    title: "S-70 Storm Gray/Gris Tormenta",
    color: "#9C948E",
    textColor: "#000000",
  },
  {
    title: "S-56 Fashion Gray/Gris Moda",
    color: "#909092",
    textColor: "#000000",
  },
  {
    title: "S-74 Smoke Gray/Gris Humo",
    color: "#707175",
    textColor: "#000000",
  },
  {
    title: "S-27 Thunder Gray/Gris Trueno",
    color: "#5A5D5A",
    textColor: "#FFFFFF",
  },
  { title: "S-20 Black/Negro", color: "#000000", textColor: "#FFFFFF" },
  {
    title: "S-5 Ultramarine/Ultramarino",
    color: "#365665",
    textColor: "#FFFFFF",
  },
  {
    title: "S-58 Studio Blue/Azul Chroma",
    color: "#4266B0",
    textColor: "#FFFFFF",
  },
  { title: "S-64 Bleu Jean/Lupin", color: "#47698C", textColor: "#FFFFFF" },
  {
    title: "S-30 Gulf Blue/Azul Golfo",
    color: "#4E81AD",
    textColor: "#000000",
  },
  { title: "S-83 Turquoise/Turquesa", color: "#3A8FC8", textColor: "#000000" },
  { title: "S-31 Blue Jay/Lagoon", color: "#219CD7", textColor: "#000000" },
  { title: "S-75 True Blue/Aqua", color: "#27B4D2", textColor: "#000000" },
  {
    title: "S-41 Blue Mist/Azul Niebla",
    color: "#C1DCEA",
    textColor: "#000000",
  },
  { title: "S-2 Sky Blue/Azul Cielo", color: "#83B0B6", textColor: "#000000" },
  { title: "S-47 Baby Blue", color: "#5AC5C4", textColor: "#000000" },
  { title: "S-68 Teal/Verde Azulado", color: "#007872", textColor: "#FFFFFF" },
  { title: "S-18 Evergreen", color: "#014731", textColor: "#FFFFFF" },
  {
    title: "S-46 Tech Green/Verde Chroma",
    color: "#369C47",
    textColor: "#FFFFFF",
  },
  {
    title: "S-40 Mint Green/Verde Menta",
    color: "#A0D187",
    textColor: "#000000",
  },
  {
    title: "S-34 Olive Green/Verde Oliva",
    color: "#838159",
    textColor: "#FFFFFF",
  },
  { title: "S-23 Sea Green/Verde Mar", color: "#BDB887", textColor: "#000000" },
  { title: "S-39 Lemonade/Limonada", color: "#E5D458", textColor: "#000000" },
  {
    title: "S-38 Canary/Amarillo Canario",
    color: "#FCDC48",
    textColor: "#000000",
  },
  { title: "S-4 Sand/Arena", color: "#FFCE40", textColor: "#000000" },
  {
    title: "S-71 Deep Yellow/Amarillo Intenso",
    color: "#FDBA12",
    textColor: "#000000",
  },
  { title: "S-43 Marmalade/Mermelada", color: "#FAA41A", textColor: "#000000" },
  { title: "S-24 Orange/Naranja", color: "#EC7223", textColor: "#000000" },
  { title: "S-82 Tangelo/Mandarin", color: "#E24D25", textColor: "#000000" },
  {
    title: "S-8 Primary Red/Rojo Primario",
    color: "#CA242D",
    textColor: "#FFFFFF",
  },
  { title: "S-6 Crimson/Carmesí", color: "#972E4B", textColor: "#FFFFFF" },
  { title: "S-81 Rustic/Copper", color: "#A04959", textColor: "#FFFFFF" },
  { title: "S-67 Ruby/Damson", color: "#AE4E6F", textColor: "#FFFFFF" },
  { title: "S-92 Flamingo/Flamenco", color: "#D84A5D", textColor: "#000000" },
  { title: "S-37 Tulip/Tulipán", color: "#F06098", textColor: "#000000" },
  { title: "S-91 Plum/Ciruela", color: "#B74D9C", textColor: "#FFFFFF" },
  { title: "S-62 Purple/Púrpura", color: "#5F569E", textColor: "#FFFFFF" },
  { title: "S-29 Orchid/Orquídea", color: "#9290CE", textColor: "#000000" },
  { title: "S-3 Coral", color: "#F8B2BA", textColor: "#000000" },
];

const BackgroundsCard: React.FC<BackgroundsCardProps> = ({
  isCollapsed = true,
}) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, boolean>
  >({});

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!collapsed && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [collapsed]);

  const handleOptionToggle = (title: string) => {
    setSelectedOptions((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${collapsed ? styles.collapsed : ""}`}
    >
      <div
        className={styles.headerRow}
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <h3 className={styles.title}>Fondos</h3>
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
          {backgroundsOptions.map(({ title, color, textColor }) => (
            <div
              key={title}
              className={styles.option}
              style={{ backgroundColor: color, color: textColor }}
            >
              <span className={styles.optionTitle}>{title}</span>
              <ToggleButton
                isOn={selectedOptions[title] || false}
                onToggle={() => handleOptionToggle(title)}
                border
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BackgroundsCard;
