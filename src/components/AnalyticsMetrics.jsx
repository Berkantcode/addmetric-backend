import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels // Etiketler için eklendi
);

const AnalyticsMetrics = () => {
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState(new Date("2025-01-01"));
  const [endDate, setEndDate] = useState(new Date("2025-04-14"));

  useEffect(() => {
    const formatDate = (d) => d.toISOString().split("T")[0];
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    fetch(`http://127.0.0.1:5000/api/analytics/metrics?start=${start}&end=${end}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [startDate, endDate]);

  if (!data) return <p>Yükleniyor...</p>;

  const ulkeLabels = data.ülke_dagilimi.map((item) => item.ulke);
  const ulkeValues = data.ülke_dagilimi.map((item) => item.kullanici);

  const cihazLabels = data.cihaz_dagilimi.map((item) => item.cihaz);
  const cihazValues = data.cihaz_dagilimi.map((item) => item.kullanici);

  const barLabels = ["Oturum Süresi (sn)", "Oturum Sayısı", "Kullanıcı Sayısı"];
  const barValues = [
    Math.round(data.ortalama_sure),
    data.oturum_sayisi,
    data.kullanici_sayisi,
  ];

  return (
    <div className="p-4 mt-10">
      <h2 className="text-xl font-bold mb-4">📊 Diğer Metrikler</h2>

      {/* Tarih Seçimi */}
      <div className="flex gap-4 mb-6 items-center">
        <div>
          <span className="block text-sm font-semibold">Başlangıç Tarihi</span>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="border px-3 py-1 rounded"
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div>
          <span className="block text-sm font-semibold">Bitiş Tarihi</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="border px-3 py-1 rounded"
            dateFormat="yyyy-MM-dd"
          />
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bar */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Genel Veriler (Bar)</h3>
          <Bar
            data={{
              labels: barLabels,
              datasets: [
                {
                  label: "Değerler",
                  data: barValues,
                  backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                datalabels: {
                  color: "#000",
                  anchor: "end",
                  align: "top",
                  font: { weight: "bold" },
                },
              },
            }}
          />
        </div>

        {/* Pie - Ülke */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">🌍 Ülke Dağılımı</h3>
          <Pie
            data={{
              labels: ulkeLabels,
              datasets: [
                {
                  data: ulkeValues,
                  backgroundColor: [
                    "#F87171", "#60A5FA", "#34D399", "#FBBF24", "#A78BFA",
                    "#F472B6", "#4ADE80", "#FACC15", "#818CF8", "#FB923C",
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
                datalabels: {
                  color: "#fff",
                  formatter: (value) => value,
                  font: { weight: "bold", size: 12 },
                },
              },
            }}
          />
        </div>

        {/* Pie - Cihaz */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">📱 Cihaz Dağılımı</h3>
          <Pie
            data={{
              labels: cihazLabels,
              datasets: [
                {
                  data: cihazValues,
                  backgroundColor: ["#F59E0B", "#10B981", "#3B82F6"],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
                datalabels: {
                  color: "#fff",
                  formatter: (value) => value,
                  font: { weight: "bold", size: 12 },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsMetrics;
