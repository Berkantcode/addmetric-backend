import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const FunnelTrendChart = ({ start, end }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!start || !end) return;

    fetch(`http://127.0.0.1:5000/api/analytics/funnel-comparison?start=${start}&end=${end}`)
      .then((res) => res.json())
      .then(setData);
  }, [start, end]);

  if (!data) return <p>Yükleniyor...</p>;

  const labels = ["Farkındalık", "Düşünce", "Satın Alma"];
  const currentValues = [
    data.current.farkindalik,
    data.current.dusunce,
    data.current.satin_alma,
  ];
  const previousValues = [
    data.previous.farkindalik,
    data.previous.dusunce,
    data.previous.satin_alma,
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Mevcut Dönem",
        data: currentValues,
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
      },
      {
        label: "Önceki Dönem",
        data: previousValues,
        borderColor: "#F87171",
        backgroundColor: "#F87171",
      },
    ],
  };

  return (
    <div className="bg-white p-6 shadow rounded mt-8">
      <h3 className="text-lg font-semibold mb-2">⏳ Funnel Trend Karşılaştırması</h3>
      <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
    </div>
  );
};

export default FunnelTrendChart;
