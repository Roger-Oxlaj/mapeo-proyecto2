"use client";
import { useEffect, useState } from "react";

export default function DireccionesPage() {
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(null);
fetch
  const cargarDirecciones = () => {
    fetch("http://localhost:3001/direcciones")
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

    const res = await fetch("http://localhost:3001/direcciones", {
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
    const res = await fetch(`http://localhost:3001/direcciones/${id}`, { method: "DELETE" });
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

    const res = await fetch(`http://localhost:3001/direcciones/${editando.ID_Direccion}`, {
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
    <div className="p-6">
      <h2 className="text-2xl text-gray-900 font-bold mb-4">Agregar Dirección</h2>
      <form onSubmit={agregarDireccion} className="space-y-3 border-gray-600 text-gray-800 mb-6">
        <input name="calle" placeholder="Calle" className="border p-2 border-gray-600 text-gray-800 w-full" required />
        <input name="ciudad" placeholder="Ciudad" className="border p-2 border-gray-600 text-gray-800 w-full" required />
        <input name="departamento" placeholder="Departamento" className="border p-2 border-gray-600 text-gray-800 w-full" required />
        <button className="bg-green-600 text-white px-4 py-2 border-gray-600 text-gray-800 rounded">Guardar</button>
      </form>

      <h1 className="text-2xl font-bold mb-4 text-gray-900">Direcciones</h1>
      <table className="min-w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">ID</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Calle</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Ciudad</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Departamento</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {direcciones.map((d) => (
            <tr key={d.ID_Direccion}>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{d.ID_Direccion}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{d.Calle}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{d.Ciudad}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{d.Departamento}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                <button onClick={() => setEditando(d)} className="bg-blue-600 text-white px-3 py-1 mr-2">Editar</button>
                <button onClick={() => eliminarDireccion(d.ID_Direccion)} className="bg-red-600 text-white px-3 py-1">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editando && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
          <form onSubmit={guardarEdicion} className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-2">Editar Dirección #{editando.ID_Direccion}</h2>
            <input name="calle" defaultValue={editando.Calle} className="border p-2 w-full mb-3 text-gray-900" required />
            <input name="ciudad" defaultValue={editando.Ciudad} className="border p-2 w-full mb-3 text-gray-900" required />
            <input name="departamento" defaultValue={editando.Departamento} className="border p-2 w-full mb-3 text-gray-900" required />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setEditando(null)} className="bg-gray-500 text-white px-3 py-1">Cancelar</button>
              <button type="submit" className="bg-green-600 text-white px-3 py-1">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}