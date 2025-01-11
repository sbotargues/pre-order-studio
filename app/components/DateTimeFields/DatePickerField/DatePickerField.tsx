"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./DatePickerField.module.scss";
import Image from "next/image";
import { useRoomDispatch } from "@/app/context/RoomProvider";

export enum MONTHS {
  ENERO = "ENE",
  FEBRERO = "FEB",
  MARZO = "MAR",
  ABRIL = "ABR",
  MAYO = "MAY",
  JUNIO = "JUN",
  JULIO = "JUL",
  AGOSTO = "AGO",
  SEPTIEMBRE = "SEP",
  OCTUBRE = "OCT",
  NOVIEMBRE = "NOV",
  DICIEMBRE = "DIC",
}

// Lista de nombres completos de los meses
const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

interface DatePickerFieldProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
  roomCardRef: React.RefObject<HTMLDivElement>;
  config: any;
}

const DatePickerField = ({
  selectedDate,
  onChangeDate,
  roomCardRef,
  config,
}: DatePickerFieldProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isMonthPopoverOpen, setIsMonthPopoverOpen] = useState(false);
  const [isYearPopoverOpen, setIsYearPopoverOpen] = useState(false);

  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const yearButtonRef = useRef<HTMLDivElement | null>(null);
  const monthButtonRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const yearPopoverRef = useRef<HTMLDivElement | null>(null);
  const monthPopoverRef = useRef<HTMLDivElement | null>(null);

  const { updateFormData } = useRoomDispatch();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear + i);

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const toggleDatePicker = () => setIsDatePickerOpen((prev) => !prev);
  const toggleMonthPopover = () => setIsMonthPopoverOpen((prev) => !prev);
  const toggleYearPopover = () => setIsYearPopoverOpen((prev) => !prev);

  const closePopovers = () => {
    setIsMonthPopoverOpen(false);
    setIsYearPopoverOpen(false);
  };

  const closeAll = useCallback(() => {
    setIsDatePickerOpen(false);
    closePopovers();
  }, []);

  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(
      selectedDate.getFullYear(),
      monthIndex,
      selectedDate.getDate()
    );
    onChangeDate(newDate);
    updateFormData("selectedDate", newDate);
    closePopovers();
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(
      year,
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    onChangeDate(newDate);
    updateFormData("selectedDate", newDate);
    setIsYearPopoverOpen(false);
  };

  const handleDateChange = (day: number) => {
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      day
    );
    onChangeDate(newDate);
    updateFormData("selectedDate", newDate);
    closeAll();
  };

  const renderYearPopover = () => {
    if (!yearButtonRef.current) return null;

    const { bottom, right } = yearButtonRef.current.getBoundingClientRect();

    return createPortal(
      <div
        ref={yearPopoverRef}
        className={styles.popover}
        style={{
          top: bottom + window.scrollY + 5,
          left: right + window.scrollX - 62,
        }}
      >
        <ul className={styles.scrollList}>
          {years.map((year) => (
            <li
              key={year}
              className={`${styles.scrollItem} ${
                year === selectedDate.getFullYear() ? styles.selected : ""
              }`}
              onClick={() => handleYearChange(year)}
            >
              {year}
            </li>
          ))}
        </ul>
      </div>,
      document.body
    );
  };

  const renderMonthPopover = () => {
    if (!monthButtonRef.current) return null;

    const { bottom, left } = monthButtonRef.current.getBoundingClientRect();
    return createPortal(
      <div
        ref={monthPopoverRef}
        className={styles.popover}
        style={{
          top: bottom + window.scrollY + 5,
          left: left + window.scrollX + 30,
        }}
      >
        <ul className={styles.scrollList}>
          {MONTH_NAMES.map((month, index) => (
            <li
              key={month}
              className={`${styles.scrollItem} ${
                index === selectedDate.getMonth() ? styles.selected : ""
              }`}
              onClick={() => handleMonthChange(index)}
            >
              {month}
            </li>
          ))}
        </ul>
      </div>,
      document.body
    );
  };

  const renderDatePickerPopover = () => {
    const firstDayOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    ).getDay();

    const daysInCurrentMonth = daysInMonth(
      selectedDate.getFullYear(),
      selectedDate.getMonth()
    );

    const daysInPrevMonth = daysInMonth(
      selectedDate.getFullYear(),
      selectedDate.getMonth() - 1
    );

    const prevMonthDays = Array.from(
      { length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 },
      (_, i) => daysInPrevMonth - i
    ).reverse();

    const currentMonthDays = Array.from(
      { length: daysInCurrentMonth },
      (_, i) => i + 1
    );

    const weekDays = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SAB", "DOM"];

    if (!dateInputRef.current) return null;

    const {
      bottom,
      left: leftButton,
      width: widthButton,
    } = dateInputRef.current.getBoundingClientRect();

    if (!roomCardRef.current) return null;

    const { left, width } = roomCardRef.current.getBoundingClientRect();

    return createPortal(
      <>
        <div
          className={styles.triangle}
          style={{
            top: bottom + window.scrollY,
            left: leftButton + widthButton / 2,
            transform: "translateX(-50%)",
          }}
        />
        <div
          ref={calendarRef}
          className={styles.datePickerPopover}
          style={{
            top: bottom + window.scrollY + 10,
            left: left + width / 2,
            width: "95vw",
          }}
        >
          <div className={styles.header}>
            <div
              className={styles.headerButton}
              onClick={toggleMonthPopover}
              ref={monthButtonRef}
            >
              {MONTH_NAMES[selectedDate.getMonth()]}
            </div>
            <Image
              src="/icons/arrow.png"
              alt="down"
              width={13}
              height={13}
              className={styles.arrow}
            />
            <div
              className={styles.headerButton}
              onClick={toggleYearPopover}
              ref={yearButtonRef}
            >
              {selectedDate.getFullYear()}
            </div>
          </div>
          <div className={styles.separator}></div>

          {isMonthPopoverOpen && renderMonthPopover()}

          {isYearPopoverOpen && renderYearPopover()}

          <div className={styles.daysContainer}>
            {weekDays.map((day) => (
              <div key={day} className={styles.weekDay}>
                {day}
              </div>
            ))}
            {prevMonthDays.map((day) => (
              <div
                key={`prev-${day}`}
                className={`${styles.day} ${styles.transparentDay}`}
                style={
                  {
                    "--hover-background-color": config.backgroundColor,
                  } as React.CSSProperties
                }
              >
                {day}
              </div>
            ))}
            {currentMonthDays.map((day) => {
              const today = new Date();
              const isDisabled =
                selectedDate.getFullYear() === today.getFullYear() &&
                selectedDate.getMonth() === today.getMonth() &&
                day < today.getDate();

              return (
                <div
                  key={`current-${day}`}
                  className={`${styles.day} ${
                    isDisabled ? styles.disabled : ""
                  } ${day === selectedDate.getDate() ? styles.selected : ""}`}
                  style={
                    day === selectedDate.getDate()
                      ? { backgroundColor: config.backgroundColor }
                      : {}
                  }
                  onClick={
                    !isDisabled ? () => handleDateChange(day) : undefined
                  }
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </>,
      document.body
    );
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = Object.values(MONTHS)[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !dateInputRef.current?.contains(event.target as Node) &&
        !yearButtonRef.current?.contains(event.target as Node) &&
        !monthButtonRef.current?.contains(event.target as Node) &&
        !yearPopoverRef.current?.contains(event.target as Node) &&
        !monthPopoverRef.current?.contains(event.target as Node)
      ) {
        closeAll();
      }
    };

    if (isDatePickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeAll, isDatePickerOpen]);

  return (
    <div className={styles.datePickerContainer}>
      <input
        type="text"
        readOnly
        value={formatDate(selectedDate)}
        className={styles.datepicker}
        ref={dateInputRef}
        onClick={toggleDatePicker}
      />
      {isDatePickerOpen && renderDatePickerPopover()}
    </div>
  );
};

export default DatePickerField;
