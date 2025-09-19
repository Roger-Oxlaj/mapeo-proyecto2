<<<<<<< HEAD
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

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

export default function Reportes() {
  const [riesgos, setRiesgos] = useState({ bajo: 0, medio: 0, alto: 0 });

  useEffect(() => {
    fetch("http://localhost:3001/reportes/riesgos") // 🔹 Ajusta la URL/puerto de tu backend
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
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f0f4f8",
        minHeight: "100vh",
        textAlign: "left",
      }}
    >
      <h1
        style={{
          color: "#2e7d32",
          fontSize: "32px",
          marginBottom: "30px",
          fontWeight: "bold",
        }}
      >
        REPORTES Y ESTADISTICAS
      </h1>

      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        <div
          style={{
            width: "45%",
            marginBottom: "30px",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              marginBottom: "15px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
              textAlign: "Left",
            }}
          >
            Distribución por nivel de riesgo
          </h3>
          <Bar data={dataBarras} />
        </div>

        <div
          style={{
            width: "45%",
            marginBottom: "30px",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              marginBottom: "15px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
              textAlign: "Left",
            }}
          >
            Proporción de embarazadas
          </h3>
          <Pie data={dataPastel} />
        </div>
      </div>
    </div>
  );
}
=======
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

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

export default function Reportes() {
  const [riesgos, setRiesgos] = useState({ bajo: 0, medio: 0, alto: 0 });

  useEffect(() => {
    fetch("http://localhost:3001/reportes/riesgos") // 🔹 Ajusta la URL/puerto de tu backend
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
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f0f4f8",
        minHeight: "100vh",
        textAlign: "left",
      }}
    >
      <h1
        style={{
          color: "#2e7d32",
          fontSize: "32px",
          marginBottom: "30px",
          fontWeight: "bold",
        }}
      >
        REPORTES Y ESTADISTICAS
      </h1>

      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        <div
          style={{
            width: "45%",
            marginBottom: "30px",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              marginBottom: "15px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
              textAlign: "Left",
            }}
          >
            Distribución por nivel de riesgo
          </h3>
          <Bar data={dataBarras} />
        </div>

        <div
          style={{
            width: "45%",
            marginBottom: "30px",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              marginBottom: "15px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
              textAlign: "Left",
            }}
          >
            Proporción de embarazadas
          </h3>
          <Pie data={dataPastel} />
        </div>
      </div>
    </div>
  );
}
>>>>>>> 4f8914e (actualizado)
