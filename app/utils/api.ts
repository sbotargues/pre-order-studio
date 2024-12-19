// utils/api.ts

const API_URL = "https://api.holded.com"; // Ajusta esta URL según la documentación de Holded

// Función para obtener la disponibilidad del calendario desde la API de Holded
interface CalendarAvailability {
  // Define the structure of the calendar availability response here
  available: boolean;
  // Add other fields as needed
}

export const getCalendarAvailability = async (date: string): Promise<CalendarAvailability> => {
  try {
    const response = await fetch(
      `${API_URL}/calendar/availability?date=${date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HOLDED_API_KEY}`, // Usa tu clave API de Holded
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener la disponibilidad del calendario.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en la solicitud API:", error);
    throw error;
  }
};

// Función para enviar la información de la reserva a Holded
interface ReservationData {
  // Define the structure of reservationData here
  // Example:
  name: string;
  date: string;
  // Add other fields as needed
}

interface ReservationResponse {
  // Define the structure of the response here
  // Example:
  success: boolean;
  message: string;
  // Add other fields as needed
}

export const submitReservation = async (reservationData: ReservationData): Promise<ReservationResponse> => {
  try {
    const response = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HOLDED_API_KEY}`, // Usa tu clave API de Holded
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      throw new Error("Error al enviar la reserva.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en la solicitud API:", error);
    throw error;
  }
};
