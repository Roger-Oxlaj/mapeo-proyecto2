"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import PaypalDonateButton from "./PaypalDonateButton";

export default function ClientLayout({ children }) {
  const [cargando, setCargando] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(
          "https://backend-demo-xowfm.ondigitalocean.app/check-session",
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Error de red en check-session");

        const data = await res.json();

        if (data.loggedIn) {
          setIsLoggedIn(true);
        } else {
          if (pathname !== "/") {
            router.push("/");
          }
        }
      } catch (err) {
        console.error("Error verificando sesión:", err);
        if (pathname !== "/") {
          router.push("/");
        }
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
        <p className="text-xl text-gray-600">🔄 Verificando sesión...</p>
      </div>
    );
  }

  const showMenu = isLoggedIn && pathname !== "/";

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Barra superior */}
      {showMenu && (
        <header
          className={`fixed top-0 left-0 w-full bg-green-800 text-white p-4 z-[9999]
          transform ${menuOpen ? "translate-y-0" : "-translate-y-full"} 
          lg:translate-y-0 transition-transform duration-300 flex flex-col lg:flex-row lg:items-center lg:justify-between`}
        >
          {/* Encabezado con botón hamburguesa */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white bg-blue-300 px-4 py-1 rounded">
              MENU
            </h2>
            <button
              className="lg:hidden text-white bg-green-700 p-2 rounded ml-4"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>

          {/* Navegación */}
          <nav
            className={`flex flex-col lg:flex-row lg:space-x-4 mt-3 lg:mt-0 ${
              menuOpen ? "block" : "hidden lg:flex"
            }`}
          >
            <Link
              href="/mapa"
              className="hover:bg-green-600 px-3 py-1 rounded font-bold"
            >
              MAPA
            </Link>
            <Link
              href="/embarazadas"
              className="hover:bg-green-600 px-3 py-1 rounded font-bold"
            >
              EMBARAZADAS
            </Link>
            <Link
              href="/seguimiento"
              className="hover:bg-green-600 px-3 py-1 rounded font-bold"
            >
              SEGUIMIENTOS
            </Link>
            <Link
              href="/ubicaciones"
              className="hover:bg-green-600 px-3 py-1 rounded font-bold"
            >
              UBICACIONES
            </Link>
            <Link
              href="/riesgos"
              className="hover:bg-green-600 px-3 py-1 rounded font-bold"
            >
              RIESGOS
            </Link>
            <Link
              href="/direcciones"
              className="hover:bg-green-600 px-3 py-1 rounded font-bold"
            >
              DIRECCIONES
            </Link>
            <Link
              href="/reportes"
              className="hover:bg-green-600 px-3 py-1 rounded font-bold"
            >
              REPORTES
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 font-bold rounded-full mt-2 lg:mt-0"
            >
              Cerrar Sesión
            </button>

            <div className="mt-2 lg:mt-0">
              <PaypalDonateButton />
            </div>
          </nav>
        </header>
      )}

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 p-6 mt-24">{children}</main>
    </div>
  );
}
