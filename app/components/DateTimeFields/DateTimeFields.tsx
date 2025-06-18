"use client"

import type React from "react"
import { useState, useEffect } from "react"
import DatePickerField from "./DatePickerField/DatePickerField"
import TimePickerField from "./TimePickerField/TimePickerField"
import { useRoomDispatch, useRoomState } from "../../context/RoomProvider"
import { Rooms } from "../../types/types"
import styles from "./DateTimeFields.module.scss"

interface DateTimeFieldsProps {
  roomCardRef: React.RefObject<HTMLDivElement>
  config: any
  onCheckInChange?: (checkInDetails: {
    checkInDate: Date
    checkInTime: string
    checkOutDate: Date
    checkOutTime: string
    hasNightRate?: boolean
    nightHours?: number
  }) => void
}

const DateTimeFields = ({ roomCardRef, config, onCheckInChange }: DateTimeFieldsProps) => {
  const [checkInDate, setCheckInDate] = useState(new Date())
  const [checkInTime, setCheckInTime] = useState("09:00")
  const [checkOutDate, setCheckOutDate] = useState(new Date())
  const [checkOutTime, setCheckOutTime] = useState("11:00")

  const { updateFormData } = useRoomDispatch()
  const { selectedRoom } = useRoomState()

  // Configuración de duración mínima por sala
  const getMinimumDuration = () => {
    switch (selectedRoom) {
      case Rooms.ONECSTUDIO:
        return 3 // 3 horas mínimo
      case Rooms.HOMESTUDIO:
        return 2 // 2 horas mínimo
      default:
        return 2 // 2 horas mínimo para 4D y Cube
    }
  }

  // Función para calcular el checkout inicial basado en el checkin y duración mínima
  const calculateInitialCheckOut = (checkInTime: string, checkInDate: Date) => {
    const minDuration = getMinimumDuration()
    const checkInDateTime = new Date(checkInDate)
    const [hours, minutes] = checkInTime.split(":").map(Number)
    checkInDateTime.setHours(hours, minutes, 0, 0)

    const checkOutDateTime = new Date(checkInDateTime.getTime() + minDuration * 60 * 60 * 1000)

    return {
      date: new Date(checkOutDateTime),
      time: `${checkOutDateTime.getHours().toString().padStart(2, "0")}:${checkOutDateTime.getMinutes().toString().padStart(2, "0")}`,
    }
  }

  // Inicializar checkout basado en la sala seleccionada
  useEffect(() => {
    if (selectedRoom) {
      const initialCheckOut = calculateInitialCheckOut(checkInTime, checkInDate)
      setCheckOutDate(initialCheckOut.date)
      setCheckOutTime(initialCheckOut.time)
    }
  }, [selectedRoom]) // Solo cuando cambia la sala

  // Función para calcular horas nocturnas (después de las 19:00)
  const calculateNightHours = (checkOutTime: string) => {
    const [hours] = checkOutTime.split(":").map(Number)
    if (hours >= 19) {
      return hours - 19 + (checkOutTime.includes(":30") ? 0.5 : 0)
    }
    return 0
  }

  // Función para calcular el minDate para check-in
  const getCheckInMinDate = () => {
    const now = new Date()
    const currentHour = now.getHours()

    // Si son las 20:00 o después, solo permite desde mañana
    if (currentHour >= 20) {
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      return tomorrow
    }

    // Si es antes de las 20:00, permite desde hoy
    return now
  }

  // Función para calcular el minDate para check-out
  const getCheckOutMinDate = () => {
    return new Date(checkInDate)
  }

  // Función para calcular el minTime para check-out
  const getCheckOutMinTime = () => {
    const checkInDateTime = new Date(checkInDate)
    const [hours, minutes] = checkInTime.split(":").map(Number)
    checkInDateTime.setHours(hours, minutes, 0, 0)

    // Agregar duración mínima
    const minDuration = getMinimumDuration()
    const minCheckOut = new Date(checkInDateTime.getTime() + minDuration * 60 * 60 * 1000)

    return minCheckOut
  }

  // Función para validar y ajustar check-out cuando cambia check-in
  const validateAndAdjustCheckOut = (newCheckInDate: Date, newCheckInTime: string) => {
    const newCheckInDateTime = new Date(newCheckInDate)
    const [hours, minutes] = newCheckInTime.split(":").map(Number)
    newCheckInDateTime.setHours(hours, minutes, 0, 0)

    const currentCheckOutDateTime = new Date(checkOutDate)
    const [outHours, outMinutes] = checkOutTime.split(":").map(Number)
    currentCheckOutDateTime.setHours(outHours, outMinutes, 0, 0)

    // Calcular el mínimo check-out basado en la duración mínima
    const minDuration = getMinimumDuration()
    const minCheckOutDateTime = new Date(newCheckInDateTime.getTime() + minDuration * 60 * 60 * 1000)

    // Si el check-out actual es anterior al mínimo, ajustarlo
    if (
      currentCheckOutDateTime < minCheckOutDateTime ||
      newCheckInDate.toDateString() !== checkOutDate.toDateString()
    ) {
      setCheckOutDate(new Date(newCheckInDate))
      const newCheckOutTime = `${minCheckOutDateTime.getHours().toString().padStart(2, "0")}:${minCheckOutDateTime.getMinutes().toString().padStart(2, "0")}`
      setCheckOutTime(newCheckOutTime)
    }
  }

  // Handlers para check-in
  const handleCheckInDateChange = (date: Date) => {
    setCheckInDate(date)
    validateAndAdjustCheckOut(date, checkInTime)
  }

  const handleCheckInTimeChange = (time: string) => {
    setCheckInTime(time)
    validateAndAdjustCheckOut(checkInDate, time)
  }

  // Handlers para check-out
  const handleCheckOutDateChange = (date: Date) => {
    const minDate = getCheckOutMinDate()
    if (date >= minDate) {
      setCheckOutDate(date)
    } else {
      setCheckOutDate(minDate)
    }
  }

  const handleCheckOutTimeChange = (time: string) => {
    const newCheckOutDateTime = new Date(checkOutDate)
    const [hours, minutes] = time.split(":").map(Number)
    newCheckOutDateTime.setHours(hours, minutes, 0, 0)

    const minCheckOutDateTime = getCheckOutMinTime()

    if (newCheckOutDateTime >= minCheckOutDateTime) {
      setCheckOutTime(time)
    } else {
      const adjustedTime = `${minCheckOutDateTime.getHours().toString().padStart(2, "0")}:${minCheckOutDateTime.getMinutes().toString().padStart(2, "0")}`
      setCheckOutTime(adjustedTime)
    }
  }

  useEffect(() => {
    const nightHours = calculateNightHours(checkOutTime)
    const hasNightRate = nightHours > 0

    const checkInDetails = {
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
      hasNightRate,
      nightHours,
    }

    updateFormData("checkInDetails", checkInDetails)
    onCheckInChange?.(checkInDetails)
  }, [checkInDate, checkInTime, checkOutDate, checkOutTime, updateFormData, onCheckInChange])

  return (
    <div className={styles.dateTime}>
      {/* CHECK-IN */}
      <div className={styles.field}>
        <label>CHECK-IN*</label>
        <div className={styles.inputGroup}>
          <DatePickerField
            selectedDate={checkInDate}
            onChangeDate={handleCheckInDateChange}
            roomCardRef={roomCardRef}
            config={config}
            minDate={getCheckInMinDate()}
          />
          <TimePickerField
            selectedTime={checkInTime}
            onChangeTime={handleCheckInTimeChange}
            config={config}
            minTime="08:00"
            maxTime="18:00"
            isCheckOut={false}
          />
        </div>
      </div>

      {/* CHECK-OUT */}
      <div className={styles.field}>
        <label>CHECK-OUT*</label>
        <div className={styles.inputGroup}>
          <DatePickerField
            selectedDate={checkOutDate}
            onChangeDate={handleCheckOutDateChange}
            roomCardRef={roomCardRef}
            config={config}
            minDate={getCheckOutMinDate()}
          />
          <TimePickerField
            selectedTime={checkOutTime}
            onChangeTime={handleCheckOutTimeChange}
            config={config}
            minTime="08:00"
            maxTime="20:00"
            isCheckOut={true}
            checkInDate={checkInDate}
            checkInTime={checkInTime}
            selectedRoom={selectedRoom}
          />
        </div>
      </div>

      {/* Mostrar aviso de tarifa nocturna si aplica */}
      {calculateNightHours(checkOutTime) > 0 && (
        <div className={styles.nightRateWarning}>
          ⚠️ Tarifa nocturna: +20€/hora después de las 19:00 ({calculateNightHours(checkOutTime)} horas)
        </div>
      )}
    </div>
  )
}

export default DateTimeFields