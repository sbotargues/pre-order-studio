"use client";

import React from "react";
import LightCard from "./LightCard/LightCard";
import AccessoriesCard from "./AccessoriesCard/AccessoriesCard";
import BackgroundsCard from "./BackgroundsCard/BackgroundsCard";
import ServicesCard from "./ServicesCard/ServicesCard";
import styles from "./AssetsCards.module.scss";

interface AssetsCardsProps {
  isCollapsed?: boolean;
  config?: any;
}

const AssetsCards: React.FC<AssetsCardsProps> = ({ isCollapsed, config }) => {
  return (
    <div className={styles.assetsCards}>
      <LightCard isCollapsed={isCollapsed} config={config} />
      <AccessoriesCard isCollapsed={isCollapsed} config={config} />
      <BackgroundsCard isCollapsed={isCollapsed} config={config} />
      <ServicesCard isCollapsed={isCollapsed} config={config} />
    </div>
  );
};

export default AssetsCards;
