import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PageViewsChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics/pageviews")
      .then(res => res.json())
      .then(data => {
        setChartData({
          labels: data.map(item => item.path),
          datasets: [
            {
              label: "Sayfa Görüntüleme",
              data: data.map(item => parseInt(item.views)),
              backgroundColor: "rgba(75,192,192,0.6)",
              borderRadius: 4,
            }
          ]
        });
      });
  }, []);

  if (!chartData) return <p>Yükleniyor...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-xl font-semibold mb-4">Sayfa Görüntüleme Grafiği</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default PageViewsChart;
