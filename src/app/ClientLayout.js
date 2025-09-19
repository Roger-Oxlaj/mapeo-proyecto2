
"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaypalDonateButton from "./PaypalDonateButton";

export default function ClientLayout({ children }) {
  const [cargando, setCargando] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("https://backend-demo-xowfm.ondigitalocean.app/check-session", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.loggedIn) {
          setIsLoggedIn(true);
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("Error verificando sesión:", err);
        router.push("/");
      } finally {
        setCargando(false);
      }
    };

    checkSession();
  }, [router]);

  async function handleLogout() {
    try {
      await fetch("/api/logout", {
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
        <p className="text-xl text-gray-600">🔄 Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative">
      {/* 🔹 Botón hamburguesa (solo en móvil) */}
      {isLoggedIn && (
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-green-700 text-white p-2 rounded"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      )}

      {/* 🔹 Overlay oscuro detrás del menú */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* 🔹 Menú lateral */}
      {isLoggedIn && (
        <aside
          className={`fixed lg:static top-0 left-0 h-full w-64 bg-green-800 text-white p-6 z-[9999]
          transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 transition-transform duration-300 z-50`}
        >
          <h2 className="text-2xl font-bold text-white bg-blue-300 px-4 py-2 text-center rounded">
            MENU
          </h2>
          <nav className="space-y-3 mt-4">
            <Link href="/mapa" className="block hover:bg-green-600 p-1 rounded font-bold">
              MAPA
            </Link>
            <Link href="/embarazadas" className="block hover:bg-green-600 p-1 rounded font-bold">
              EMBARAZADAS
            </Link>
            <Link href="/seguimiento" className="block hover:bg-green-600 p-1 rounded font-bold">
              SEGUIMIENTOS
            </Link>
            <Link href="/ubicaciones" className="block hover:bg-green-600 p-1 rounded font-bold">
              UBICACIONES
            </Link>
            <Link href="/riesgos" className="block hover:bg-green-600 p-1 rounded font-bold">
              RIESGOS
            </Link>
            <Link href="/direcciones" className="block hover:bg-green-600 p-1 rounded font-bold">
              DIRECCIONES
            </Link>
            <Link href="/usuarios" className="block hover:bg-green-600 p-1 rounded font-bold">
              USUARIOS
            </Link>
            <Link href="/reportes" className="block hover:bg-green-600 p-1 rounded font-bold">
              REPORTES
            </Link>

            <button
              onClick={handleLogout}
              className="block w-full text-center bg-red-600 hover:bg-red-500 text-white p-2 font-bold rounded-full mt-4"
            >
              Cerrar Sesión
            </button>

            <PaypalDonateButton />
          </nav>
        </aside>
      )}

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 p-6">{children}</main>

      {/* Imagen decorativa */}
      <div className="absolute bottom-4 right-4">
        <Image
          src="/Logotipos.png"
          alt="Decoración"
          width={150}
          height={150}
          className="hover:hidden transition-all duration-300"
        />
      </div>
    </div>
  );
}