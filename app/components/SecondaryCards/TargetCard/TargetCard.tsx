"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./TargetCard.module.scss";
import { useRoomDispatch, useRoomState } from "@/app/context/RoomProvider";
import Image from "next/image";

export enum CLIENT_TYPES {
  SOY_MARCA = "SOY UNA MARCA",
  SOY_AGENCIA = "SOY UNA AGENCIA/PRODUCTORA",
  SOY_FOTÓGRAFX = "SOY FOTÓGRAFX FREELANCE",
  SOY_ESTUDIANTE = "SOY ESTUDIANTE",
  SOY_DIRE = "SOY DIRE CREATIVX/ESTILISTA",
  SOY_PROD = "SOY PRODUCER FREELANCE",
  OTROS = "OTROS",
}

interface TargetCardProps {
  isCollapsed?: boolean;
  config?: any;
}

const TargetCard: React.FC<TargetCardProps> = ({
  isCollapsed: propCollapsed,
  config,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [step, setStep] = useState(0);
  const { formData } = useRoomState();
  const { updateFormData, setCurrentStep } = useRoomDispatch();

  const cardRef = useRef<HTMLDivElement>(null);
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof propCollapsed === "boolean") {
      setIsCollapsed(propCollapsed);
    }
  }, [propCollapsed]);

  useEffect(() => {
    if (!isCollapsed && step === 1 && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isCollapsed, step]);

  const handleClientTypeClick = (type: string) => {
    updateFormData("clientType", type);
    setStep(1);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleGoBack = () => {
    setStep(0);
  };

  const handleInputChange = (field: string, value: string) => {
    updateFormData(field, value);
  };

  const handleContinue = () => {
    const requiredFields = [
      "brandName",
      "brandInstagram",
      "contactPerson",
      "email",
      "phone",
      "photographerInstagram",
    ];

    const isValid = requiredFields.every((field) => formData[field]?.trim());
    if (!isValid) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const lightCard = document.getElementById("light-card");
    if (lightCard) {
      const yOffset = -500;
      const yPosition =
        lightCard.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: yPosition,
        behavior: "smooth",
      });
    }

    setIsCollapsed(true);
    setCurrentStep(2);
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${
        isCollapsed ? styles.collapsed : styles.uncollapsed
      }`}
    >
      <div className={styles.headerRow} onClick={handleToggleCollapse}>
        {step > 0 && (
          <Image
            src="/icons/up.png"
            alt="down"
            width={11}
            height={11}
            onClick={handleGoBack}
            className={styles.backButton}
          />
        )}
        <h3>
          {isCollapsed || formData.clientType
            ? formData.clientType || "Vale, pero... ¿Quién eres?*"
            : "Vale, pero... ¿Quién eres?*"}
        </h3>

        <Image
          src={`/icons/${isCollapsed ? "down" : "up"}.png`}
          alt={isCollapsed ? "Expandir" : "Colapsar"}
          width={11}
          height={11}
        />
      </div>
      {!isCollapsed && (
        <>
          {step === 0 ? (
            <div className={styles.clientTypeStep}>
              <div className={styles.clientTypeList}>
                {Object.values(CLIENT_TYPES).map((type) => (
                  <div
                    key={type}
                    className={`${styles.clientTypeItem} ${
                      formData.clientType === type ? styles.active : ""
                    }`}
                    onClick={() => handleClientTypeClick(type)}
                  >
                    {type}
                    {type !== CLIENT_TYPES.OTROS && (
                      <div className={styles.linea}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.clientFormStep}>
              <form className={styles.clientForm}>
                <input
                  type="text"
                  placeholder="NOMBRE DE LA MARCA*"
                  value={formData.brandName || ""}
                  onChange={(e) =>
                    handleInputChange("brandName", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="INSTA DE LA MARCA*"
                  value={formData.brandInstagram || ""}
                  onChange={(e) =>
                    handleInputChange("brandInstagram", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="PERSONA DE CONTACTO*"
                  value={formData.contactPerson || ""}
                  onChange={(e) =>
                    handleInputChange("contactPerson", e.target.value)
                  }
                />
                <input
                  type="email"
                  placeholder="CORREO ELECTRÓNICO*"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="TELÉFONO*"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="INSTA DEL FOTÓGRAFX/VIDEÓGRAFX*"
                  value={formData.photographerInstagram || ""}
                  onChange={(e) =>
                    handleInputChange("photographerInstagram", e.target.value)
                  }
                />
                <p>
                  Tranqui, no vamos a vender tus datos para que te llamen a la
                  hora de la siesta, es para poder enviarte el resumen del
                  pedido y ponernos en contacto para confirmar la reserva.
                </p>
                <input
                  className={styles.promoCodeInput}
                  type="text"
                  placeholder="¿TIENES UN CÓDIGO PROMOCIONAL?"
                  value={formData.promoCode || ""}
                  onChange={(e) =>
                    handleInputChange("promoCode", e.target.value)
                  }
                />
              </form>
              <button
                ref={continueButtonRef}
                className={styles.continueButton}
                style={{ backgroundColor: config?.backgroundColor }}
                onClick={handleContinue}
              >
                Continuar
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TargetCard;
