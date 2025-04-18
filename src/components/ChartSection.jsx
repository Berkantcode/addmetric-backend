import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const ChartSection = () => {
  const [selectedMetric, setSelectedMetric] = useState("spend");
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");

  const rawData = {
    daily: {
      labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
      spend: [4.2, 2.6, 2.9, 5.1, 1.3, 2.5, 3.8],
      roas: [1.8, 2.0, 1.6, 2.3, 1.9, 2.5, 2.1],
      impressions: [800, 650, 700, 900, 400, 600, 750]
    },
    weekly: {
      labels: ["Mart 1", "Mart 2", "Mart 3", "Mart 4", "Nisan 1"],
      spend: [22.3, 18.6, 19.8, 25.4, 21.1],
      roas: [2.2, 2.0, 2.5, 1.9, 2.3],
      impressions: [5400, 5000, 5900, 4800, 5300]
    }
  };

  const metricLabels = {
    spend: "Harcama ($)",
    roas: "ROAS",
    impressions: "Gösterim"
  };

  const data = {
    labels: rawData[selectedPeriod].labels,
    datasets: [
      {
        label: `${selectedPeriod === "daily" ? "Günlük" : "Haftalık"} ${metricLabels[selectedMetric]}`,
        data: rawData[selectedPeriod][selectedMetric],
        fill: false,
        borderColor: "#06b6d4",
        backgroundColor: "#06b6d4",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: metricLabels[selectedMetric]
        }
      },
      x: {
        title: {
          display: true,
          text: selectedPeriod === "daily" ? "Günler" : "Haftalar"
        }
      }
    }
  };

  return (
    <div className="mt-10">
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div>
          <label className="text-sm mr-2 font-semibold">Metrik:</label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="spend">Harcama ($)</option>
            <option value="roas">ROAS</option>
            <option value="impressions">Gösterim</option>
          </select>
        </div>
        <div>
          <label className="text-sm mr-2 font-semibold">Periyot:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="daily">Günlük</option>
            <option value="weekly">Haftalık</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="text-lg font-semibold text-center mb-4">
          {selectedPeriod === "daily" ? "Günlük" : "Haftalık"} {metricLabels[selectedMetric]} Grafiği
        </h4>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartSection;
