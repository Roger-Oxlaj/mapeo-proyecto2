"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

//Iconos personalizados según el nivel de riesgo
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

//Componente para manejar clic en el mapa
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

  //Obtener embarazadas con sus coordenadas desde el backend
  useEffect(() => {
    fetch("http://localhost:3001/embarazadas-con-direccion")
      .then((res) => res.json())
      .then((data) => setEmbarazadas(data))
      .catch((err) => console.error("⚠ Error cargando embarazadas:", err));
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#3307f3ff" }}>
      <h1
        style={{
          textAlign: "center",
          color: "#fdfffdff",
          padding: "15px",
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        MAPA GEORREFERENCIAL
      </h1>

      <MapContainer 
      center={[14.533, -91.503]} 
      zoom={13} 
      style={{ 
        height: "80%", 
        width: "100%", 
        zindex: 0, 
        position: "relative"
        }}>
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
            <Marker
              key={e.ID_Embarazada}
              position={[e.Latitud, e.Longitud]}
              icon={icono}
            >
              <Popup>
                <b>{e.Nombre}</b> <br />
                Edad: {e.Edad} años <br />
                Riesgo: {e.Nivel}
              </Popup>
            </Marker>
          );
        })}

        {/* Marcador temporal al hacer clic */}
        {tempMarker && (
          <Marker position={[tempMarker.lat, tempMarker.lng]}
            icon={iconAgregar}>
            <Popup>
              📍 Nueva ubicación seleccionada
              <br />
              <button
                style={{
                  marginTop: "5px",
                  padding: "6px 10px",
                  backgroundColor: "#2e7d32",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  // Guardar coordenadas en localStorage
                  localStorage.setItem("lat", tempMarker.lat);
                  localStorage.setItem("lng", tempMarker.lng);
                  // Redirigir al registro
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
