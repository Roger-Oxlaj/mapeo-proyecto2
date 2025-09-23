"use client";
import { useEffect, useState } from "react";
import "./registrar.css"; // 👈 Importamos los estilos

export default function RegistrarEmbarazada() {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState({ lat: "", lng: "" });

  useEffect(() => {
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
      Zona: e.target.Zona.value || null,
      Avenida: e.target.Avenida.value || null,
      NumeroCasa: e.target.NumeroCasa.value,
      FotoReferencia: e.target.FotoReferencia.value || null, // ruta o base64
      Latitud: e.target.Latitud.value || null,
      Longitud: e.target.Longitud.value || null,
    };

    if (!/^\d{8}$/.test(data.Telefono)) {
      setError("⚠ El teléfono debe tener exactamente 8 dígitos numéricos");
      return;
    }

    try {
      const res = await fetch("https://backend-demo-xowfm.ondigitalocean.app/embarazadas", {
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
        const result = await res.json();
        setError(result.error || "⚠ Error al registrar embarazada");
      }
    } catch (err) {
      setError("⚠ Error de conexión con el servidor");
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Registrar Embarazada</h1>

      {mensaje && <p className="success-message">{mensaje}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input name="Nombre" placeholder="Nombre" className="input" required />
        <input type="number" name="Edad" placeholder="Edad" className="input" required />
        <input type="text" name="Telefono" placeholder="Teléfono" className="input" required />

        <input name="Calle" placeholder="Calle" className="input" required />
        <input name="Ciudad" placeholder="Ciudad" className="input" required />
        <input name="Departamento" placeholder="Departamento" className="input" required />

        {/* 🔹 Nuevos campos */}
        <input name="Zona" placeholder="Zona (opcional)" className="input" />
        <input name="Avenida" placeholder="Avenida (opcional)" className="input" />
        <input name="NumeroCasa" placeholder="Número de casa" className="input" required />
        <input name="FotoReferencia" placeholder="Foto de referencia (URL o ruta)" className="input" />

        <div className="coord-grid">
          <input
            type="number"
            step="0.000001"
            name="Latitud"
            placeholder="Latitud"
            className="input"
            value={coords.lat}
            onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
          />
          <input
            type="number"
            step="0.000001"
            name="Longitud"
            placeholder="Longitud"
            className="input"
            value={coords.lng}
            onChange={(e) => setCoords({ ...coords, lng: e.target.value })}
          />
        </div>

        <button type="submit" className="btn-submit">
          Guardar
        </button>
      </form>
    </div>
  );
}
