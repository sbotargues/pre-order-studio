"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./TimePickerField.module.scss";
import { useRoomDispatch } from "@/app/context/RoomProvider";

interface TimePickerFieldProps {
  selectedTime: string;
  onChangeTime: (time: string) => void;
  config?: any;
}

const TimePickerField = ({
  selectedTime,
  onChangeTime,
}: TimePickerFieldProps) => {
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const timePickerRef = useRef<HTMLInputElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const { updateFormData } = useRoomDispatch(); // Contexto para actualizar el estado global

  const toggleOpenTimePicker = () => {
    setIsTimePickerOpen((prev) => !prev);
  };

  const closeTimePicker = () => setIsTimePickerOpen(false);

  const [currentHour, currentMinute] = selectedTime.split(":");
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const selectTime = (hour: string | null, minute: string | null) => {
    const newHour = hour ?? currentHour;
    const newMinute = minute ?? currentMinute;
    const newTime = `${newHour}:${newMinute}`;
    onChangeTime(newTime);
    updateFormData("selectedTime", newTime); // Actualiza el estado global
    if (minute) closeTimePicker();
  };

  const renderPopover = () => {
    if (!timePickerRef.current) return null;

    const { bottom, left, width } =
      timePickerRef.current.getBoundingClientRect();

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
          className={styles.timePickerPopover}
          style={{
            top: bottom + window.scrollY + 10,
            left: left + window.scrollX - 55,
            minWidth: width,
          }}
        >
          <div className={styles.scrollContainer}>
            <ul className={styles.scrollList}>
              {hours.map((hour) => (
                <li
                  key={hour}
                  className={`${styles.scrollItem} ${
                    hour === currentHour ? styles.selected : ""
                  }`}
                  onClick={() => selectTime(hour, null)}
                >
                  {hour}
                </li>
              ))}
            </ul>
          </div>
          <span className={styles.separator}>:</span>
          <div className={styles.scrollContainer}>
            <ul className={styles.scrollList}>
              {minutes.map((minute) => (
                <li
                  key={minute}
                  className={`${styles.scrollItem} ${
                    minute === currentMinute ? styles.selected : ""
                  }`}
                  onClick={() => selectTime(null, minute)}
                >
                  {minute}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>,
      document.body
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        timePickerRef.current &&
        !timePickerRef.current.contains(e.target as Node)
      ) {
        closeTimePicker();
      }
    };

    if (isTimePickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTimePickerOpen]);

  return (
    <>
      <input
        type="text"
        value={selectedTime}
        readOnly
        className={styles.timepicker}
        ref={timePickerRef}
        onClick={toggleOpenTimePicker}
      />
      {isTimePickerOpen && renderPopover()}
    </>
  );
};

export default TimePickerField;
