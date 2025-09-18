"use client";
import { useEffect, useState } from "react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(null);

  const rolesDisponibles = ["Usuario", "Admin", "Supervisor"]; // ✅ Lista de roles

  const cargarUsuarios = () => {
    fetch("http://localhost:3001/usuarios")
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

    if (usuarios.some(u => u.TELEFONO === telefono)) {
      alert("⚠ Este número de teléfono ya está registrado.");
      return;
    }

    if (usuarios.some(u => u.Nombre.toLowerCase() === nombre.toLowerCase())) {
      alert("⚠ Este nombre ya está registrado.");
      return;
    }

    if (usuarios.some(u => u.CorreoElectronico.toLowerCase() === correo.toLowerCase())) {
      alert("⚠ Este correo electrónico ya está registrado.");
      return;
    }

    if (usuarios.some(u => u.DPI === dpi)) {
      alert("⚠ Este DPI ya está registrado.");
      return;
    }

    const res = await fetch("http://localhost:3001/usuarios", {
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

    const mensaje = await res.text();

    if (res.ok) {
      alert("✅ Usuario agregado correctamente");
      e.target.reset();
      cargarUsuarios();
    } else {
      alert(`⚠ Error al agregar: ${mensaje}`);
    }


    if (res.ok) {
      alert("✅ Usuario agregado correctamente");
      e.target.reset();
      cargarUsuarios();
    } else {
      alert("⚠ Error al agregar");
    }
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    const res = await fetch(`http://localhost:3001/usuarios/${id}`, {
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

    const res = await fetch(`http://localhost:3001/usuarios/${editando.ID_Usuario}`, {
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
  if (error) return <p className="text-red-600">⚠ {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl text-gray-900 font-semibold mb-2">Agregar Usuario</h2>
      <form onSubmit={agregarUsuario} className="space-y-3 mb-6">
        <input name="nombre" placeholder="Nombre" className="border p-2 border-gray-600 text-gray-800 w-full" required />
        <input name="contraseña" type="password" placeholder="Contraseña" className="border p-2 border-gray-600 text-gray-800 w-full" required />
        <input name="correo" type="email" placeholder="Correo Electrónico" className="border p-2 border-gray-600 text-gray-800 w-full" required />
        <input name="dpi" placeholder="DPI" className="border p-2 border-gray-600 text-gray-800 w-full" required />
        <input name="telefono" placeholder="Teléfono" className="border p-2 border-gray-600 text-gray-800 w-full" required />

        {/* ✅ ComboBox de roles */}
        <select name="rol" className="border p-2 border-gray-600 text-gray-800 w-full" required>
          <option value="">-- Seleccionar Rol --</option>
          {rolesDisponibles.map((rol) => (
            <option key={rol} value={rol}>{rol}</option>
          ))}
        </select>

        <button className="bg-green-600 text-white px-4 py-2 border-gray-600 text-gray-800 rounded">Guardar</button>
      </form>

      <h1 className="text-2xl font-bold mb-4 text-gray-900">Usuarios</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">ID</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Nombre</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">CorreoElectronico</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">DPI</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Telefono</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Rol</th>
            <th className="border border-gray-600 px-4 py-2 text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.ID_Usuario}>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{u.ID_Usuario}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{u.Nombre}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{u.CorreoElectronico}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{u.DPI}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{u.TELEFONO}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">{u.Rol}</td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                <button onClick={() => setEditando(u)} className="bg-blue-600 text-white px-3 py-1 mr-2">Editar</button>
                <button onClick={() => eliminarUsuario(u.ID_Usuario)} className="bg-red-600 text-white px-3 py-1">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editando && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
          <form onSubmit={guardarEdicion} className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-2">Editar Usuario #{editando.ID_Usuario}</h2>
            <input name="nombre" defaultValue={editando.Nombre} className="border p-2 w-full mb-3 text-gray-900" required />
            <input name="correo" defaultValue={editando.CorreoElectronico} className="border p-2 w-full mb-3 text-gray-900" required />
            <input name="dpi" defaultValue={editando.DPI} className="border p-2 w-full mb-3 text-gray-900" required />
            <input name="telefono" defaultValue={editando.TELEFONO} className="border p-2 w-full mb-3 text-gray-900" required />

            {/* ✅ ComboBox de roles en edición */}
            <select name="rol" defaultValue={editando.Rol} className="border p-2 w-full mb-3 text-gray-900" required>
              <option value="">-- Seleccionar Rol --</option>
              {rolesDisponibles.map((rol) => (
                <option key={rol} value={rol}>{rol}</option>
              ))}
            </select>

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
