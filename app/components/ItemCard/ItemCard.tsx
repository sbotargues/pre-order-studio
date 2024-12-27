"use client";

import React from "react";
import Image from "next/image";
import styles from "./ItemCard.module.scss";
import ToggleButton from "../ToggleButton/ToggleButton";

interface ItemCardProps {
  image: string;
  title: string;
  price: string;
  details: string[];
  detailsTitle: string[];
  isSelected: boolean;
  onToggle: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  image,
  title,
  price,
  details,
  detailsTitle,
  isSelected,
  onToggle,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.itemCard}>
        <Image
          src={image}
          alt={title}
          width={260}
          height={260}
          className={styles.image}
        />

        <div className={styles.details}>
          <div className={styles.toggleWrapper}>
            <ToggleButton isOn={isSelected} onToggle={onToggle} />
          </div>
          <div className={styles.separator}></div>
          <p className={styles.title}>
            {title} <span className={styles.price}>{price}</span>
          </p>
        </div>
      </div>
      <ul className={styles.detailTitle}>
        {detailsTitle.map((detailsTitle, index) => (
          <li key={index}>{detailsTitle}</li>
        ))}
      </ul>
      <ul className={styles.detailDescription}>
        {details.map((detail, index) => (
          <li
            key={index}
            className={detail.includes("+2 A ESCOGER:") ? styles.bold : ""}
          >
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemCard;
