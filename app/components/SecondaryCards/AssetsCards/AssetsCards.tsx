"use client";

import React from "react";
import LightCard from "./LightCard/LightCard";
import AccessoriesCard from "./AccessoriesCard/AccessoriesCard";
// import BackgroundsCard from "./BackgroundsCard/BackgroundsCard";
// import ServicesCard from "./ServicesCard/ServicesCard";
import styles from "./AssetsCards.module.scss";

interface AssetsCardsProps {
  isCollapsed?: boolean;
}

const AssetsCards: React.FC<AssetsCardsProps> = ({ isCollapsed }) => {
  return (
    <div className={styles.assetsCards}>
      <LightCard isCollapsed={isCollapsed} />
      <AccessoriesCard isCollapsed={isCollapsed} />
      {/* <BackgroundsCard isCollapsed={isCollapsed} /> */}
      {/* <ServicesCard isCollapsed={isCollapsed} /> */}
    </div>
  );
};

export default AssetsCards;
