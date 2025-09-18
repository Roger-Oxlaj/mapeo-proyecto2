"use client";
import { useEffect, useState } from "react";

export default function SeguimientosPage() {
  const [seguimientos, setSeguimientos] = useState([]);
  const [embarazadas, setEmbarazadas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = () => {
    fetch("http://localhost:3001/seguimientos")
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

  // ✅ Traer IDs de embarazadas y usuarios
  const fetchEmbarazadas = () => {
    fetch("http://localhost:3001/embarazadas")
      .then((res) => res.json())
      .then((data) => setEmbarazadas(data))
      .catch((err) => setError(err.message));
  };

  const fetchUsuarios = () => {
    fetch("http://localhost:3001/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchData();
    fetchEmbarazadas();
    fetchUsuarios();
  }, []);

  if (loading) return <p className="text-blue-600">Cargando datos...</p>;
  if (error) return <p className="text-red-600">⚠ {error}</p>;

  const eliminar = async (id) => {
    if (!confirm("¿Seguro de eliminar este seguimiento?")) return;
    const res = await fetch(`http://localhost:3001/seguimientos/${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
    else alert("⚠ Error al eliminar");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl text-gray-900 font-bold mb-4">Seguimientos</h1>

      {/* Formulario */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const data = {
            ID_Embarazada: e.target.ID_Embarazada.value,
            ID_Usuario: e.target.ID_Usuario.value,
            Fecha_Seguimiento: e.target.Fecha_Seguimiento.value,
            Observaciones: e.target.Observaciones.value,
            Signos_Alarma: e.target.Signos_Alarma.value,
          };
          const res = await fetch("http://localhost:3001/seguimientos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (res.ok) { fetchData(); e.target.reset(); }
          else alert("⚠ Error al agregar");
        }}
        className="space-y-3 mb-6"
      >
        {/* ComboBox Embarazadas */}
        <select name="ID_Embarazada" className="border p-2 border-gray-600 text-gray-800 rounded w-full" required>
          <option value="">-- Seleccionar Embarazada --</option>
          {embarazadas.map((e) => (
            <option key={e.ID_Embarazada} value={e.ID_Embarazada}>
              {e.ID_Embarazada} - {e.Nombre}
            </option>
          ))}
        </select>

        {/* ComboBox Usuarios */}
        <select name="ID_Usuario" className="border p-2 border-gray-600 text-gray-800 rounded w-full" required>
          <option value="">-- Seleccionar Usuario --</option>
          {usuarios.map((u) => (
            <option key={u.ID_Usuario} value={u.ID_Usuario}>
              {u.ID_Usuario} - {u.Nombre}
            </option>
          ))}
        </select>

        <input type="date" name="Fecha_Seguimiento" className="border p-2 border-gray-600 text-gray-800 rounded w-full" required />
        <input name="Observaciones" placeholder="Observaciones" className="border p-2 border-gray-600 text-gray-800 rounded w-full" />
        <input name="Signos_Alarma" placeholder="Signos de alarma" className="border p-2 border-gray-600 text-gray-800 rounded w-full" />

        <button className="bg-green-600 text-white px-4 py-2 border-gray-600 text-gray-800 rounded">Guardar</button>
      </form>

      {/* Tabla */}
      <table className="min-w-full border border-gray-600 shadow-lg rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">ID</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">ID Embarazada</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Usuario</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Fecha</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Observaciones</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Signos</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {seguimientos.map((s) => (
            <tr key={s.ID_Seguimiento}>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{s.ID_Seguimiento}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{s.ID_Embarazada}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{s.ID_Usuario}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{s.Fecha_Seguimiento}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{s.Observaciones}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{s.Signos_Alarma}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                <button onClick={() => eliminar(s.ID_Seguimiento)} className="bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
