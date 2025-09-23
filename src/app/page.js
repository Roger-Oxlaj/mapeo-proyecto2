"use client";
import { useState } from "react";
import "./login.css"; // 👈 Asegúrate de importar el CSS

export default function Login() {
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const usuario = document.querySelector("#usuario").value;
    const contrasena = document.querySelector("#contrasena").value;

    try {
      const res = await fetch("https://backend-demo-xowfm.ondigitalocean.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Nombre: usuario,
          Contraseña: contrasena,
        }),
        credentials: "include", // para manejar cookies
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || "⚠ Usuario o contraseña incorrectos");
      }

      const data = await res.json();
      console.log("✅ Login exitoso:", data);
      window.location.href = "/mapa";
    } catch (err) {
      console.error("❌ Error en login:", err.message || err);
      alert(err.message || "Error en login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Mapeo de Embarazadas</h1>
        <form onSubmit={handleLogin}>
          <input id="usuario" type="text" placeholder="Usuario" required className="login-input" />
          <input id="contrasena" type="password" placeholder="Contraseña" required className="login-input" />
          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
