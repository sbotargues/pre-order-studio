import React from "react";
import Image from "next/image";
import styles from "./Header.module.scss";

const Header = () => {
  return (
    <div className={styles.container}>
      <Image
        src="/images/LOGO_NEGRO.png"
        alt="Logo"
        width={110}
        height={100}
        style={{ objectFit: "contain" }}
      />
      <p className={styles.title}>pre-order*</p>
    </div>
  );
};

export default Header;
