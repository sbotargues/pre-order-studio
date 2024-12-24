"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./DatePickerField.module.scss";

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

interface DatePickerFieldProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
  roomCardRef: React.RefObject<HTMLDivElement>;
}

const DatePickerField = ({
  selectedDate,
  onChangeDate,
  roomCardRef,
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear + i);

  const months = Object.values(MONTHS);

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const toggleDatePicker = () => setIsDatePickerOpen((prev) => !prev);
  const toggleMonthPopover = () => setIsMonthPopoverOpen((prev) => !prev);
  const toggleYearPopover = () => setIsYearPopoverOpen((prev) => !prev);

  const closePopovers = () => {
    setIsMonthPopoverOpen(false);
    setIsYearPopoverOpen(false);
  };

  const closeAll = () => {
    setIsDatePickerOpen(false);
    closePopovers();
  };

  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(
      selectedDate.getFullYear(),
      monthIndex,
      selectedDate.getDate()
    );
    onChangeDate(newDate);
    closePopovers();
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(
      year,
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    onChangeDate(newDate);
    setIsYearPopoverOpen(false); // Solo cierra el popover del año
  };

  const handleDateChange = (day: number) => {
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      day
    );
    onChangeDate(newDate);
    closeAll(); // Cierra todo solo después de seleccionar un día
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
          left: right + window.scrollX - 150,
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

    const totalCells = 42;
    const nextMonthDays = Array.from(
      { length: totalCells - (prevMonthDays.length + currentMonthDays.length) },
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

    const triangle = (
      <div
        className={styles.triangle}
        style={{
          top: bottom + window.scrollY,
          left: leftButton + widthButton / 2,
          transform: "translateX(-50%)",
        }}
      />
    );

    return createPortal(
      <>
        {triangle}{" "}
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
              {months[selectedDate.getMonth()]}
            </div>
            <span className={styles.separator}>→</span>
            <div
              className={styles.headerButton}
              onClick={toggleYearPopover}
              ref={yearButtonRef}
            >
              {selectedDate.getFullYear()}
            </div>
          </div>

          {isMonthPopoverOpen && (
            <div ref={monthPopoverRef} className={styles.popover}>
              <ul className={styles.scrollList}>
                {months.map((month, index) => (
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
            </div>
          )}

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
                className={`${styles.day} ${styles.disabled}`}
              >
                {day}
              </div>
            ))}
            {currentMonthDays.map((day) => (
              <div
                key={`current-${day}`}
                className={`${styles.day} ${
                  day === selectedDate.getDate() ? styles.selected : ""
                }`}
                onClick={() => handleDateChange(day)}
              >
                {day}
              </div>
            ))}
            {nextMonthDays.map((day) => (
              <div
                key={`next-${day}`}
                className={`${styles.day} ${styles.disabled}`}
              >
                {day}
              </div>
            ))}
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
  }, [isDatePickerOpen]);

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
