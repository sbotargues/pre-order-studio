"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { Rooms } from "../types/types";
import { roomConfigurations } from "../constants/roomConfig";

interface RoomState {
  selectedRoom: Rooms | null;
  isRoomCollapsed: boolean;
  currentStep: number;
  formData: Record<string, any>;
  selectedRoomConfig: (typeof roomConfigurations)[Rooms] | null;
}

interface RoomDispatch {
  selectRoom: (room: Rooms | null) => void;
  setRoomCollapsed: (collapsed: boolean) => void;
  setCurrentStep: (step: number) => void;
  updateFormData: (field: string, value: any) => void;
  resetFormData: () => void;
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
  const [selectedRoomConfig, setSelectedRoomConfig] = useState<
    (typeof roomConfigurations)[Rooms] | null
  >(null);

  const state = useMemo(
    () => ({
      selectedRoom,
      isRoomCollapsed,
      currentStep,
      formData,
      selectedRoomConfig,
    }),
    [selectedRoom, isRoomCollapsed, currentStep, formData, selectedRoomConfig]
  );

  const dispatch = useMemo(
    () => ({
      selectRoom: (room: Rooms | null) => {
        setSelectedRoom(room);
        setSelectedRoomConfig(room ? roomConfigurations[room] : null);
      },
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
