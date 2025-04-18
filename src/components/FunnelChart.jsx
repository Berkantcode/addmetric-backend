import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FunnelChart = () => {
  const [veri, setVeri] = useState(null);
  const [hata, setHata] = useState(null);
  const [startDate, setStartDate] = useState(new Date()); // Bugün
  const [endDate, setEndDate] = useState(new Date());     // Bugün

  useEffect(() => {
    const formatDate = (date) => date.toISOString().split("T")[0];

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    fetch(`http://127.0.0.1:5000/api/analytics/funnel?start=${start}&end=${end}`)
      .then(res => {
        if (!res.ok) throw new Error("API erişim hatası");
        return res.json();
      })
      .then(data => setVeri(data))
      .catch(err => {
        console.error("Veri çekilemedi:", err);
        setHata("Sunucuya bağlanılamadı");
      });
  }, [startDate, endDate]);

  const adimlar = veri ? [
    { etiket: "Farkındalık", deger: veri.farkindalik },
    { etiket: "Düşünce", deger: veri.dusunce },
    { etiket: "Satın Alma", deger: veri.satin_alma },
  ] : [];

  const maxDeger = Math.max(...adimlar.map(a => a.deger), 1);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Funnel (Huni) Analizi</h2>
        <div className="flex items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
          />
          <span>-</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy-MM-dd"
          />
        </div>
      </div>

      {hata && <p className="text-red-600">{hata}</p>}
      {!veri && !hata && <p>Yükleniyor...</p>}

      <div className="space-y-4">
        {adimlar.map((adim, i) => (
          <div key={i} className="bg-blue-100 p-3 rounded shadow">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{adim.etiket}</span>
              <span className="font-bold">{adim.deger}</span>
            </div>
            <div
              className="h-4 rounded bg-blue-500"
              style={{ width: `${(adim.deger / maxDeger) * 100}%` }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunnelChart;
