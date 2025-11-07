"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const [cargando, setCargando] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rol, setRol] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("https://backend-demo-xowfm.ondigitalocean.app/check-session", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error de red en check-session");
        const data = await res.json();

        if (data.loggedIn) {
          setIsLoggedIn(true);
          setRol(data.user?.Rol || null);
        } else {
          if (pathname !== "/") router.push("/");
        }
      } catch (err) {
        console.error("Error verificando sesión:", err);
        if (pathname !== "/") router.push("/");
      } finally {
        setCargando(false);
      }
    };

    checkSession();
  }, [router, pathname]);

  async function handleLogout() {
    try {
      await fetch("https://backend-demo-xowfm.ondigitalocean.app/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("❌ Error cerrando sesión:", err);
    } finally {
      setIsLoggedIn(false);
      router.push("/");
    }
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  const showMenu = isLoggedIn && pathname !== "/";

  return (
    <div className="min-h-screen flex relative">
      {/* Botón hamburguesa */}
      {showMenu && (
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-green-700 text-white p-2 rounded"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      )}

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Menú lateral */}
      {showMenu && (
        <aside
          className={`fixed lg:static top-0 left-0 min-h-screen w-64 bg-pink-800 text-white p-6 z-[9999]
          transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 transition-transform duration-300 z-50`}
        >
          <h2 className="text-2xl font-bold text-white bg-black px-4 py-2 text-center rounded">
            MENU
          </h2>

          <nav className="space-y-3 mt-6">
            <Link href="/mapa" className="block hover:bg-green-600 p-1 rounded font-bold">
              MAPA
            </Link>
            <Link href="/embarazadas" className="block hover:bg-green-600 p-1 rounded font-bold">
              EMBARAZADAS
            </Link>
            <Link href="/seguimiento" className="block hover:bg-green-600 p-1 rounded font-bold">
              SEGUIMIENTOS
            </Link>
            <Link href="/riesgos" className="block hover:bg-green-600 p-1 rounded font-bold">
              RIESGOS
            </Link>
            <Link href="/reportes" className="block hover:bg-green-600 p-1 rounded font-bold">
              REPORTES
            </Link>

            {/* 🔹 Enlace solo visible si el usuario es Admin */}
            {rol === "Admin" && (
              <Link href="/usuarios" className="block hover:bg-green-600 p-1 rounded font-bold">
                USUARIOS
              </Link>
            )}
          </nav>
          {/* 🔹 Botón de cerrar sesión arriba */}
          <button
            onClick={handleLogout}
            className="block w-full text-center bg-red-600 hover:bg-red-500 text-white p-2 font-bold rounded-full mt-4"
          >
            Cerrar Sesión
          </button>

        </aside>
      )}

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
