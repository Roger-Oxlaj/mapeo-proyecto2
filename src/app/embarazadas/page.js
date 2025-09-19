"use client";
import { useEffect, useState } from "react";

export default function EmbarazadasPage() {
  const [embarazadas, setEmbarazadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(null);

  const cargarEmbarazadas = () => {
    fetch("http://localhost:3001/embarazadas")
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

    const res = await fetch("http://localhost:3001/embarazadas", {
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
      alert("⚠ Error al agregar: " + msg);
    }
  };

  const eliminarEmbarazada = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

    const res = await fetch(`http://localhost:3001/embarazadas/${id}`, {
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
  const telefono = e.target.telefono.value; // ✅ CORREGIDO
  const direccion = e.target.direccion.value;

  const res = await fetch(
    `http://localhost:3001/embarazadas/${editando.ID_Embarazada}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Nombre: nombre,
        Edad: parseInt(edad),
        Telefono: telefono, // ✅ AHORA SE ENVÍA
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

  if (loading) return <p className="text-blue-600">Cargando datos...</p>;
  if (error) return <p className="text-red-600">⚠ {error}</p>;

  return (
    <div className="p-6">
      {/* Tabla de registros */}
      <h1 className="text-2xl text-gray-900 font-bold mb-4">Lista de Embarazadas</h1>
      <table className="min-w-full border border-gray-600 shadow-lg rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">ID</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Nombre</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Edad</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Telefono</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">ID Dirección</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {embarazadas.map((e) => (
            <tr key={e.ID_Embarazada} className="hover:bg-gray-100">
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{e.ID_Embarazada}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{e.Nombre}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{e.Edad}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{e.TELEFONO}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{e.ID_Direccion}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                <button
                  onClick={() => setEditando(e)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarEmbarazada(e.ID_Embarazada)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <form
            onSubmit={guardarEdicion}
            className="bg-white p-6 rounded shadow-lg space-y-4 w-96"
          >
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Editar embarazada #{editando.ID_Embarazada}
            </h2>

            <label className="block font-semibold text-gray-700">Nombre</label>
            <input
              name="nombre"
              defaultValue={editando.Nombre}
              className="border p-2 rounded w-full text-gray-900"
              required
            />

            <label className="block font-semibold text-gray-700">Edad</label>
            <input
              name="edad"
              type="number"
              defaultValue={editando.Edad}
              className="border p-2 rounded w-full text-gray-900"
              required
            />

            <label className="block font-semibold text-gray-700">Telefono</label>
            <input
              name="telefono"
              type="number"
              defaultValue={editando.TELEFONO}
              className="border p-2 rounded w-full text-gray-900"
              required
            />

            <label className="block font-semibold text-gray-700">
              ID Dirección
            </label>
            <input
              name="direccion"
              type="number"
              defaultValue={editando.ID_Direccion}
              className="border p-2 rounded w-full text-gray-900"
            />

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditando(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}