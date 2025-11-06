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

function ClickHandler({ setTempMarker }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setTempMarker({ lat, lng });
    },
  });
  return null;
}

function UbicacionHandler({ userPosition, recenter }) {
  const map = useMap();
  useEffect(() => {
    if (userPosition && recenter) {
      map.flyTo([userPosition.lat, userPosition.lng], 16);
    }
  }, [recenter, userPosition]);
  return null;
}

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

  const iconAgregar = new L.Icon({ iconUrl: "/Agregar.png", iconSize: [30, 30] });
  const iconBajo = new L.Icon({ iconUrl: "/Bajo.png", iconSize: [30, 30] });
  const iconMedio = new L.Icon({ iconUrl: "/Medio.png", iconSize: [30, 30] });
  const iconAlto = new L.Icon({ iconUrl: "/Alto.png", iconSize: [30, 30] });
  const iconUsuario = new L.Icon({ iconUrl: "/MiUbicacion.png", iconSize: [35, 35] });

  useEffect(() => {
    fetch("https://backend-demo-xowfm.ondigitalocean.app/embarazadas-con-direccion")
      .then((res) => res.json())
      .then((data) => setEmbarazadas(data))
      .catch((err) => console.error("⚠ Error cargando embarazadas:", err));
  }, []);

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

  const handleRecentrar = () => {
    if (!userPosition) {
      alert("Primero obtén tu ubicación con el botón 'Mi ubicación'");
      return;
    }
    setRecenter(true);
    setTimeout(() => setRecenter(false), 100);
  };

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
  };

  return (
    <div className="mapa-container">
      {/* 🔷 NUEVOS TÍTULOS */}
      <div className="titulo-contenedor">
        <h1 className="titulo-principal">DDRISS DE SUCHITEPEQUEZ</h1>
        <h2 className="titulo-secundario">DEPARTAMENTO DE TECNOLOGIAS DE LA INFORMACION</h2>
        <h3 className="titulo-terciario">PROGRAMA DE SALUD REPRODUCTIVA</h3>
      </div>

      {/* 🔍 Barra de búsqueda y botones */}
      <div className="mapa-topbar">
        <input
          type="text"
          placeholder="Buscar embarazada..."
          className="mapa-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="mapa-btn btn-buscar" onClick={handleBuscar}>
          <img src="/BuscarIcono.png" alt="buscar" className="btn-icon" />
          Buscar
        </button>
      </div>

      {/* 📍 Botones fuera del cuadro azul (solo en móviles) */}
      <div className="botones-secundarios">
        <button className="mapa-btn" onClick={handleUbicacion}>
          <img src="/UbicacionIcono.png" alt="ubicacion" className="btn-icon" />
          Mi Ubicación
        </button>
        <button className="mapa-btn" onClick={handleRecentrar}>
          <img src="/CentrarIcono.png" alt="centrar" className="btn-icon" />
          Centrar
        </button>
      </div>

      <MapContainer center={[14.533, -91.503]} zoom={13} className="mapa-leaflet">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <UbicacionHandler userPosition={userPosition} recenter={recenter} />
        <FlyToEmbarazada embarazada={selectedEmbarazada} />

        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]} icon={iconUsuario}>
            <Popup>📍 Aquí estás tú</Popup>
          </Marker>
        )}

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
