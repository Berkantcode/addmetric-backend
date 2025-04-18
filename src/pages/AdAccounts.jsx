import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import CampaignDetailModal from "./CampaignDetailModal";

const getRiskColor = (level) => {
  switch (level) {
    case "low": return "bg-green-200 text-green-800";
    case "medium": return "bg-yellow-200 text-yellow-800";
    case "high": return "bg-red-200 text-red-800";
    default: return "bg-gray-200 text-gray-800";
  }
};

const AdAccounts = () => {
  const [googleCampaigns, setGoogleCampaigns] = useState([]);
  const [metaCampaigns, setMetaCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/analyze-campaigns");
        const data = await res.json();
        setGoogleCampaigns(data.filter(c => c.platform === "Google"));
        setMetaCampaigns(data.filter(c => c.platform === "Meta"));
      } catch (err) {
        console.error("API'den veri alınırken hata oluştu:", err);
      }
    };
    fetchCampaigns();
  }, []);

  const renderCampaignCard = (c, idx) => (
    <div
      key={idx}
      className="border p-4 rounded shadow bg-white cursor-pointer hover:shadow-lg transition"
      onClick={() => setSelectedCampaign(c)}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold">{c.campaignName}</h4>
        <span className={`text-sm px-2 py-1 rounded ${getRiskColor(c.riskLevel)}`}>{c.riskLevel}</span>
      </div>
      <p><strong>ROAS:</strong> {c.roas}</p>
      <p><strong>CTR:</strong> {c.ctr}%</p>
      <p className="text-blue-600 mt-2"><strong>AI Önerisi:</strong> {c.advice}</p>
      {c.headlineAdvice && (
        <p className="text-orange-600"><strong>Başlık Uyarısı:</strong> {c.headlineAdvice}</p>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-10">
        <h2 className="text-2xl font-bold">Kampanyalar</h2>

        {/* Google Kampanyaları */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Google Ads Kampanyaları</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {googleCampaigns.map(renderCampaignCard)}
          </div>
        </div>

        {/* Meta Kampanyaları */}
        <div>
          <h3 className="text-xl font-semibold mt-10 mb-4">Meta Ads Kampanyaları</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metaCampaigns.map(renderCampaignCard)}
          </div>
        </div>

        {/* Kampanya Detay Modali */}
        {selectedCampaign && (
          <CampaignDetailModal
            campaign={selectedCampaign}
            onClose={() => setSelectedCampaign(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdAccounts;
