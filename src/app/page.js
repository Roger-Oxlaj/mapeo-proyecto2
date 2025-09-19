"use client";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const usuario = document.querySelector("#usuario").value;
    const contrasena = document.querySelector("#contrasena").value;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Nombre: usuario,
          Contraseña: contrasena,
        }),
        credentials: "include",
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#e8f5e9",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 0 15px rgba(0,0,0,0.15)",
          width: "350px",
        }}
      >
        <h1 style={{ color: "#2e7d32", marginBottom: "25px", fontSize: "25px", fontWeight: "bold"}}>
          Mapeo de Embarazadas
        </h1>

        <form onSubmit={handleLogin}>
          <input id="usuario" type="text" placeholder="Usuario" required style={{display: "block", margin: "15px auto", padding: "12px", width: "90%", fontSize: "16px", border: "2px solid #ccc", borderRadius: "8px", color: "#333", fontWeight: "bold", }}/>
          <input
            id="contrasena"
            type="password"
            placeholder="Contraseña"
            required
            style={{
              display: "block",
              margin: "15px auto",
              padding: "12px",
              width: "90%",
              fontSize: "16px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              color: "#333",
              fontWeight: "bold",
            }}/>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#2e7d32",
              color: "white",
              fontSize: "16px",
              padding: "12px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "20px",
              width: "95%",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
