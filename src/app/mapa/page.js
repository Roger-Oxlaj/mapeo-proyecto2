"use client";
import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Mapa.css";

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
const iconSeleccionada = new L.Icon({
  iconUrl: "/Seleccion.png", // Puedes crear un icono amarillo o diferente
  iconSize: [40, 40],
});

// 🖱️ Componente para manejar clics
function ClickHandler({ setTempMarker }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setTempMarker({ lat, lng });
    },
  });
  return null;
}

// 📍 Componente para mover el mapa según la ubicación
function UbicacionHandler({ userPosition, recenter }) {
  const map = useMap();

  useEffect(() => {
    if (userPosition && recenter) {
      map.flyTo([userPosition.lat, userPosition.lng], 16);
    }
  }, [recenter, userPosition]);

  return null;
}

export default function Mapa() {
  const [embarazadas, setEmbarazadas] = useState([]);
  const [tempMarker, setTempMarker] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [recenter, setRecenter] = useState(false);
  const [selectedEmbarazada, setSelectedEmbarazada] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const mapRef = useRef(null);

  // 🚀 Obtener embarazadas desde backend
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

  // 🔁 Recentrar mapa
  const handleRecentrar = () => {
    if (!userPosition) {
      alert("Primero obtén tu ubicación con el botón 'Mi ubicación'");
      return;
    }
    setRecenter(true);
    setTimeout(() => setRecenter(false), 100);
  };

  // 🔍 Buscar embarazada
  const handleBuscar = () => {
    if (!searchTerm.trim()) return;

    const encontrada = embarazadas.find((e) =>
      e.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!encontrada) {
      alert("No se encontró ninguna embarazada con ese nombre.");
      return;
    }

    setSelectedEmbarazada(encontrada);
    if (mapRef.current) {
      mapRef.current.flyTo([encontrada.Latitud, encontrada.Longitud], 17);
    }
  };

  return (
    <div className="mapa-container">
      <h1 className="mapa-title">MAPA GEORREFERENCIAL</h1>

      {/* 🔝 Barra superior con búsqueda */}
      <div className="mapa-topbar">
        <button className="mapa-btn" onClick={handleUbicacion}>
          <img src="/UbicacionIcono.png" alt="ubicacion" className="btn-icon" />
          Ver mi ubicación
        </button>

        <button className="mapa-btn" onClick={handleRecentrar}>
          <img src="/CentrarIcono.png" alt="centrar" className="btn-icon" />
          Centrar en mi ubicación
        </button>

        {/* 🔍 Búsqueda */}
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

      <MapContainer
        center={[14.533, -91.503]}
        zoom={13}
        className="mapa-leaflet"
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <UbicacionHandler userPosition={userPosition} recenter={recenter} />

        {/* 📌 Usuario */}
        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]} icon={iconUsuario}>
            <Popup>📍 Aquí estás tú</Popup>
          </Marker>
        )}

        {/* 👩‍🍼 Embarazadas */}
        {embarazadas.map((e) => {
          let icono = iconBajo;
          if (e.Nivel === "Medio") icono = iconMedio;
          if (e.Nivel === "Alto") icono = iconAlto;
          if (selectedEmbarazada && selectedEmbarazada.ID_Embarazada === e.ID_Embarazada)
            icono = iconSeleccionada;

          return (
            <Marker key={e.ID_Embarazada} position={[e.Latitud, e.Longitud]} icon={icono}>
              <Popup autoOpen={selectedEmbarazada?.ID_Embarazada === e.ID_Embarazada}>
                <b>{e.Nombre}</b> <br />
                Edad: {e.Edad} años <br />
                Riesgo: {e.Nivel}
              </Popup>
            </Marker>
          );
        })}

        {/* 📍 Marcador temporal */}
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
      </MapContainer>
    </div>
  );
}
