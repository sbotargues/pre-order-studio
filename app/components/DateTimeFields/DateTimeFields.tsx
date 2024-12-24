"use client";

import { useState } from "react";
import CustomDatePicker from "./DatePickerField/DatePickerField";
import TimePickerField from "./TimePickerField/TimePickerField";
import styles from "./DateTimeFields.module.scss";

interface DateTimeFieldsProps {
  roomCardRef: React.RefObject<HTMLDivElement>;
}

const DateTimeFields = ({ roomCardRef }: DateTimeFieldsProps) => {
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState("09:00");
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [checkOutTime, setCheckOutTime] = useState("14:00");

  return (
    <div className={styles.dateTime}>
      {/* CHECK-IN */}
      <div className={styles.field}>
        <label>CHECK-IN*</label>
        <div className={styles.inputGroup}>
          <CustomDatePicker
            selectedDate={checkInDate}
            onChangeDate={setCheckInDate}
            roomCardRef={roomCardRef}
          />
          <TimePickerField
            selectedTime={checkInTime}
            onChangeTime={setCheckInTime}
          />
        </div>
      </div>

      {/* CHECK-OUT */}
      <div className={styles.field}>
        <label>CHECK-OUT*</label>
        <div className={styles.inputGroup}>
          <CustomDatePicker
            selectedDate={checkOutDate}
            onChangeDate={setCheckOutDate}
            roomCardRef={roomCardRef}
          />
          <TimePickerField
            selectedTime={checkOutTime}
            onChangeTime={setCheckOutTime}
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimeFields;
