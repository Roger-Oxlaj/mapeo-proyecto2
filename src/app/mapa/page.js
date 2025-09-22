"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Mapa.css"; // 👈 Importa los estilos

// Iconos personalizados
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

// Componente para manejar clic en el mapa
function ClickHandler({ setTempMarker }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setTempMarker({ lat, lng });
    },
  });
  return null;
}

export default function Mapa() {
  const [embarazadas, setEmbarazadas] = useState([]);
  const [tempMarker, setTempMarker] = useState(null);

  // Obtener embarazadas desde el backend
  useEffect(() => {
    fetch("https://backend-demo-xowfm.ondigitalocean.app/embarazadas-con-direccion")
      .then((res) => res.json())
      .then((data) => setEmbarazadas(data))
      .catch((err) => console.error("⚠ Error cargando embarazadas:", err));
  }, []);

  return (
    <div className="mapa-container">
      <h1 className="mapa-title">MAPA GEORREFERENCIAL</h1>

      <MapContainer center={[14.533, -91.503]} zoom={13} className="mapa-leaflet">
        {/* Fondo del mapa */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Marcadores dinámicos desde la BD */}
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

        {/* Marcador temporal */}
        {tempMarker && (
          <Marker position={[tempMarker.lat, tempMarker.lng]} icon={iconAgregar}>
            <Popup>
              📍 Nueva ubicación seleccionada
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

        {/* Detectar clics */}
        <ClickHandler setTempMarker={setTempMarker} />
      </MapContainer>
    </div>
  );
}
