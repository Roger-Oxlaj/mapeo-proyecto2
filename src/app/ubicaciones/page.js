"use client";
import { useEffect, useState } from "react";

export default function UbicacionesPage() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nombreEmbarazada, setNombreEmbarazada] = useState("");

  const fetchData = () => {
    fetch("http://localhost:3001/ubicaciones")
      .then((res) => res.json())
      .then((data) => {
        setUbicaciones(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="text-blue-600">Cargando datos...</p>;
  if (error) return <p className="text-red-600">⚠ {error}</p>;

  const eliminar = async (id) => {
    if (!confirm("¿Seguro de eliminar esta ubicación?")) return;
    const res = await fetch(`http://localhost:3001/ubicaciones/${id}`, {
      method: "DELETE",
    });
    if (res.ok) fetchData();
    else alert("⚠ Error al eliminar");
  };

  //Buscar nombre de embarazada por ID
  const buscarNombreEmbarazada = async (id) => {
    if (!id) {
      setNombreEmbarazada("");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/embarazadas/${id}`);
      if (res.ok) {
        const data = await res.json();
        setNombreEmbarazada(data.Nombre);
      } else {
        setNombreEmbarazada("");
      }
    } catch (err) {
      setNombreEmbarazada("");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl text-gray-900 font-bold mb-4">Ubicaciones</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const data = {
            ID_Embarazada: e.target.ID_Embarazada.value,
            Nombre: e.target.Nombre.value,
            Edad: e.target.Edad.value,
            ID_Direccion: e.target.ID_Direccion.value,
          };
          const res = await fetch("http://localhost:3001/ubicaciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (res.ok) {
            fetchData();
            e.target.reset();
            setNombreEmbarazada("");
          } else alert("⚠ Error al agregar");
        }}
        className="space-y-3 mb-6"
      >
        <input
          name="ID_Embarazada"
          placeholder="ID Embarazada"
          className="border p-2 border-gray-600 text-gray-800 rounded w-full"
          required
          onBlur={(e) => buscarNombreEmbarazada(e.target.value)} // cuando pierde foco
        />

        <input
          name="Nombre"
          value={nombreEmbarazada}
          onChange={(e) => setNombreEmbarazada(e.target.value)}
          placeholder="Nombre"
          className="border p-2 border-gray-600 text-gray-800 rounded w-full"
          required
          readOnly
        />

        <input
          type="number"
          name="Edad"
          placeholder="Edad"
          className="border p-2 border-gray-600 text-gray-800 rounded w-full"
          required
        />
        <input
          type="number"
          name="ID_Direccion"
          placeholder="ID Dirección"
          className="border p-2 border-gray-600 text-gray-800 rounded w-full"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>

      <table className="min-w-full border border-gray-300 shadow-lg rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">ID</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">
              Embarazada
            </th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">
              Nombre
            </th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">
              Edad
            </th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">
              Dirección
            </th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {ubicaciones.map((u) => (
            <tr key={u.ID_Ubicacion}>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {u.ID_Ubicacion}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {u.ID_Embarazada}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {u.Nombre}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {u.Edad}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {u.ID_Direccion}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                <button
                  onClick={() => eliminar(u.ID_Ubicacion)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
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
