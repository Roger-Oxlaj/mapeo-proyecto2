"use client";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  Polyline,
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

// 🖱️ Componente para manejar clic en el mapa
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
  const [selectedRuta, setSelectedRuta] = useState(null);

  // 🚀 Obtener embarazadas desde el backend
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

  // 🎯 Volver a centrar el mapa
  const handleRecentrar = () => {
    if (!userPosition) {
      alert("Primero obtén tu ubicación con el botón 'Mi ubicación'");
      return;
    }
    setRecenter(true);
    setTimeout(() => setRecenter(false), 100); // evita bucles
  };

  // 🗺️ Simular trazado de ruta (ejemplo)
  const handleTrazarRuta = () => {
    if (!userPosition) {
      alert("Primero obtén tu ubicación para trazar una ruta.");
      return;
    }
    const destino = embarazadas[0]; // por ahora, toma la primera como ejemplo
    if (!destino) {
      alert("No hay embarazadas registradas.");
      return;
    }
    setSelectedRuta({
      start: userPosition,
      end: { lat: destino.Latitud, lng: destino.Longitud },
    });
  };

  return (
    <div className="mapa-container">
      <h1 className="mapa-title">MAPA GEORREFERENCIAL</h1>

      {/* 🔝 Barra de controles */}
      <div className="mapa-topbar">
        <button className="mapa-btn" onClick={handleUbicacion}>
          <img src="/UbicacionIcono.png" alt="icono ubicacion" className="btn-icon" />
          Ver mi ubicación
        </button>
        <button className="mapa-btn" onClick={handleRecentrar}>
          Centrar en mi ubicación
        </button>
      </div>

      <MapContainer center={[14.533, -91.503]} zoom={13} className="mapa-leaflet">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Movimiento según ubicación */}
        <UbicacionHandler userPosition={userPosition} recenter={recenter} />

        {/* 📌 Tu ubicación */}
        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]} icon={iconUsuario}>
            <Popup>📌 Aquí estás tú</Popup>
          </Marker>
        )}

        {/* 👩‍🍼 Marcadores BD */}
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
      </MapContainer>
    </div>
  );
}
