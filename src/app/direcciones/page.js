"use client";
import { useEffect, useState } from "react";
import "./Direcciones.css"; // 👈 Importamos estilos

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
    const calle = e.target.calle.value;
    const ciudad = e.target.ciudad.value;
    const depto = e.target.departamento.value;

    const res = await fetch("https://backend-demo-xowfm.ondigitalocean.app/direcciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Calle: calle, Ciudad: ciudad, Departamento: depto }),
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
    const calle = e.target.calle.value;
    const ciudad = e.target.ciudad.value;
    const depto = e.target.departamento.value;

    const res = await fetch(`https://backend-demo-xowfm.ondigitalocean.app/direcciones/${editando.ID_Direccion}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Calle: calle, Ciudad: ciudad, Departamento: depto }),
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
  if (error) return <p className="text-red-600">⚠ {error}</p>;

  return (
    <div className="direcciones-container">
      <h2 className="direcciones-title">Agregar Dirección</h2>
      <form onSubmit={agregarDireccion} className="direcciones-form">
        <input name="calle" placeholder="Calle" className="direcciones-input" required />
        <input name="ciudad" placeholder="Ciudad" className="direcciones-input" required />
        <input name="departamento" placeholder="Departamento" className="direcciones-input" required />
        <button className="direcciones-btn">Guardar</button>
      </form>

      <h1 className="direcciones-title">Direcciones</h1>
      <table className="direcciones-table">
        <thead>
          <tr>
            <th className="direcciones-th">ID</th>
            <th className="direcciones-th">Calle</th>
            <th className="direcciones-th">Ciudad</th>
            <th className="direcciones-th">Departamento</th>
            <th className="direcciones-th">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {direcciones.map((d) => (
            <tr key={d.ID_Direccion}>
              <td className="direcciones-td">{d.ID_Direccion}</td>
              <td className="direcciones-td">{d.Calle}</td>
              <td className="direcciones-td">{d.Ciudad}</td>
              <td className="direcciones-td">{d.Departamento}</td>
              <td className="direcciones-td">
                <button onClick={() => setEditando(d)} className="btn-editar">Editar</button>
                <button onClick={() => eliminarDireccion(d.ID_Direccion)} className="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editando && (
        <div className="modal-overlay">
          <form onSubmit={guardarEdicion} className="modal-box">
            <h2 className="modal-title">Editar Dirección #{editando.ID_Direccion}</h2>
            <input name="calle" defaultValue={editando.Calle} className="modal-input" required />
            <input name="ciudad" defaultValue={editando.Ciudad} className="modal-input" required />
            <input name="departamento" defaultValue={editando.Departamento} className="modal-input" required />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setEditando(null)} className="modal-btn modal-btn-cancelar">Cancelar</button>
              <button type="submit" className="modal-btn modal-btn-guardar">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
