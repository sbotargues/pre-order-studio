"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { Rooms } from "../types/types";

interface RoomState {
  selectedRoom: Rooms | null;
  isRoomCollapsed: boolean;
  currentStep: number;
  formData: Record<string, any>; // Datos acumulados del formulario
}

interface RoomDispatch {
  selectRoom: (room: Rooms | null) => void;
  setRoomCollapsed: (collapsed: boolean) => void;
  setCurrentStep: (step: number) => void;
  updateFormData: (field: string, value: any) => void;
  resetFormData: () => void; // Nueva función para resetear los datos del formulario
}

const RoomStateContext = createContext<RoomState | undefined>(undefined);
const RoomDispatchContext = createContext<RoomDispatch | undefined>(undefined);

interface RoomProviderProps {
  children: ReactNode;
}

export const RoomProvider = ({ children }: RoomProviderProps) => {
  const [selectedRoom, setSelectedRoom] = useState<Rooms | null>(null);
  const [isRoomCollapsed, setRoomCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const state = useMemo(
    () => ({ selectedRoom, isRoomCollapsed, currentStep, formData }),
    [selectedRoom, isRoomCollapsed, currentStep, formData]
  );

  const dispatch = useMemo(
    () => ({
      selectRoom: (room: Rooms | null) => setSelectedRoom(room),
      setRoomCollapsed: (collapsed: boolean) => setRoomCollapsed(collapsed),
      setCurrentStep: (step: number) => setCurrentStep(step),
      updateFormData: (field: string, value: any) =>
        setFormData((prev) => ({ ...prev, [field]: value })),
      resetFormData: () => setFormData({}),
    }),
    []
  );

  return (
    <RoomStateContext.Provider value={state}>
      <RoomDispatchContext.Provider value={dispatch}>
        {children}
      </RoomDispatchContext.Provider>
    </RoomStateContext.Provider>
  );
};

export const useRoomState = () => {
  const context = useContext(RoomStateContext);
  if (!context) {
    throw new Error("useRoomState must be used within a RoomProvider");
  }
  return context;
};

export const useRoomDispatch = () => {
  const context = useContext(RoomDispatchContext);
  if (!context) {
    throw new Error("useRoomDispatch must be used within a RoomProvider");
  }
  return context;
};
