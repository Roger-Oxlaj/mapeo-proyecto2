"use client";
import { useEffect, useState } from "react";
import "./EmbarazadasPage.css";

export default function EmbarazadasPage() {
  // ======== ESTADOS EMBARAZADAS ========
  const [embarazadas, setEmbarazadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editandoEmbarazada, setEditandoEmbarazada] = useState(null);

  // ======== ESTADOS DIRECCIONES ========
  const [direcciones, setDirecciones] = useState([]);
  const [editandoDireccion, setEditandoDireccion] = useState(null);

  // ======== CARGAR DATOS ========
  const cargarEmbarazadas = () => {
    fetch("https://backend-demo-xowfm.ondigitalocean.app/embarazadas")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener las embarazadas");
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

  const cargarDirecciones = () => {
    fetch("https://backend-demo-xowfm.ondigitalocean.app/direcciones")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener direcciones");
        return res.json();
      })
      .then((data) => setDirecciones(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    cargarEmbarazadas();
    cargarDirecciones();
  }, []);

  // ======== CRUD EMBARAZADAS ========
  const eliminarEmbarazada = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

    const res = await fetch(`https://backend-demo-xowfm.ondigitalocean.app/embarazadas/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("🗑️ Eliminada correctamente");
      cargarEmbarazadas();
    } else {
      alert("⚠ Error al eliminar");
    }
  };

  const guardarEdicionEmbarazada = async (e) => {
    e.preventDefault();
    const data = {
      Nombre: e.target.nombre.value,
      Edad: parseInt(e.target.edad.value),
      Telefono: e.target.telefono.value,
      ID_Direccion: e.target.direccion.value ? parseInt(e.target.direccion.value) : null,
    };

    const res = await fetch(
      `https://backend-demo-xowfm.ondigitalocean.app/embarazadas/${editandoEmbarazada.ID_Embarazada}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      alert("✏️ Registro actualizado");
      setEditandoEmbarazada(null);
      cargarEmbarazadas();
    } else {
      alert("⚠ Error al editar");
    }
  };

  // ======== CRUD DIRECCIONES ========
  const eliminarDireccion = async (id) => {
    if (!confirm("¿Eliminar esta dirección?")) return;
    const res = await fetch(`https://backend-demo-xowfm.ondigitalocean.app/direcciones/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("🗑️ Dirección eliminada");
      cargarDirecciones();
    } else {
      alert("⚠ Error al eliminar");
    }
  };

  const guardarEdicionDireccion = async (e) => {
    e.preventDefault();
    const data = {
      Calle: e.target.calle.value,
      Ciudad: e.target.ciudad.value,
      Departamento: e.target.departamento.value,
      Zona: e.target.zona.value || null,
      Avenida: e.target.avenida.value || null,
      NumeroCasa: e.target.numeroCasa.value || null,
    };

    const res = await fetch(
      `https://backend-demo-xowfm.ondigitalocean.app/direcciones/${editandoDireccion.ID_Direccion}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      alert("✏️ Dirección actualizada");
      setEditandoDireccion(null);
      cargarDirecciones();
    } else {
      alert("⚠ Error al editar");
    }
  };

  if (loading) return <p className="text-blue">Cargando datos...</p>;
  if (error) return <p className="text-red">⚠ {error}</p>;

  return (
    <div className="container">
      {/* ===================== */}
      {/* TABLA DE EMBARAZADAS */}
      {/* ===================== */}
      <h1 className="title">Lista de Embarazadas</h1>
      <table className="embarazada-table">
        <thead className="embarazada-thead">
          <tr className="embarazada-tr">
            <th>ID</th>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Teléfono</th>
            <th>ID Dirección</th>
            <th className="acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {embarazadas.map((e) => (
            <tr key={e.ID_Embarazada} className="embarazada-tr">
              <td>{e.ID_Embarazada}</td>
              <td>{e.Nombre}</td>
              <td>{e.Edad}</td>
              <td>{e.TELEFONO}</td>
              <td>{e.ID_Direccion}</td>
              <td className="acciones">
                <button onClick={() => setEditandoEmbarazada(e)} className="btn-editar">Editar</button>
                <button onClick={() => eliminarEmbarazada(e.ID_Embarazada)} className="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===================== */}
      {/* TABLA DE DIRECCIONES */}
      {/* ===================== */}
      <h1 className="title subtitulo">Direcciones</h1>
      <table className="embarazada-table">
        <thead className="embarazada-thead">
          <tr>
            <th>ID</th>
            <th>Calle</th>
            <th>Ciudad</th>
            <th>Departamento</th>
            <th>Zona</th>
            <th>Avenida</th>
            <th>Número de Casa</th>
            <th className="acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {direcciones.map((d) => (
            <tr key={d.ID_Direccion} className="embarazada-tr">
              <td>{d.ID_Direccion}</td>
              <td>{d.Calle}</td>
              <td>{d.Ciudad}</td>
              <td>{d.Departamento}</td>
              <td>{d.Zona || "-"}</td>
              <td>{d.Avenida || "-"}</td>
              <td>{d.NumeroCasa || "-"}</td>
              <td className="acciones">
                <button onClick={() => setEditandoDireccion(d)} className="btn-editar">Editar</button>
                <button onClick={() => eliminarDireccion(d.ID_Direccion)} className="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===================== */}
      {/* MODAL EMBARAZADA */}
      {/* ===================== */}
      {editandoEmbarazada && (
        <div className="modal-overlay">
          <form onSubmit={guardarEdicionEmbarazada} className="modal-box">
            <h2 className="modal-title">
              Editar embarazada #{editandoEmbarazada.ID_Embarazada}
            </h2>
            <label className="modal-label">Nombre</label>
            <input name="nombre" defaultValue={editandoEmbarazada.Nombre} className="modal-input" required />
            <label className="modal-label">Edad</label>
            <input name="edad" type="number" defaultValue={editandoEmbarazada.Edad} className="modal-input" required />
            <label className="modal-label">Teléfono</label>
            <input name="telefono" type="number" defaultValue={editandoEmbarazada.TELEFONO} className="modal-input" required />
            <label className="modal-label">ID Dirección</label>
            <input name="direccion" type="number" defaultValue={editandoEmbarazada.ID_Direccion} className="modal-input" />
            <div className="modal-actions">
              <button type="button" onClick={() => setEditandoEmbarazada(null)} className="modal-btn modal-btn-cancelar">
                Cancelar
              </button>
              <button type="submit" className="modal-btn modal-btn-guardar">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================== */}
      {/* MODAL DIRECCIÓN */}
      {/* ===================== */}
      {editandoDireccion && (
        <div className="modal-overlay">
          <form onSubmit={guardarEdicionDireccion} className="modal-box">
            <h2 className="modal-title">Editar Dirección #{editandoDireccion.ID_Direccion}</h2>
            <label className="modal-label">Calle</label>
            <input name="calle" defaultValue={editandoDireccion.Calle} className="modal-input" required />
            <label className="modal-label">Ciudad</label>
            <input name="ciudad" defaultValue={editandoDireccion.Ciudad} className="modal-input" required />
            <label className="modal-label">Departamento</label>
            <input name="departamento" defaultValue={editandoDireccion.Departamento} className="modal-input" required />
            <label className="modal-label">Zona</label>
            <input name="zona" defaultValue={editandoDireccion.Zona} className="modal-input" />
            <label className="modal-label">Avenida</label>
            <input name="avenida" defaultValue={editandoDireccion.Avenida} className="modal-input" />
            <label className="modal-label">Número de Casa</label>
            <input name="numeroCasa" defaultValue={editandoDireccion.NumeroCasa} className="modal-input" />
            <div className="modal-actions">
              <button type="button" onClick={() => setEditandoDireccion(null)} className="modal-btn modal-btn-cancelar">
                Cancelar
              </button>
              <button type="submit" className="modal-btn modal-btn-guardar">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
