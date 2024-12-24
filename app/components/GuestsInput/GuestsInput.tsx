"use client";

import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./GuestsInput.module.scss";

const GuestsInput = () => {
  const [numPersons, setNumPersons] = useState(1);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null);

  const togglePopover = () => setIsPopoverOpen((prev) => !prev);

  const handlePersonSelect = (num: number) => {
    setNumPersons(num);
    setIsPopoverOpen(false);
  };

  const renderPopover = () => {
    if (!inputRef.current) return null;

    const { bottom, left, width } = inputRef.current.getBoundingClientRect();

    return createPortal(
      <div
        className={styles.popover}
        style={{
          top: bottom + window.scrollY + 5,
          left: left + window.scrollX,
          minWidth: width,
        }}
      >
        <ul className={styles.scrollList}>
          {[...Array(100)].map((_, i) => (
            <li
              key={i + 1}
              className={styles.scrollItem}
              onClick={() => handlePersonSelect(i + 1)}
            >
              {i + 1} PAX
            </li>
          ))}
        </ul>
      </div>,
      document.body
    );
  };

  return (
    <div className={styles.guests}>
      <label>Nº PERSONAS*</label>
      <div
        ref={inputRef}
        className={styles.guestsInput}
        onClick={togglePopover}
      >
        {numPersons} PAX
      </div>
      {isPopoverOpen && renderPopover()}
    </div>
  );
};

export default GuestsInput;
