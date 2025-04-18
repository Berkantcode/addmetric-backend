import React, { useState } from "react";
import PageViewsChart from "../PageViewsChart";
import FunnelAmazonStyle from "../components/FunnelAmazonStyle";
import AnalyticsMetrics from "../components/AnalyticsMetrics";
import FunnelTrendChart from "../components/FunnelTrendChart"; // ✅ Yeni bileşen eklendi

const Analytics = () => {
  const [start, setStart] = useState("2025-01-01");
  const [end, setEnd] = useState("2025-04-14");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📊 Analytics Sayfası</h1>

      {/* 📅 Tarih Seçimi */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      {/* 📈 Sayfa Görüntüleme Grafiği */}
      <PageViewsChart />

      {/* 🧭 Funnel Performansı (Amazon Stili) */}
      <div className="mt-10">
        <FunnelAmazonStyle start={start} end={end} />
      </div>

      {/* 📉 Funnel Trend Grafiği (Yeni Eklenen) */}
      <div className="mt-10">
        <FunnelTrendChart start={start} end={end} />
      </div>

      {/* 📊 Diğer Metrikler */}
      <div className="mt-10">
        <AnalyticsMetrics start={start} end={end} />
      </div>
    </div>
  );
};

export default Analytics;
