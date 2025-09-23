"use client";
import { useEffect, useState } from "react";
import "./usuarios.css"; // 👈 Importa el CSS aquí

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(null);

  const rolesDisponibles = ["Usuario", "Admin", "Supervisor"];

  const cargarUsuarios = () => {
    fetch("https://backend-demo-xowfm.ondigitalocean.app/usuarios")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los usuarios");
        return res.json();
      })
      .then((data) => {
        setUsuarios(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const agregarUsuario = async (e) => {
    e.preventDefault();
    const nombre = e.target.nombre.value;
    const contraseña = e.target.contraseña.value;
    const correo = e.target.correo.value;
    const dpi = e.target.dpi.value;
    const telefono = e.target.telefono.value;
    const rol = e.target.rol.value;

    if (telefono.length > 8) {
      alert("⚠ El número de teléfono no puede tener más de 8 dígitos.");
      return;
    }

    if (usuarios.some((u) => u.TELEFONO === telefono)) {
      alert("⚠ Este número de teléfono ya está registrado.");
      return;
    }

    if (usuarios.some((u) => u.Nombre.toLowerCase() === nombre.toLowerCase())) {
      alert("⚠ Este nombre ya está registrado.");
      return;
    }

    if (usuarios.some((u) => u.CorreoElectronico.toLowerCase() === correo.toLowerCase())) {
      alert("⚠ Este correo electrónico ya está registrado.");
      return;
    }

    if (usuarios.some((u) => u.DPI === dpi)) {
      alert("⚠ Este DPI ya está registrado.");
      return;
    }

    const res = await fetch("https://backend-demo-xowfm.ondigitalocean.app/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Nombre: nombre,
        Contraseña: contraseña,
        CorreoElectronico: correo,
        DPI: dpi,
        TELEFONO: telefono,
        Salt: "N/A",
        Rol: rol,
      }),
    });

    if (res.ok) {
      alert("✅ Usuario agregado correctamente");
      e.target.reset();
      cargarUsuarios();
    } else {
      const mensaje = await res.text();
      alert(`⚠ Error al agregar: ${mensaje}`);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    const res = await fetch(`https://backend-demo-xowfm.ondigitalocean.app/usuarios/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("🗑️ Usuario eliminado");
      cargarUsuarios();
    } else {
      alert("⚠ Error al eliminar");
    }
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    const nombre = e.target.nombre.value;
    const correo = e.target.correo.value;
    const dpi = e.target.dpi.value;
    const telefono = e.target.telefono.value;
    const rol = e.target.rol.value;

    if (telefono.length > 8) {
      alert("⚠ El número de teléfono no puede tener más de 8 dígitos.");
      return;
    }

    const res = await fetch(`https://backend-demo-xowfm.ondigitalocean.app/usuarios/${editando.ID_Usuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Nombre: nombre,
        Contraseña: editando.Contraseña,
        CorreoElectronico: correo,
        DPI: dpi,
        TELEFONO: telefono,
        Salt: editando.Salt,
        Rol: rol,
      }),
    });

    if (res.ok) {
      alert("✏️ Usuario actualizado");
      setEditando(null);
      cargarUsuarios();
    } else {
      alert("⚠ Error al editar");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-error">⚠ {error}</p>;

  return (
    <div className="container">
      <h2 className="title">Agregar Usuario</h2>
      <form onSubmit={agregarUsuario} className="form">
        <input name="nombre" placeholder="Nombre" className="input" required />
        <input name="contraseña" type="password" placeholder="Contraseña" className="input" required />
        <input name="correo" type="email" placeholder="Correo Electrónico" className="input" required />
        <input name="dpi" placeholder="DPI" className="input" required />
        <input name="telefono" placeholder="Teléfono" className="input" required />
        <select name="rol" className="select" required>
          <option value="">-- Seleccionar Rol --</option>
          {rolesDisponibles.map((rol) => (
            <option key={rol} value={rol}>{rol}</option>
          ))}
        </select>
        <button className="button">Guardar</button>
      </form>

      <h1 className="subtitle">Usuarios</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>CorreoElectronico</th>
            <th>DPI</th>
            <th>Telefono</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.ID_Usuario}>
              <td>{u.ID_Usuario}</td>
              <td>{u.Nombre}</td>
              <td>{u.CorreoElectronico}</td>
              <td>{u.DPI}</td>
              <td>{u.TELEFONO}</td>
              <td>{u.Rol}</td>
              <td>
                <button onClick={() => setEditando(u)} className="btn-edit">Editar</button>
                <button onClick={() => eliminarUsuario(u.ID_Usuario)} className="btn-delete">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editando && (
        <div className="modal-overlay">
          <form onSubmit={guardarEdicion} className="modal">
            <h2 className="title">Editar Usuario #{editando.ID_Usuario}</h2>
            <input name="nombre" defaultValue={editando.Nombre} className="modal-input" required />
            <input name="correo" defaultValue={editando.CorreoElectronico} className="modal-input" required />
            <input name="dpi" defaultValue={editando.DPI} className="modal-input" required />
            <input name="telefono" defaultValue={editando.TELEFONO} className="modal-input" required />
            <select name="rol" defaultValue={editando.Rol} className="modal-input" required>
              <option value="">-- Seleccionar Rol --</option>
              {rolesDisponibles.map((rol) => (
                <option key={rol} value={rol}>{rol}</option>
              ))}
            </select>
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
