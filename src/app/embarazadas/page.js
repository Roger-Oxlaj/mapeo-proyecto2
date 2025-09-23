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
      <table className="table shadow-lg rounded-lg">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Telefono</th>
            <th>ID Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {embarazadas.map((e) => (
            <tr key={e.ID_Embarazada}>
              <td>{e.ID_Embarazada}</td>
              <td>{e.Nombre}</td>
              <td>{e.Edad}</td>
              <td>{e.TELEFONO}</td>
              <td>{e.ID_Direccion}</td>
              <td>
                <button onClick={() => setEditando(e)} className="btn btn-edit">
                  Editar
                </button>
                <button
                  onClick={() => eliminarEmbarazada(e.ID_Embarazada)}
                  className="btn btn-delete"
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
        <div className="modal-overlay">
          <form onSubmit={guardarEdicion} className="modal">
            <h2 className="modal-title">
              Editar embarazada #{editando.ID_Embarazada}
            </h2>

            <label>Nombre</label>
            <input name="nombre" defaultValue={editando.Nombre} required />

            <label>Edad</label>
            <input name="edad" type="number" defaultValue={editando.Edad} required />

            <label>Telefono</label>
            <input
              name="telefono"
              type="number"
              defaultValue={editando.TELEFONO}
              required
            />

            <label>ID Dirección</label>
            <input
              name="direccion"
              type="number"
              defaultValue={editando.ID_Direccion}
            />

            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setEditando(null)}
                className="btn btn-cancel"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-save">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
