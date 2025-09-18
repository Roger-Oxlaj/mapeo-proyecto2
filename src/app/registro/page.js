"use client";
import { useEffect, useState } from "react";

export default function RegistrarEmbarazada() {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState({ lat: "", lng: "" });

  useEffect(() => {
    // Al cargar el formulario, traer las coordenadas del mapa si existen
    const lat = localStorage.getItem("lat");
    const lng = localStorage.getItem("lng");
    if (lat && lng) {
      setCoords({ lat, lng });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    const data = {
      Nombre: e.target.Nombre.value,
      Edad: e.target.Edad.value,
      Telefono: e.target.Telefono.value,
      Calle: e.target.Calle.value,
      Ciudad: e.target.Ciudad.value,
      Departamento: e.target.Departamento.value,
      Latitud: e.target.Latitud.value || null,
      Longitud: e.target.Longitud.value || null,
    };

    // ✅ Validación del teléfono (exactamente 8 dígitos)
    if (!/^\d{8}$/.test(data.Telefono)) {
      setError("⚠ El teléfono debe tener exactamente 8 dígitos numéricos");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/embarazadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        setMensaje(result.message);
        e.target.reset();
        localStorage.removeItem("lat");
        localStorage.removeItem("lng");
        setCoords({ lat: "", lng: "" });
      } else {
        const result = await res.json(); // 👈 leer respuesta del backend
        setError(result.error || "⚠ Error al registrar embarazada");
      }
    } catch (err) {
      setError("⚠ Error de conexión con el servidor");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">
        Registrar Embarazada
      </h1>

      {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Datos personales */}
        <input name="Nombre" placeholder="Nombre" className="w-full border p-2 rounded text-gray-900" required />
        <input type="number" name="Edad" placeholder="Edad" className="w-full border p-2 rounded text-gray-900" required />
        <input type="text" name="Telefono" placeholder="Teléfono" className="w-full border p-2 rounded text-gray-900" required />

        {/* Dirección */}
        <input name="Calle" placeholder="Calle" className="w-full border p-2 rounded text-gray-900" required />
        <input name="Ciudad" placeholder="Ciudad" className="w-full border p-2 rounded text-gray-900" required />
        <input name="Departamento" placeholder="Departamento" className="w-full border p-2 rounded text-gray-900" required />

        {/* Coordenadas */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            step="0.000001"
            name="Latitud"
            placeholder="Latitud"
            className="w-full border p-2 rounded text-gray-900"
            value={coords.lat}
            onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
          />
          <input
            type="number"
            step="0.000001"
            name="Longitud"
            placeholder="Longitud"
            className="w-full border p-2 rounded text-gray-900"
            value={coords.lng}
            onChange={(e) => setCoords({ ...coords, lng: e.target.value })}
          />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Guardar
        </button>
      </form>
    </div>
  );
}
