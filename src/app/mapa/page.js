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

// Iconos personalizados BD
const iconAgregar = new L.Icon({ iconUrl: "/Agregar.png", iconSize: [30, 30] });
const iconBajo = new L.Icon({ iconUrl: "/Bajo.png", iconSize: [30, 30] });
const iconMedio = new L.Icon({ iconUrl: "/Medio.png", iconSize: [30, 30] });
const iconAlto = new L.Icon({ iconUrl: "/Alto.png", iconSize: [30, 30] });

// Icono ubicación usuario
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// 🔹 Hook para mover el mapa automáticamente
function AutoMove({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 17);
  }, [position]);
  return null;
}

// 🔹 Manejar clics para registrar
function ClickHandler({ setTempMarker }) {
  useMapEvents({
    click(e) {
      setTempMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function Mapa() {
  const [embarazadas, setEmbarazadas] = useState([]);
  const [tempMarker, setTempMarker] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Cargar BD
  useEffect(() => {
    fetch("https://backend-demo-xowfm.ondigitalocean.app/embarazadas-con-direccion")
      .then((res) => res.json())
      .then((data) => setEmbarazadas(data))
      .catch((err) => console.error("⚠ Error cargando embarazadas:", err));
  }, []);

  // ✅ Seguimiento en tiempo real
  const empezarSeguimiento = () => {
    if (!navigator.geolocation) {
      alert("⚠ Tu dispositivo no tiene GPS o está deshabilitado.");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude]);
        setAccuracy(pos.coords.accuracy);
      },
      (err) => {
        console.warn("GPS error:", err.message);
        alert("⚠ Activa permisos de ubicación.");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    setWatchId(id);
  };

  const detenerSeguimiento = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    setWatchId(null);
  };

  return (
    <div className="mapa-container">
      <h1 className="mapa-title">MAPA GEORREFERENCIAL</h1>

      <MapContainer center={[14.533, -91.503]} zoom={13} className="mapa-leaflet">

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Marcadores BD */}
        {embarazadas.map((e) => {
          let icono = iconBajo;
          if (e.Nivel === "Medio") icono = iconMedio;
          if (e.Nivel === "Alto") icono = iconAlto;

          return (
            <Marker key={e.ID_Embarazada} position={[e.Latitud, e.Longitud]} icon={icono}>
              <Popup>
                <b>{e.Nombre}</b><br />
                Edad: {e.Edad} años <br />
                Riesgo: {e.Nivel}
              </Popup>
            </Marker>
          );
        })}

        {/* Marcador dinámico del usuario */}
        {userPosition && (
          <>
            <Marker position={userPosition} icon={userIcon}>
              <Popup>
                📍 Estás aquí <br />
                🎯 Precisión: {accuracy ? accuracy.toFixed(0) : "?"} metros
              </Popup>
            </Marker>
            <AutoMove position={userPosition} />
          </>
        )}

        {/* Marcador temporal */}
        {tempMarker && (
          <Marker position={[tempMarker.lat, tempMarker.lng]} icon={iconAgregar}>
            <Popup>
              Nueva posición
              <button className="popup-button"
                onClick={() => {
                  localStorage.setItem("lat", tempMarker.lat);
                  localStorage.setItem("lng", tempMarker.lng);
                  window.location.href = "/registro";
                }}>
                ➕ Registrar embarazada
              </button>
            </Popup>
          </Marker>
        )}

        <ClickHandler setTempMarker={setTempMarker} />
      </MapContainer>

      {/* ✅ Botón flotante activar GPS */}
      {!watchId ? (
        <button className="btn-ubicacion" onClick={empezarSeguimiento}>
          ▶ Activar GPS
        </button>
      ) : (
        <button className="btn-ubicacion" onClick={detenerSeguimiento}>
          ⏸ Detener GPS
        </button>
      )}
    </div>
  );
}
