"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import styles from "./GuestsInput.module.scss"
import { useRoomState, useRoomDispatch } from "@/app/context/RoomProvider"
import { Rooms } from "@/app/types/types"

const GuestsInput = () => {
  const [numPersons, setNumPersons] = useState(1)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [showRoomSuggestion, setShowRoomSuggestion] = useState(false)
  const inputRef = useRef<HTMLDivElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const { selectedRoomConfig, selectedRoom } = useRoomState()
  const { selectRoom } = useRoomDispatch()
  const backgroundColor = selectedRoomConfig?.backgroundColor || "#ccc"

  // Configuración de máximo de personas por sala
  const getMaxPersons = () => {
    switch (selectedRoom) {
      case Rooms.ONECSTUDIO:
        return 12
      case Rooms.FOURDSTUDIO:
        return 9
      case Rooms.CUBESTUDIO:
        return 12
      case Rooms.HOMESTUDIO:
        return 4
      default:
        return 12
    }
  }

  const maxPersons = getMaxPersons()

  const togglePopover = () => setIsPopoverOpen((prev) => !prev)

  const handlePersonSelect = (num: number) => {
    // Si es Home Studio y seleccionan más de 4 personas, mostrar sugerencia
    if (selectedRoom === Rooms.HOMESTUDIO && num > 4) {
      setShowRoomSuggestion(true)
      return
    }

    setNumPersons(num)
    setIsPopoverOpen(false)
    setShowRoomSuggestion(false)
  }

  const handleSwitchTo1C = () => {
    selectRoom(Rooms.ONECSTUDIO)
    setShowRoomSuggestion(false)
    setIsPopoverOpen(false)
  }

  const handleStayInHome = () => {
    setNumPersons(4) // Mantener el máximo del Home Studio
    setShowRoomSuggestion(false)
    setIsPopoverOpen(false)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setIsPopoverOpen(false)
      setShowRoomSuggestion(false)
    }
  }

  useEffect(() => {
    if (isPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isPopoverOpen])

  // Ajustar el número de personas si excede el máximo al cambiar de sala
  useEffect(() => {
    if (numPersons > maxPersons) {
      setNumPersons(maxPersons)
    }
  }, [maxPersons, numPersons])

  const renderPopover = () => {
    if (!inputRef.current) return null

    const { bottom, left, width } = inputRef.current.getBoundingClientRect()

    if (showRoomSuggestion) {
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
            className={styles.suggestionPopover}
            style={{
              top: bottom + window.scrollY + 10,
              left: left + window.scrollX - 100,
              minWidth: width + 100,
            }}
          >
            <div className={styles.suggestionContent}>
              <p className={styles.suggestionTitle}>Para más de 4 personas recomendamos el 1C Studio</p>
              <div className={styles.suggestionButtons}>
                <button
                  className={styles.suggestionButton}
                  onClick={handleSwitchTo1C}
                  style={{ backgroundColor: "#FF9F12" }}
                >
                  Cambiar a 1C Studio
                </button>
                <button className={styles.suggestionButton} onClick={handleStayInHome}>
                  Mantener Home Studio (4 PAX)
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body,
      )
    }

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
            {[...Array(maxPersons)].map((_, i) => {
              const personCount = i + 1

              return (
                <li
                  key={personCount}
                  style={personCount === numPersons ? { backgroundColor: backgroundColor } : {}}
                  className={`${styles.scrollItem} ${personCount === numPersons ? styles.selected : ""}`}
                  onClick={() => handlePersonSelect(personCount)}
                >
                  {personCount} PAX
                </li>
              )
            })}
            {/* Quinta opción para sugerir 1C Studio */}
            {selectedRoom !== Rooms.ONECSTUDIO && selectedRoom === Rooms.HOMESTUDIO &&(
              <li
                className={`${styles.scrollItem} ${styles.suggestionItem}`}
                onClick={() => selectRoom(Rooms.ONECSTUDIO)}
              >
                Para más personas sugerimos el 1C
              </li>
            )}
          </ul>
        </div>
      </>,
      document.body,
    )
  }

  return (
    <div className={styles.guests}>
      <label>Nº PERSONAS* (Máx. {maxPersons})</label>
      <div ref={inputRef} className={styles.guestsInput} onClick={togglePopover}>
        {numPersons} PAX
      </div>
      {(isPopoverOpen || showRoomSuggestion) && renderPopover()}
    </div>
  )
}

export default GuestsInput
