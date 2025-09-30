"use client";
import { useEffect, useState } from "react";
import "./riesgos.css"; // 👈 Importamos los estilos

export default function RiesgosPage() {
  const [riesgos, setRiesgos] = useState([]);
  const [embarazadas, setEmbarazadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar riesgos
  const cargarRiesgos = () => {
    fetch("https://backend-demo-xowfm.ondigitalocean.app/riesgos")
      .then((res) => res.json())
      .then((data) => {
        setRiesgos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Cargar embarazadas
  const cargarEmbarazadas = () => {
    fetch("https://backend-demo-xowfm.ondigitalocean.app/embarazadas")
      .then((res) => res.json())
      .then((data) => setEmbarazadas(data))
      .catch((err) => console.error("⚠ Error cargando embarazadas:", err));
  };

  useEffect(() => {
    cargarRiesgos();
    cargarEmbarazadas();
  }, []);

  if (loading) return <p className="loading">Cargando datos...</p>;
  if (error) return <p className="error">⚠ {error}</p>;

  // Eliminar riesgo
  const eliminar = async (id) => {
    if (!confirm("¿Seguro de eliminar este riesgo?")) return;
    const res = await fetch(`https://backend-demo-xowfm.ondigitalocean.app/riesgos/${id}`, { method: "DELETE" });
    if (res.ok) cargarRiesgos();
    else alert("⚠ Error al eliminar");
  };

  return (
    <div className="riesgos-container">
      <h1 className="riesgos-title">Gestión de Riesgos</h1>

      {/* Formulario de nuevo riesgo */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const data = {
            ID_Embarazada: e.target.ID_Embarazada.value,
            Fecha_Riesgo: e.target.Fecha_Riesgo.value,
            Nivel: e.target.Nivel.value,
          };

          const res = await fetch("https://backend-demo-xowfm.ondigitalocean.app/riesgos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (res.ok) {
            cargarRiesgos();
            e.target.reset();
          } else {
            const errText = await res.text();
            alert("⚠ Error al agregar: " + errText);
          }
        }}
        className="riesgos-form"
      >
        <select name="ID_Embarazada" className="input" required>
          <option value="">Seleccione embarazada</option>
          {embarazadas.map((e) => (
            <option key={e.ID_Embarazada} value={e.ID_Embarazada}>
              {e.Nombre} (Edad {e.Edad})
            </option>
          ))}
        </select>

        <input type="date" name="Fecha_Riesgo" className="input" required />

        <select name="Nivel" className="input" required>
          <option value="Bajo">Bajo</option>
          <option value="Medio">Medio</option>
          <option value="Alto">Alto</option>
        </select>

        <button className="btn-submit">Guardar</button>
      </form>

      {/* Tabla de riesgos */}
      <table className="riesgos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Embarazada</th>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Nivel</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {riesgos.map((r) => (
            <tr key={r.ID_Riesgo}>
              <td>{r.ID_Riesgo}</td>
              <td>{r.ID_Embarazada}</td>
              <td>{r.NombreEmbarazada}</td>
              <td>{r.Fecha_Riesgo}</td>
              <td>{r.Nivel}</td>
              <td>
                <button onClick={() => eliminar(r.ID_Riesgo)} className="btn-delete">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
