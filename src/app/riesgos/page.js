"use client";
import { useEffect, useState } from "react";
import "./riesgos.css";

export default function RiesgosPage() {
  const [riesgos, setRiesgos] = useState([]);
  const [embarazadas, setEmbarazadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para edición
  const [editando, setEditando] = useState(null);
  const [idEmbarazadaEdit, setIdEmbarazadaEdit] = useState("");
  const [fechaRiesgoEdit, setFechaRiesgoEdit] = useState("");
  const [nivelEdit, setNivelEdit] = useState("");

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
    const res = await fetch(
      `https://backend-demo-xowfm.ondigitalocean.app/riesgos/${id}`,
      { method: "DELETE" }
    );
    if (res.ok) cargarRiesgos();
    else alert("⚠ Error al eliminar");
  };

  // Guardar cambios en edición
  const guardarEdicion = async (e) => {
    e.preventDefault();
    const data = {
      ID_Embarazada: idEmbarazadaEdit,
      Fecha_Riesgo: fechaRiesgoEdit,
      Nivel: nivelEdit,
    };

    const res = await fetch(
      `https://backend-demo-xowfm.ondigitalocean.app/riesgos/${editando}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      alert("✅ Riesgo actualizado correctamente");
      cargarRiesgos();
      setEditando(null);
    } else {
      alert("⚠ Error al actualizar el riesgo");
    }
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

          const res = await fetch(
            "https://backend-demo-xowfm.ondigitalocean.app/riesgos",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          );

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
              <td data-label="ID">{r.ID_Riesgo}</td>
              <td data-label="Embarazada">{r.ID_Embarazada}</td>
              <td data-label="Nombre">{r.NombreEmbarazada}</td>
              <td data-label="Fecha">{r.Fecha_Riesgo}</td>
              <td data-label="Nivel">{r.Nivel}</td>
              <td data-label="Acciones">
                <button
                  onClick={() => {
                    setEditando(r.ID_Riesgo);
                    setIdEmbarazadaEdit(r.ID_Embarazada);
                    setFechaRiesgoEdit(r.Fecha_Riesgo);
                    setNivelEdit(r.Nivel);
                  }}
                  className="btn-edit"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminar(r.ID_Riesgo)}
                  className="btn-delete"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {editando && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Riesgo #{editando}</h3>
            <form onSubmit={guardarEdicion}>
              <label>ID Embarazada:</label>
              <select
                value={idEmbarazadaEdit}
                onChange={(e) => setIdEmbarazadaEdit(e.target.value)}
                className="input"
                required
              >
                <option value="">Seleccione embarazada</option>
                {embarazadas.map((e) => (
                  <option key={e.ID_Embarazada} value={e.ID_Embarazada}>
                    {e.Nombre}
                  </option>
                ))}
              </select>

              <label>Fecha de Riesgo:</label>
              <input
                type="date"
                value={fechaRiesgoEdit}
                onChange={(e) => setFechaRiesgoEdit(e.target.value)}
                className="input"
                required
              />

              <label>Nivel:</label>
              <select
                value={nivelEdit}
                onChange={(e) => setNivelEdit(e.target.value)}
                className="input"
                required
              >
                <option value="Bajo">Bajo</option>
                <option value="Medio">Medio</option>
                <option value="Alto">Alto</option>
              </select>

              <div className="modal-buttons">
                <button type="submit" className="btn-save">
                  Guardar cambios
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditando(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
