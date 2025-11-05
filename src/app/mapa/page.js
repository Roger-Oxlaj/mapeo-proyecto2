"use client";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Mapa.css";

// 🎬 Componente para mostrar el GIF sobre la embarazada seleccionada
function GifOverlay({ embarazada, gifName }) {
  const map = useMap();
  const [screenPos, setScreenPos] = useState(null);

  useEffect(() => {
    if (!embarazada) return;

    const { Latitud, Longitud } = embarazada;
    const latlng = L.latLng(Latitud, Longitud);
    const point = map.latLngToContainerPoint(latlng);
    setScreenPos(point);

    // 🎞️ Ocultar el GIF después de 3 segundos
    const timer = setTimeout(() => setScreenPos(null), 3000);
    return () => clearTimeout(timer);
  }, [embarazada, map]);

  if (!screenPos) return null;

  return (
    <img
      src={`/${gifName}`} // 👈 Aquí tu GIF (por ejemplo: CentrarBusqueda.gif)
      alt="Efecto seleccionada"
      style={{
        position: "absolute",
        top: `${screenPos.y}px`,
        left: `${screenPos.x}px`,
        width: "80px",
        height: "80px",
        transform: "translate(-50%, -30%)", // 👈 centra y sube el gif justo encima
        pointerEvents: "none",
        zIndex: 1000,
        animation: "fadeOut 3s ease forwards",
      }}
    />
  );
}

// 🖱️ Detectar clics en el mapa
function ClickHandler({ setTempMarker }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setTempMarker({ lat, lng });
    },
  });
  return null;
}

// 📍 Mover mapa cuando cambia ubicación del usuario
function UbicacionHandler({ userPosition, recenter }) {
  const map = useMap();
  useEffect(() => {
    if (userPosition && recenter) {
      map.flyTo([userPosition.lat, userPosition.lng], 16);
    }
  }, [recenter, userPosition]);
  return null;
}

// 🧭 Mover mapa a la embarazada seleccionada
function FlyToEmbarazada({ embarazada }) {
  const map = useMap();

  useEffect(() => {
    if (embarazada) {
      map.flyTo([embarazada.Latitud, embarazada.Longitud], 17, { duration: 1.2 });
    }
  }, [embarazada]);

  return null;
}

export default function Mapa() {
  const [embarazadas, setEmbarazadas] = useState([]);
  const [tempMarker, setTempMarker] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [recenter, setRecenter] = useState(false);
  const [selectedEmbarazada, setSelectedEmbarazada] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 🎯 Iconos personalizados
  const iconAgregar = new L.Icon({
    iconUrl: "/Agregar.png",
    iconSize: [30, 30],
  });
  const iconBajo = new L.Icon({
    iconUrl: "/Bajo.png",
    iconSize: [30, 30],
  });
  const iconMedio = new L.Icon({
    iconUrl: "/Medio.png",
    iconSize: [30, 30],
  });
  const iconAlto = new L.Icon({
    iconUrl: "/Alto.png",
    iconSize: [30, 30],
  });
  const iconUsuario = new L.Icon({
    iconUrl: "/MiUbicacion.png",
    iconSize: [35, 35],
  });

  // 🚀 Obtener embarazadas
  useEffect(() => {
    fetch("https://backend-demo-xowfm.ondigitalocean.app/embarazadas-con-direccion")
      .then((res) => res.json())
      .then((data) => setEmbarazadas(data))
      .catch((err) => console.error("⚠ Error cargando embarazadas:", err));
  }, []);

  // 📍 Obtener ubicación del usuario
  const handleUbicacion = () => {
    if (!navigator.geolocation) {
      alert("⚠ Tu dispositivo no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPosition({ lat: latitude, lng: longitude });
        setRecenter(true);
      },
      () => {
        alert("⚠ Activa la ubicación y da permisos al navegador.");
      }
    );
  };

  // 🔁 Recentrar mapa en usuario
  const handleRecentrar = () => {
    if (!userPosition) {
      alert("Primero obtén tu ubicación con el botón 'Mi ubicación'");
      return;
    }
    setRecenter(true);
    setTimeout(() => setRecenter(false), 100);
  };

  // 🔍 Buscar embarazada y centrar mapa
  const handleBuscar = () => {
    if (!searchTerm.trim()) return;

    const encontrada = embarazadas.find((e) =>
      e.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!encontrada) {
      alert("No se encontró ninguna embarazada con ese nombre.");
      return;
    }

    setSelectedEmbarazada(encontrada); // activa FlyToEmbarazada y el GIF
  };

  return (
    <div className="mapa-container">
      <h1 className="mapa-title">MAPA GEORREFERENCIAL</h1>

      {/* 🔝 Barra de botones */}
      <div className="mapa-topbar">
        <button className="mapa-btn" onClick={handleUbicacion}>
          <img src="/UbicacionIcono.png" alt="ubicacion" className="btn-icon" />
          Ver mi ubicación
        </button>

        <button className="mapa-btn" onClick={handleRecentrar}>
          <img src="/CentrarIcono.png" alt="centrar" className="btn-icon" />
          Centrar en mi ubicación
        </button>

        <input
          type="text"
          placeholder="Buscar embarazada..."
          className="mapa-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="mapa-btn" onClick={handleBuscar}>
          🔍 Buscar
        </button>
      </div>

      <MapContainer center={[14.533, -91.503]} zoom={13} className="mapa-leaflet">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <UbicacionHandler userPosition={userPosition} recenter={recenter} />
        <FlyToEmbarazada embarazada={selectedEmbarazada} />

        {/* 📍 Tu ubicación */}
        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]} icon={iconUsuario}>
            <Popup>📍 Aquí estás tú</Popup>
          </Marker>
        )}

        {/* 👩‍🍼 Marcadores */}
        {embarazadas.map((e) => {
          let icono = iconBajo;
          if (e.Nivel === "Medio") icono = iconMedio;
          if (e.Nivel === "Alto") icono = iconAlto;

          return (
            <Marker key={e.ID_Embarazada} position={[e.Latitud, e.Longitud]} icon={icono}>
              <Popup>
                <b>{e.Nombre}</b> <br />
                Edad: {e.Edad} años <br />
                Riesgo: {e.Nivel}
              </Popup>
            </Marker>
          );
        })}

        {/* 📍 Nuevo marcador temporal */}
        {tempMarker && (
          <Marker position={[tempMarker.lat, tempMarker.lng]} icon={iconAgregar}>
            <Popup>
              Nueva ubicación seleccionada
              <br />
              <button
                className="popup-button"
                onClick={() => {
                  localStorage.setItem("lat", tempMarker.lat);
                  localStorage.setItem("lng", tempMarker.lng);
                  window.location.href = "/registro";
                }}
              >
                ➕ Registrar embarazada
              </button>
            </Popup>
          </Marker>
        )}

        <ClickHandler setTempMarker={setTempMarker} />

        {/* ✨ GIF overlay */}
        <GifOverlay embarazada={selectedEmbarazada} gifName="CentrarBusqueda.gif" />
      </MapContainer>
    </div>
  );
}
