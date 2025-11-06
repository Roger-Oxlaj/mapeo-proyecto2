"use client";
import { useEffect, useState } from "react";
import "./EmbarazadasPage.css"; // 👈 Importamos el CSS

export default function EmbarazadasPage() {
  const [embarazadas, setEmbarazadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(null);

  const cargarEmbarazadas = () => {
    fetch("https://backend-demo-xowfm.ondigitalocean.app/embarazadas")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los datos");
        return res.json();
      })
      .then((data) => {
        setEmbarazadas(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarEmbarazadas();
  }, []);

  const agregarEmbarazada = async (e) => {
    e.preventDefault();
    const nombre = e.target.nombre.value;
    const edad = e.target.edad.value;
    const direccion = e.target.direccion.value;

    const res = await fetch("https://backend-demo-xowfm.ondigitalocean.app/embarazadas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Nombre: nombre,
        Edad: parseInt(edad),
        Telefono: e.target.telefono.value,
        ID_Direccion: direccion ? parseInt(direccion) : null,
      }),
    });

    if (res.ok) {
      alert("✅ Embarazada agregada correctamente");
      e.target.reset();
      cargarEmbarazadas();
    } else {
      const txt = await res.text();
      alert("⚠ Error al agregar: " + txt);
    }
  };

  const eliminarEmbarazada = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

    const res = await fetch(`https://backend-demo-xowfm.ondigitalocean.app/embarazadas/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("🗑️ Eliminada correctamente");
      cargarEmbarazadas();
    } else {
      const txt = await res.text();
      alert("⚠ Error al eliminar: " + txt);
    }
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    const nombre = e.target.nombre.value;
    const edad = e.target.edad.value;
    const telefono = e.target.telefono.value;
    const direccion = e.target.direccion.value;

    const res = await fetch(
      `https://backend-demo-xowfm.ondigitalocean.app/embarazadas/${editando.ID_Embarazada}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Nombre: nombre,
          Edad: parseInt(edad),
          Telefono: telefono,
          ID_Direccion: direccion ? parseInt(direccion) : null,
        }),
      }
    );

    if (res.ok) {
      alert("✏️ Registro actualizado");
      setEditando(null);
      cargarEmbarazadas();
    } else {
      const msg = await res.text();
      alert("⚠ Error al editar: " + msg);
    }
  };

  if (loading) return <p className="text-blue">Cargando datos...</p>;
  if (error) return <p className="text-red">⚠ {error}</p>;

  return (
    <div className="container">
      {/* Tabla de registros */}
      <h1 className="title">Lista de Embarazadas</h1>
      <table className="embarazada-table">
        <thead className="embarazada-thead">
          <tr className="embarazada-tr">
            <th className="embarazada-th">ID</th>
            <th className="embarazada-th">Nombre</th>
            <th className="embarazada-th">Edad</th>
            <th className="embarazada-th">Teléfono</th>
            <th className="embarazada-th">ID Dirección</th>
            <th className="embarazada-th acciones">Acciones</th>
          </tr>
        </thead>
        <tbody className="embarazada-tbody">
          {embarazadas.map((e) => (
            <tr key={e.ID_Embarazada} className="embarazada-tr">
              <td className="embarazada-td" data-label="ID">{e.ID_Embarazada}</td>
              <td className="embarazada-td" data-label="Nombre">{e.Nombre}</td>
              <td className="embarazada-td" data-label="Edad">{e.Edad}</td>
              <td className="embarazada-td" data-label="Teléfono">{e.TELEFONO}</td>
              <td className="embarazada-td" data-label="ID Dirección">{e.ID_Direccion}</td>
              <td className="embarazada-td acciones" data-label="Acciones">
                <button onClick={() => setEditando(e)} className="btn-editar">Editar</button>
                <button onClick={() => eliminarEmbarazada(e.ID_Embarazada)} className="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* Modal de edición */}
      {editando && (
        <div className="modal-overlay">
          <form onSubmit={guardarEdicion} className="modal-box">
            <h2 className="modal-title"> Editar embarazada #{editando.ID_Embarazada} </h2>
            <label className="modal-label">Nombre</label>
            <input
              name="nombre"
              defaultValue={editando.Nombre}
              required
              className="modal-input"
            />

            <label className="modal-label">Edad</label>
            <input
              name="edad"
              type="number"
              defaultValue={editando.Edad}
              required
              className="modal-input"
            />

            <label className="modal-label">Teléfono</label>
            <input
              name="telefono"
              type="number"
              defaultValue={editando.TELEFONO}
              required
              className="modal-input"
            />

            <label className="modal-label">ID Dirección</label>
            <input
              name="direccion"
              type="number"
              defaultValue={editando.ID_Direccion}
              className="modal-input"
            />

            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setEditando(null)}
                className="modal-btn modal-btn-cancelar"
              >
                Cancelar
              </button>
              <button type="submit" className="modal-btn modal-btn-guardar">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
