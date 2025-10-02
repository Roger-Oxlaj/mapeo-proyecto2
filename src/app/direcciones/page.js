"use client";
import { useEffect, useState } from "react";
import "./Direcciones.css"; // 👈 Estilos actualizados

export default function DireccionesPage() {
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(null);

  const cargarDirecciones = () => {
    fetch("https://backend-demo-xowfm.ondigitalocean.app/direcciones")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener direcciones");
        return res.json();
      })
      .then((data) => {
        setDirecciones(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarDirecciones();
  }, []);

  const agregarDireccion = async (e) => {
    e.preventDefault();
    const data = {
      Calle: e.target.calle.value,
      Ciudad: e.target.ciudad.value,
      Departamento: e.target.departamento.value,
      Zona: e.target.zona.value || null,
      Avenida: e.target.avenida.value || null,
      NumeroCasa: e.target.numeroCasa.value || null,
    };

    const res = await fetch("https://backend-demo-xowfm.ondigitalocean.app/direcciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("✅ Dirección agregada");
      e.target.reset();
      cargarDirecciones();
    } else {
      alert("⚠ Error al agregar");
    }
  };

  const eliminarDireccion = async (id) => {
    if (!confirm("¿Eliminar esta dirección?")) return;
    const res = await fetch(`https://backend-demo-xowfm.ondigitalocean.app/direcciones/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("🗑️ Dirección eliminada");
      cargarDirecciones();
    } else {
      alert("⚠ Error al eliminar");
    }
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    const data = {
      Calle: e.target.calle.value,
      Ciudad: e.target.ciudad.value,
      Departamento: e.target.departamento.value,
      Zona: e.target.zona.value || null,
      Avenida: e.target.avenida.value || null,
      NumeroCasa: e.target.numeroCasa.value || null,
    };

    const res = await fetch(`https://backend-demo-xowfm.ondigitalocean.app/direcciones/${editando.ID_Direccion}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("✏️ Dirección actualizada");
      setEditando(null);
      cargarDirecciones();
    } else {
      alert("⚠ Error al editar");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-error">⚠ {error}</p>;

  return (
    <div className="direcciones-container">
      <h2 className="title">Agregar Dirección</h2>
      <form onSubmit={agregarDireccion} className="form">
        <input name="calle" placeholder="Calle" className="input" required />
        <input name="ciudad" placeholder="Ciudad" className="input" required />
        <input name="departamento" placeholder="Departamento" className="input" required />
        <input name="zona" placeholder="Zona (opcional)" className="input" />
        <input name="avenida" placeholder="Avenida (opcional)" className="input" />
        <input name="numeroCasa" placeholder="Número de casa" className="input" />
        <button className="button">Guardar</button>
      </form>

      <h1 className="subtitle">Direcciones</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Calle</th>
            <th>Ciudad</th>
            <th>Departamento</th>
            <th>Zona</th>
            <th>Avenida</th>
            <th>Número de Casa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {direcciones.map((d) => (
            <tr key={d.ID_Direccion}>
              <td>{d.ID_Direccion}</td>
              <td>{d.Calle}</td>
              <td>{d.Ciudad}</td>
              <td>{d.Departamento}</td>
              <td>{d.Zona || "-"}</td>
              <td>{d.Avenida || "-"}</td>
              <td>{d.NumeroCasa || "-"}</td>
              <td>
                <button onClick={() => setEditando(d)} className="btn-edit">Editar</button>
                <button onClick={() => eliminarDireccion(d.ID_Direccion)} className="btn-delete">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editando && (
        <div className="modal-overlay">
          <form onSubmit={guardarEdicion} className="modal">
            <h2 className="title">Editar Dirección #{editando.ID_Direccion}</h2>
            <input name="calle" defaultValue={editando.Calle} className="modal-input" required />
            <input name="ciudad" defaultValue={editando.Ciudad} className="modal-input" required />
            <input name="departamento" defaultValue={editando.Departamento} className="modal-input" required />
            <input name="zona" defaultValue={editando.Zona} className="modal-input" />
            <input name="avenida" defaultValue={editando.Avenida} className="modal-input" />
            <input name="numeroCasa" defaultValue={editando.NumeroCasa} className="modal-input" />
            <div className="modal-actions">
              <button type="button" onClick={() => setEditando(null)} className="btn-cancel">Cancelar</button>
              <button type="submit" className="btn-save">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
