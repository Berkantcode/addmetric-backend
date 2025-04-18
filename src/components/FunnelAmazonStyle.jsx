import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const FunnelAmazonStyle = ({ start, end }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!start || !end) return;

    fetch(`http://127.0.0.1:5000/api/analytics/funnel-comparison?start=${start}&end=${end}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => {
        console.error("Karşılaştırmalı Funnel API Hatası:", err);
        setData(null);
      });
  }, [start, end]);

  if (!data) return <p>Yükleniyor...</p>;

  const steps = ["farkindalik", "dusunce", "satin_alma"];
  const labels = {
    farkindalik: "Farkındalık",
    dusunce: "Düşünce",
    satin_alma: "Satın Alma",
  };
  const explanations = {
    farkindalik: "Ziyaretçilerin markanızla ilk kez karşılaştığı aşamadır.",
    dusunce: "Kullanıcılar ürününüzü değerlendiriyor.",
    satin_alma: "Kullanıcılar ödeme adımına geçti. Sepet dönüşüm oranlarını analiz edin.",
  };

  const chartData = {
    labels: steps.map((s) => labels[s]),
    datasets: [
      {
        label: "Geçerli Dönem",
        data: steps.map((s) => data.current[s]),
        borderColor: "#3B82F6",
        fill: false,
      },
      {
        label: "Önceki Dönem",
        data: steps.map((s) => data.previous[s]),
        borderColor: "#F59E0B",
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-3">🧭 Huni Performans Ölçümleri</h2>
      <p className="text-sm text-gray-600 mb-6">
        Farkındalık → Düşünce → Satın Alma aşamalarının dönüşümünü takip edin.
      </p>

      {/* Karşılaştırmalı Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {steps.map((step, i) => {
          const current = data.current[step];
          const previous = data.previous[step];
          const diff = current - previous;
          const change = previous === 0 ? 0 : ((diff / previous) * 100).toFixed(2);

          return (
            <div key={i} className="bg-gray-50 p-4 rounded shadow flex flex-col gap-2">
              <div className="text-sm text-gray-500">{labels[step]}</div>
              <div className="text-2xl font-bold">{current}</div>
              <div className={`text-sm ${change < 0 ? "text-red-500" : "text-green-500"}`}>
                {change < 0 ? "↓" : "↑"} {Math.abs(change)}%
              </div>
              <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded mt-2">
                {explanations[step]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trend Grafiği */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold mb-2">📉 Dönem Karşılaştırma Grafiği</h3>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
            },
            scales: {
              y: {
                ticks: { stepSize: 1 },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default FunnelAmazonStyle;
