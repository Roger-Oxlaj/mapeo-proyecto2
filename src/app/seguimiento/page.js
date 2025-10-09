"use client";
import "./seguimientos.css";
import { useEffect, useState } from "react";

export default function SeguimientosPage() {
  const [seguimientos, setSeguimientos] = useState([]);
  const [embarazadas, setEmbarazadas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API = "https://backend-demo-xowfm.ondigitalocean.app";

  const fetchData = () => {
    fetch(`${API}/seguimientos`)
      .then((res) => res.json())
      .then((data) => {
        setSeguimientos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchEmbarazadas = () => {
    fetch(`${API}/embarazadas`)
      .then((res) => res.json())
      .then((data) => setEmbarazadas(data))
      .catch((err) => setError(err.message));
  };

  const fetchUsuarios = () => {
    fetch(`${API}/usuarios`)
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchData();
    fetchEmbarazadas();
    fetchUsuarios();
  }, []);

  if (loading) return <p style={{ color: "#2563eb" }}>Cargando datos...</p>;
  if (error) return <p style={{ color: "#dc2626" }}>⚠ {error}</p>;

  const eliminar = async (id) => {
    if (!confirm("¿Seguro de eliminar este seguimiento?")) return;
    const res = await fetch(`${API}/seguimientos/${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
    else alert("⚠ Error al eliminar");
  };

  const abrirModal = (seguimiento) => {
    setEditando(seguimiento);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setEditando(null);
    setShowModal(false);
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    const data = {
      ID_Embarazada: e.target.ID_Embarazada.value,
      ID_Usuario: e.target.ID_Usuario.value,
      Fecha_Seguimiento: e.target.Fecha_Seguimiento.value,
      Observaciones: e.target.Observaciones.value,
      Signos_Alarma: e.target.Signos_Alarma.value,
    };

    const res = await fetch(`${API}/seguimientos/${editando.ID_Seguimiento}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("✅ Seguimiento actualizado correctamente");
      cerrarModal();
      fetchData();
    } else {
      alert("⚠ Error al actualizar seguimiento");
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    const data = {
      ID_Embarazada: e.target.ID_Embarazada.value,
      ID_Usuario: e.target.ID_Usuario.value,
      Fecha_Seguimiento: e.target.Fecha_Seguimiento.value,
      Observaciones: e.target.Observaciones.value,
      Signos_Alarma: e.target.Signos_Alarma.value,
    };

    const res = await fetch(`${API}/seguimientos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      fetchData();
      e.target.reset();
    } else alert("⚠ Error al agregar");
  };

  return (
    <div className="contenedor">
      <h1 className="titulo">Seguimientos</h1>

      {/* Formulario principal */}
      <form onSubmit={handleCrear} className="formulario">
        <select name="ID_Embarazada" className="select" required>
          <option value="">-- Seleccionar Embarazada --</option>
          {embarazadas.map((e) => (
            <option key={e.ID_Embarazada} value={e.ID_Embarazada}>
              {e.ID_Embarazada} - {e.Nombre}
            </option>
          ))}
        </select>

        <select name="ID_Usuario" className="select" required>
          <option value="">-- Seleccionar Usuario --</option>
          {usuarios.map((u) => (
            <option key={u.ID_Usuario} value={u.ID_Usuario}>
              {u.ID_Usuario} - {u.Nombre}
            </option>
          ))}
        </select>
        <input type="date" name="Fecha_Seguimiento" className="input" required />
        <input name="Observaciones" placeholder="Observaciones" className="input" />
        <input name="Signos_Alarma" placeholder="Signos de alarma" className="input" />

        <button className="boton-guardar">Guardar</button>
      </form>

      {/* Tabla */}
      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Embarazada</th>
            <th>Usuario</th>
            <th>Fecha</th>
            <th>Observaciones</th>
            <th>Signos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {seguimientos.map((s) => (
            <tr key={s.ID_Seguimiento}>
              <td data-label="ID">{s.ID_Seguimiento}</td>
              <td data-label="ID Embarazada">{s.ID_Embarazada}</td>
              <td data-label="Usuario">{s.ID_Usuario}</td>
              <td data-label="Fecha">{s.Fecha_Seguimiento?.split("T")[0]}</td>
              <td data-label="Observaciones">{s.Observaciones}</td>
              <td data-label="Signos">{s.Signos_Alarma}</td>
              <td data-label="Acciones">
                <button onClick={() => abrirModal(s)} className="boton-editar">
                  Editar
                </button>
                <button
                  onClick={() => eliminar(s.ID_Seguimiento)}
                  className="boton-eliminar"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🟢 Modal flotante con labels */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h2 className="modal-title">Editar Seguimiento #{editando?.ID_Seguimiento}</h2>
            <form onSubmit={handleActualizar}>
              <label className="label">Embarazada:</label>
              <select
                name="ID_Embarazada"
                className="select"
                defaultValue={editando?.ID_Embarazada}
                required
              >
                <option value="">-- Seleccionar Embarazada --</option>
                {embarazadas.map((e) => (
                  <option key={e.ID_Embarazada} value={e.ID_Embarazada}>
                    {e.ID_Embarazada} - {e.Nombre}
                  </option>
                ))}
              </select>

              <label className="label">Usuario:</label>
              <select
                name="ID_Usuario"
                className="select"
                defaultValue={editando?.ID_Usuario}
                required
              >
                <option value="">-- Seleccionar Usuario --</option>
                {usuarios.map((u) => (
                  <option key={u.ID_Usuario} value={u.ID_Usuario}>
                    {u.ID_Usuario} - {u.Nombre}
                  </option>
                ))}
              </select>

              <label className="label">Fecha del seguimiento:</label>
              <input
                type="date"
                name="Fecha_Seguimiento"
                className="input"
                defaultValue={editando?.Fecha_Seguimiento?.split("T")[0]}
                required
              />

              <label className="label">Observaciones:</label>
              <input
                name="Observaciones"
                placeholder="Observaciones"
                className="input"
                defaultValue={editando?.Observaciones}
              />

              <label className="label">Signos de alarma:</label>
              <input
                name="Signos_Alarma"
                placeholder="Signos de alarma"
                className="input"
                defaultValue={editando?.Signos_Alarma}
              />

              <div className="modal-botones">
                <button type="submit" className="boton-guardar">
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="boton-cancelar"
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
