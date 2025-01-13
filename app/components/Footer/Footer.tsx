"use client";

import React from "react";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>
        <a href="tel:+34657942772" target="_blank" rel="noopener noreferrer">
          +34 657 942 772
        </a>
      </p>
      <p className={styles.title}>
        <a
          href="mailto:your-email@example.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          EMAIL
        </a>
      </p>
      <p className={styles.title}>
        <a
          href="https://www.tiktok.com/@myfuckingstudio.bcn"
          target="_blank"
          rel="noopener noreferrer"
        >
          TIKTOK
        </a>
      </p>
      <p className={styles.title}>
        <a
          href="https://www.instagram.com/myfuckingstudio.bcn"
          target="_blank"
          rel="noopener noreferrer"
        >
          INSTAGRAM
        </a>
      </p>
    </div>
  );
};

export default Footer;
