import React, { useState } from "react";
import { useRouter } from "next/router";
import { useRoomState } from "../context/RoomProvider";

const CheckoutPage = () => {
  const [materials, setMaterials] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const { formData } = useRoomState(); // Obtenemos el estado global
  const router = useRouter();

  const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaterials((prev) =>
      e.target.checked
        ? [...prev, value]
        : prev.filter((item) => item !== value)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirigir a la página de confirmación
    router.push("/confirmation");
  };

  return (
    <div>
      <h1>Revisión y Selección de Materiales</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Materiales</h2>
          <label>
            <input
              type="checkbox"
              value="lighting"
              onChange={handleMaterialChange}
            />
            Iluminación
          </label>
          <label>
            <input
              type="checkbox"
              value="backdrops"
              onChange={handleMaterialChange}
            />
            Fondos
          </label>
          <label>
            <input
              type="checkbox"
              value="accessories"
              onChange={handleMaterialChange}
            />
            Accesorios
          </label>
        </div>

        <div>
          <h2>Materiales Seleccionados</h2>
          <ul>
            {materials.map((material) => (
              <li key={material}>{material}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Extras</h2>
          <p>
            30 MIN. DE ASISTENCIA:{" "}
            {formData.ASISTENCIA_30_MIN ? "Seleccionado" : "No seleccionado"}
          </p>
        </div>

        <div>
          <label htmlFor="service">Selecciona un servicio</label>
          <select
            id="service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
          >
            <option value="">Selecciona un servicio</option>
            <option value="service1">Asistencia Técnica</option>
            <option value="service2">Fotógrafo</option>
          </select>
        </div>

        <button type="submit">Confirmar y Continuar</button>
      </form>
    </div>
  );
};

export default CheckoutPage;
