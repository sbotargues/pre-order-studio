"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./GuestsInput.module.scss";

interface GuestsInputProps {
  config: any;
}

const GuestsInput = ({ config }: GuestsInputProps) => {
  const [numPersons, setNumPersons] = useState(1);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const togglePopover = () => setIsPopoverOpen((prev) => !prev);

  const handlePersonSelect = (num: number) => {
    setNumPersons(num);
    setIsPopoverOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setIsPopoverOpen(false);
    }
  };

  useEffect(() => {
    if (isPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopoverOpen]);

  const renderPopover = () => {
    if (!inputRef.current) return null;

    const { bottom, left, width } = inputRef.current.getBoundingClientRect();

    return createPortal(
      <>
        <div
          className={styles.triangle}
          style={{
            top: bottom + window.scrollY,
            left: left + width / 2 + window.scrollX,
            transform: "translateX(-50%)",
          }}
        />
        <div
          ref={popoverRef}
          className={styles.popover}
          style={{
            top: bottom + window.scrollY + 10,
            left: left + window.scrollX - 30,
            minWidth: width,
          }}
        >
          <ul className={styles.scrollList}>
            {[...Array(100)].map((_, i) => (
              <li
                key={i + 1}
                className={`${styles.scrollItem} ${
                  i + 1 === numPersons ? styles.selected : ""
                }`}
                onClick={() => handlePersonSelect(i + 1)}
              >
                {i + 1} PAX
              </li>
            ))}
          </ul>
        </div>
      </>,
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
