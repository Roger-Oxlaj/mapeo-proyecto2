"use client";
import { useEffect, useState } from "react";
import "./ubicaciones.css"; // <-- Importa el CSS aquí

export default function UbicacionesPage() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nombreEmbarazada, setNombreEmbarazada] = useState("");

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

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="text-loading">Cargando datos...</p>;
  if (error) return <p className="text-error">⚠ {error}</p>;

  const eliminar = async (id) => {
    if (!confirm("¿Seguro de eliminar esta ubicación?")) return;
    const res = await fetch(
      `https://backend-demo-xowfm.ondigitalocean.app/ubicaciones/${id}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) fetchData();
    else alert("⚠ Error al eliminar");
  };

  const buscarNombreEmbarazada = async (id) => {
    if (!id) {
      setNombreEmbarazada("");
      return;
    }
    try {
      const res = await fetch(
        `https://backend-demo-xowfm.ondigitalocean.app/embarazadas/${id}`
      );
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
          } else alert("⚠ Error al agregar");
        }}
        className="form"
      >
        <input
          name="ID_Embarazada"
          placeholder="ID Embarazada"
          className="input"
          required
          onBlur={(e) => buscarNombreEmbarazada(e.target.value)}
        />

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
          required
        />

        <input
          type="number"
          name="ID_Direccion"
          placeholder="ID Dirección"
          className="input"
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
