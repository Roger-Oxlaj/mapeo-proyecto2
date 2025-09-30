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

import "./reportes.css"; // 👈 Importacion de los estilos

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

export default function Reportes() {
  const [riesgos, setRiesgos] = useState({ bajo: 0, medio: 0, alto: 0 });

  useEffect(() => {
    fetch("https://backend-demo-xowfm.ondigitalocean.app/reportes/riesgos")
      .then((res) => res.json())
      .then((data) => {
        const conteos = { bajo: 0, medio: 0, alto: 0 };

        data.forEach((item) => {
          if (item.Nivel === "Bajo") conteos.bajo = item.Cantidad;
          if (item.Nivel === "Medio") conteos.medio = item.Cantidad;
          if (item.Nivel === "Alto") conteos.alto = item.Cantidad;
        });

        setRiesgos(conteos);
      })
      .catch((err) => console.error("Error cargando riesgos:", err));
  }, []);

  const dataBarras = {
    labels: ["Bajo", "Medio", "Alto"],
    datasets: [
      {
        label: "Cantidad de embarazadas",
        data: [riesgos.bajo, riesgos.medio, riesgos.alto],
        backgroundColor: ["#4caf50", "#ffb300", "#e53935"],
      },
    ],
  };

  const dataPastel = {
    labels: ["Bajo", "Medio", "Alto"],
    datasets: [
      {
        data: [riesgos.bajo, riesgos.medio, riesgos.alto],
        backgroundColor: ["#4caf50", "#ffb300", "#e53935"],
      },
    ],
  };

  return (
    <div className="reportes-container">
      <h1 className="reportes-title">REPORTES Y ESTADISTICAS</h1>

      <div className="reportes-grid">
        <div className="report-card">
          <h3 className="report-card-title">Distribución por nivel de riesgo</h3>
          <Bar data={dataBarras} />
        </div>

        <div className="report-card">
          <h3 className="report-card-title">Proporción de embarazadas</h3>
          <Pie data={dataPastel} />
        </div>
      </div>
    </div>
  );
}
