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

const CLIENT_FIELDS: Record<
  string,
  { label: string; type: string; options?: string[]; optionsTitle?: string }[]
> = {
  [CLIENT_TYPES.SOY_MARCA]: [
    { label: "NOMBRE DE LA PERSONA DE CONTACTO*", type: "text" },
    {
      label: "CARGO DE LA PERSONA DE CONTACTO*",
      type: "dropdown",
      options: ["Producer", "Marketing", "Fotógrafx", "CEO", "Otros"],
    },
    { label: "INSTA DE LA MARCA*", type: "text" },
    { label: "CORREO ELECTRÓNICO*", type: "email" },
    { label: "TELÉFONO*", type: "tel" },
    { label: "INSTA DEL FOTÓGRAFX/FILMAKER*", type: "text" },
  ],
  [CLIENT_TYPES.SOY_AGENCIA]: [
    { label: "NOMBRE DE LA AGENCIA*", type: "text" },
    { label: "CARGO DE LA PERSONA DE CONTACTO*", type: "dropdown" },
    { label: "CORREO ELECTRÓNICO*", type: "email" },
    { label: "TELÉFONO*", type: "tel" },
  ],
  [CLIENT_TYPES.SOY_ESTUDIANTE]: [
    { label: "NOMBRE Y APELLIDO*", type: "text" },
    { label: "INSTA*", type: "text" },
    { label: "ESCUELA*", type: "text" },
    { label: "ADJUNTA TU CARNET DE ESTUDIANTE*", type: "file" },
    { label: "CORREO ELECTRÓNICO*", type: "email" },
    { label: "TELÉFONO*", type: "tel" },
  ],
};

const TargetCard: React.FC<TargetCardProps> = ({
  isCollapsed: propCollapsed,
  config,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    const handleTouchStart = (e: TouchEvent) => {
      if (e.target instanceof HTMLInputElement) {
        e.preventDefault(); // Desactiva el zoom táctil
      }
    };

    document.addEventListener("touchstart", handleTouchStart);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  useEffect(() => {
    if (!isCollapsed && step === 1 && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isCollapsed, step]);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string) => /^[0-9]{9,15}$/.test(phone);

  const validateFields = () => {
    const currentClientType = formData.clientType;
    const fields = CLIENT_FIELDS[currentClientType] || [];
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.label]?.trim();
      if (!value) {
        newErrors[field.label] = `El campo "${field.label}" es obligatorio.`;
      } else if (field.type === "email" && !validateEmail(value)) {
        newErrors[field.label] = "El correo electrónico no es válido.";
      } else if (field.type === "tel" && !validatePhone(value)) {
        newErrors[field.label] = "El teléfono debe tener entre 9 y 15 dígitos.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClientTypeClick = (type: string) => {
    updateFormData("clientType", type);
    setStep(1);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleInputChange = (field: string, value: string) => {
    updateFormData(field, value);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleContinue = () => {
    if (!validateFields()) return;

    if (cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    setIsCollapsed(true);
    setCurrentStep(2);
  };

  const renderFields = () => {
    const currentClientType = formData.clientType;
    const fields = CLIENT_FIELDS[currentClientType] || [];

    return fields.map((field, index) => (
      <div key={index} className={styles.fieldWrapper}>
        {field.type === "dropdown" && field.options ? (
          <div className={styles.dropdownWrapper}>
            <select
              className={`${styles.input} ${
                errors[field.label] ? styles.errorInput : ""
              }`}
              onChange={(e) => handleInputChange(field.label, e.target.value)}
              value={formData[field.label] || ""}
            >
              <option value="">{field.label}</option>
              {field.options.map((option, optIndex) => (
                <option key={optIndex} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className={styles.dropdownIcon}>
              <Image
                src="/icons/up.png"
                alt="Dropdown Icon"
                width={10}
                height={10}
                className={styles.icon}
              />
            </div>
          </div>
        ) : (
          <input
            type={field.type}
            placeholder={field.label}
            value={formData[field.label] || ""}
            className={`${styles.input} ${
              errors[field.label] ? styles.errorInput : ""
            }`}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
          />
        )}
        {errors[field.label] && (
          <span className={styles.errorText}>{errors[field.label]}</span>
        )}
      </div>
    ));
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
            onClick={() => setStep(0)}
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
              <form className={styles.clientForm}>{renderFields()}</form>
              <p className={styles.aditionalInfo}>
                Tranqui, no vamos a vender tus datos para que te llamen a la
                hora de la siesta, es para poder enviarte el resumen del pedido
                y ponernos en contacto para confirmar la reserva.
              </p>
              <div className={styles.clientForm}>
                <input
                  type="text"
                  placeholder="¿Tienes un código promocional?"
                  value={formData["Código promocional"] || ""}
                  className={styles.input}
                  onChange={(e) =>
                    handleInputChange("Código promocional", e.target.value)
                  }
                />
              </div>
              <button
                ref={continueButtonRef}
                className={styles.continueButton}
                style={{ backgroundColor: config?.backgroundColor }}
                onClick={handleContinue}
              >
                Continuar UPDATE_6
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TargetCard;
