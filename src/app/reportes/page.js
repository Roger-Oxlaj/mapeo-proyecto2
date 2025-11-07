"use client";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import "./reportes.css";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

export default function Reportes() {
  const [riesgosGlobales, setRiesgosGlobales] = useState({ bajo: 0, medio: 0, alto: 0 });
  const [riesgosPorMunicipio, setRiesgosPorMunicipio] = useState({});

  const MUNICIPIOS = [
    "Chicacao", "Cuyotenango", "Mazatenango", "Patulul", "Pueblo Nuevo",
    "Río Bravo", "Samayac", "San Antonio Suchitepéquez", "San Bernardino",
    "San Francisco Zapotitlán", "San Gabriel", "San José El Ídolo",
    "San Juan Bautista", "San Lorenzo", "San Miguel Panán",
    "San Pablo Jocopilas", "Santa Bárbara", "Santo Domingo Suchitepéquez",
    "Santo Tomás La Unión", "Zunilito", "San Andrés Villa Seca"
  ];

  useEffect(() => {
    // Cargar datos combinados desde el endpoint listo
    fetch("https://backend-demo-xowfm.ondigitalocean.app/embarazadas-con-direccion")
      .then((res) => res.json())
      .then((data) => {
        // Inicializar estructura para conteos por municipio
        const conteosMunicipios = {};
        MUNICIPIOS.forEach((m) => {
          conteosMunicipios[m] = { Bajo: 0, Medio: 0, Alto: 0 };
        });

        // Inicializar conteos globales
        const global = { bajo: 0, medio: 0, alto: 0 };

        data.forEach((item) => {
          const muni = item.Municipio;
          const nivel = item.Nivel;

          // Conteo global
          if (nivel === "Bajo") global.bajo++;
          if (nivel === "Medio") global.medio++;
          if (nivel === "Alto") global.alto++;

          // Conteo por municipio
          if (conteosMunicipios[muni]) {
            conteosMunicipios[muni][nivel]++;
          }
        });

        setRiesgosGlobales(global);
        setRiesgosPorMunicipio(conteosMunicipios);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  // 🎯 Datos para el pastel global
  const dataPastel = {
    labels: ["Bajo", "Medio", "Alto"],
    datasets: [
      {
        data: [riesgosGlobales.bajo, riesgosGlobales.medio, riesgosGlobales.alto],
        backgroundColor: ["#4caf50", "#ffb300", "#e53935"],
      },
    ],
  };

  return (
    <div className="reportes-container">
      <h1 className="reportes-title">REPORTES Y ESTADÍSTICAS</h1>

      {/* 📊 Gráfica global de pastel */}
      <div className="reportes-grid">
        <div className="report-card">
          <h3 className="report-card-title">Proporción de embarazadas (General)</h3>
          <Pie data={dataPastel} />
        </div>
      </div>

      {/* 🏙️ Gráficas por municipio */}
      <h2 className="reportes-title" style={{ marginTop: "30px" }}>
        Riesgo por Municipio
      </h2>
      <div className="reportes-grid">
        {Object.entries(riesgosPorMunicipio).map(([muni, valores]) => (
          <div key={muni} className="report-card">
            <h3 className="report-card-title">{muni}</h3>
            <Bar
              data={{
                labels: ["Bajo", "Medio", "Alto"],
                datasets: [
                  {
                    label: "Cantidad de embarazadas",
                    data: [valores.Bajo, valores.Medio, valores.Alto],
                    backgroundColor: ["#4caf50", "#ffb300", "#e53935"],
                  },
                ],
              }}
              options={{
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
