"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { useRoomDispatch, useRoomState } from "../../../context/RoomProvider"
import { Rooms } from "../../../types/types"
import styles from "./TimePickerField.module.scss"

interface TimePickerFieldProps {
  selectedTime: string
  onChangeTime: (time: string) => void
  config?: any
  minTime?: string
  maxTime?: string
  isCheckOut?: boolean
  checkInDate?: Date
  checkInTime?: string
  selectedRoom?: Rooms | null
}

const TimePickerField = ({
  selectedTime,
  onChangeTime,
  minTime = "08:00",
  maxTime = "18:00",
  isCheckOut = false,
  checkInDate,
  checkInTime,
  selectedRoom,
}: TimePickerFieldProps) => {
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const timePickerRef = useRef<HTMLInputElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const { updateFormData } = useRoomDispatch()
  const { selectedRoomConfig } = useRoomState()
  const backgroundColor = selectedRoomConfig?.backgroundColor || "#ccc"

  const toggleOpenTimePicker = () => {
    setIsTimePickerOpen((prev) => !prev)
  }

  const closeTimePicker = () => setIsTimePickerOpen(false)

  // Generar slots de tiempo cada 30 minutos entre minTime y maxTime
  const generateTimeSlots = () => {
    const slots: string[] = []
    const [minHour, minMinute] = minTime.split(":").map(Number)
    const [maxHour, maxMinute] = maxTime.split(":").map(Number)

    const startTime = minHour * 60 + minMinute
    const endTime = maxHour * 60 + maxMinute

    for (let time = startTime; time <= endTime; time += 30) {
      const hours = Math.floor(time / 60)
      const minutes = time % 60
      slots.push(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`)
    }

    return slots
  }

  // Filtrar slots disponibles para check-out
  const getAvailableSlots = () => {
    const allSlots = generateTimeSlots()

    if (!isCheckOut || !checkInDate || !checkInTime) {
      return allSlots
    }

    // Configuración de duración mínima por sala
    const getMinimumDuration = () => {
      switch (selectedRoom) {
        case Rooms.ONECSTUDIO:
          return 3 // 3 horas mínimo
        case Rooms.HOMESTUDIO:
          return 2 // 2 horas mínimo (corregido)
        default:
          return 2 // 2 horas mínimo para 4D y Cube
      }
    }

    const checkInDateTime = new Date(checkInDate)
    const [inHours, inMinutes] = checkInTime.split(":").map(Number)
    checkInDateTime.setHours(inHours, inMinutes, 0, 0)

    const minDuration = getMinimumDuration()
    const minCheckOutTime = new Date(checkInDateTime.getTime() + minDuration * 60 * 60 * 1000)

    return allSlots.filter((slot) => {
      const [hours, minutes] = slot.split(":").map(Number)
      const slotTime = new Date(checkInDate)
      slotTime.setHours(hours, minutes, 0, 0)

      return slotTime >= minCheckOutTime
    })
  }

  const availableSlots = getAvailableSlots()

  const selectTime = (time: string) => {
    onChangeTime(time)
    updateFormData("selectedTime", time)
    closeTimePicker()
  }

  const renderPopover = () => {
    if (!timePickerRef.current) return null

    const { bottom, left, width } = timePickerRef.current.getBoundingClientRect()

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
            left: left + width / 2 + window.scrollX,
            transform: "translateX(-50%)",
          }}
        >
          <div className={styles.scrollContainer}>
            <ul className={styles.scrollList}>
              {availableSlots.map((slot) => {
                const [hours] = slot.split(":").map(Number)
                const isNightRate = isCheckOut && hours >= 19

                return (
                  <li
                    key={slot}
                    style={slot === selectedTime ? { backgroundColor: backgroundColor } : {}}
                    className={`${styles.scrollItem} ${slot === selectedTime ? styles.selected : ""} ${isNightRate ? styles.nightRate : ""}`}
                    onClick={() => selectTime(slot)}
                    title={isNightRate ? "Tarifa nocturna: +20€/hora" : ""}
                  >
                    {slot} {isNightRate && "🌙"}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </>,
      document.body,
    )
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        timePickerRef.current &&
        !timePickerRef.current.contains(e.target as Node)
      ) {
        closeTimePicker()
      }
    }

    if (isTimePickerOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isTimePickerOpen])

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
  )
}

export default TimePickerField
