"use client";
import { useEffect, useState } from "react";

export default function RiesgosPage() {
  const [riesgos, setRiesgos] = useState([]);
  const [embarazadas, setEmbarazadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //Cargar riesgos
  const cargarRiesgos = () => {
    fetch("http://localhost:3001/riesgos")
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

  //Cargar embarazadas
  const cargarEmbarazadas = () => {
    fetch("http://localhost:3001/embarazadas")
      .then((res) => res.json())
      .then((data) => setEmbarazadas(data))
      .catch((err) => console.error("⚠ Error cargando embarazadas:", err));
  };

  useEffect(() => {
    cargarRiesgos();
    cargarEmbarazadas();
  }, []);

  if (loading) return <p className="text-blue-600">Cargando datos...</p>;
  if (error) return <p className="text-red-600">⚠ {error}</p>;

  //Eliminar riesgo
  const eliminar = async (id) => {
    if (!confirm("¿Seguro de eliminar este riesgo?")) return;
    const res = await fetch(`http://localhost:3001/riesgos/${id}`, { method: "DELETE" });
    if (res.ok) cargarRiesgos();
    else alert("⚠ Error al eliminar");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl text-gray-900 font-bold mb-4">Gestión de Riesgos</h1>

      {/*Formulario de nuevo riesgo */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const data = {
            ID_Embarazada: e.target.ID_Embarazada.value,
            Fecha_Riesgo: e.target.Fecha_Riesgo.value,
            Nivel: e.target.Nivel.value,
          };

          const res = await fetch("http://localhost:3001/riesgos", {
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
        className="space-y-3 mb-6"
      >
        {/*Select de embarazadas */}
        <select name="ID_Embarazada" className="border p-2 border-gray-600 text-gray-800 rounded w-full" required>
          <option value="">Seleccione embarazada</option>
          {embarazadas.map((e) => (
            <option key={e.ID_Embarazada} value={e.ID_Embarazada}>
              {e.Nombre} (Edad {e.Edad})
            </option>
          ))}
        </select>

        <input
          type="date"
          name="Fecha_Riesgo"
          className="border p-2 border-gray-600 text-gray-800 rounded w-full"
          required
        />

        <select
          name="Nivel"
          className="border p-2 border-gray-600 text-gray-800 rounded w-full"
          required
        >
          <option value="Bajo">Bajo</option>
          <option value="Medio">Medio</option>
          <option value="Alto">Alto</option>
        </select>

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>

      {/*Tabla de riesgos */}
      <table className="min-w-full border border-gray-300 shadow-lg rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">ID</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Embarazada</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Nombre</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Fecha</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Nivel</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {riesgos.map((r) => (
            <tr key={r.ID_Riesgo}>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{r.ID_Riesgo}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{r.ID_Embarazada}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{r.NombreEmbarazada}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{r.Fecha_Riesgo}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{r.Nivel}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                <button
                  onClick={() => eliminar(r.ID_Riesgo)}
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