"use client";
import { useEffect, useState } from "react";
import "./ubicaciones.css";

export default function UbicacionesPage() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [embarazadas, setEmbarazadas] = useState([]); // <-- NUEVO: lista de embarazadas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nombreEmbarazada, setNombreEmbarazada] = useState("");
  const [edad, setEdad] = useState(""); // <-- NUEVO
  const [idDireccion, setIdDireccion] = useState(""); // <-- NUEVO

  // === Cargar ubicaciones ===
  const fetchData = () => {
    fetch("https://backend-demo-xowfm.ondigitalocean.app/ubicaciones")
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

  // === Cargar embarazadas ===
  const fetchEmbarazadas = () => {
    fetch("https://backend-demo-xowfm.ondigitalocean.app/embarazadas")
      .then((res) => res.json())
      .then((data) => setEmbarazadas(data))
      .catch((err) => console.error("Error cargando embarazadas:", err));
  };

  useEffect(() => {
    fetchData();
    fetchEmbarazadas();
  }, []);

  if (loading) return <p className="text-loading">Cargando datos...</p>;
  if (error) return <p className="text-error">⚠ {error}</p>;

  const eliminar = async (id) => {
    if (!confirm("¿Seguro de eliminar esta ubicación?")) return;
    const res = await fetch(
      `https://backend-demo-xowfm.ondigitalocean.app/ubicaciones/${id}`,
      { method: "DELETE" }
    );
    if (res.ok) fetchData();
    else alert("⚠ Error al eliminar");
  };

  const buscarNombreEmbarazada = async (id) => {
    if (!id) {
      setNombreEmbarazada("");
      setEdad("");
      setIdDireccion("");
      return;
    }
    try {
      const res = await fetch(
        `https://backend-demo-xowfm.ondigitalocean.app/embarazadas/${id}`
      );
      if (res.ok) {
        const data = await res.json();
        setNombreEmbarazada(data.Nombre);
        setEdad(data.Edad); // <-- NUEVO
        setIdDireccion(data.ID_Direccion); // <-- NUEVO
      } else {
        setNombreEmbarazada("");
        setEdad("");
        setIdDireccion("");
      }
    } catch (err) {
      setNombreEmbarazada("");
      setEdad("");
      setIdDireccion("");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Ubicaciones</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const data = {
            ID_Embarazada: e.target.ID_Embarazada.value,
            Nombre: e.target.Nombre.value,
            Edad: e.target.Edad.value,
            ID_Direccion: e.target.ID_Direccion.value,
          };
          const res = await fetch(
            "https://backend-demo-xowfm.ondigitalocean.app/ubicaciones",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          );
          if (res.ok) {
            fetchData();
            e.target.reset();
            setNombreEmbarazada("");
            setEdad("");
            setIdDireccion("");
          } else alert("⚠ Error al agregar");
        }}
        className="form"
      >

        {/* ======= CAMBIO: Combobox de Embarazadas ======= */}
        <select
          name="ID_Embarazada"
          className="input"
          required
          onChange={(e) => buscarNombreEmbarazada(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Selecciona una embarazada
          </option>
          {embarazadas.map((emb) => (
            <option key={emb.ID_Embarazada} value={emb.ID_Embarazada}>
              {emb.ID_Embarazada} - {emb.Nombre}
            </option>
          ))}
        </select>

        <input
          name="Nombre"
          value={nombreEmbarazada}
          onChange={(e) => setNombreEmbarazada(e.target.value)}
          placeholder="Nombre"
          className="input"
          required
          readOnly
        />

        <input
          type="number"
          name="Edad"
          placeholder="Edad"
          className="input"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
          readOnly
        />

        <input
          type="number"
          name="ID_Direccion"
          placeholder="ID Dirección"
          className="input"
          value={idDireccion}
          onChange={(e) => setIdDireccion(e.target.value)}
          readOnly
        />

        <button className="button-save">Guardar</button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Embarazada</th>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ubicaciones.map((u) => (
            <tr key={u.ID_Ubicacion}>
              <td data-label="ID">{u.ID_Ubicacion}</td>
              <td data-label="Embarazada">{u.ID_Embarazada}</td>
              <td data-label="Nombre">{u.Nombre}</td>
              <td data-label="Edad">{u.Edad}</td>
              <td data-label="Dirección">{u.ID_Direccion}</td>
              <td data-label="Acciones">
                <button
                  onClick={() => eliminar(u.ID_Ubicacion)}
                  className="button-delete"
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
