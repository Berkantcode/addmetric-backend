import React from "react";
import ChartSection from "../components/ChartSection";

const CampaignDetailModal = ({ campaign, onClose }) => {
  if (!campaign) return null;

  const isGoogle = campaign.platform === "Google";
  const isMeta = campaign.platform === "Meta";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">
          {campaign.campaignName} Detayları
        </h2>

        {/* Ortak Alanlar */}
        <div className="mb-4">
          <p><strong>Platform:</strong> {campaign.platform}</p>
          <p><strong>ROAS:</strong> {campaign.roas}</p>
          <p><strong>CTR:</strong> {campaign.ctr}%</p>
        </div>

        {/* Google Ads Detayları */}
        {isGoogle && (
          <div className="space-y-1">
            <p><strong>Tıklama:</strong> {campaign.clicks}</p>
            <p><strong>Gösterim:</strong> {campaign.impressions}</p>
            <p><strong>TO:</strong> {campaign.ctr}%</p>
            <p><strong>Ort. TBM:</strong> ${campaign.avgCpc}</p>
            <p><strong>Maliyet:</strong> ${campaign.cost}</p>
            <p><strong>Dönüşüm Oranı:</strong> {campaign.convRate}%</p>
            <p><strong>Dönüşümler:</strong> {campaign.conversions}</p>
          </div>
        )}

        {/* Meta Ads Detayları */}
        {isMeta && (
          <div className="space-y-1">
            <p><strong>Yayın Durumu:</strong> {campaign.status}</p>
            <p><strong>Reklam Seti:</strong> {campaign.adsetName}</p>
            <p><strong>Bütçe:</strong> ${campaign.budget}</p>
            <p><strong>Sonuçlar:</strong> {campaign.results}</p>
            <p><strong>Erişim:</strong> {campaign.reach}</p>
            <p><strong>Gösterim:</strong> {campaign.impressions}</p>
            <p><strong>Sonuç Başına Ücret:</strong> ${campaign.costPerResult}</p>
            <p><strong>Harcanan Tutar:</strong> ${campaign.amountSpent}</p>
            <p><strong>Sonuç Oranı:</strong> {campaign.resultRate}%</p>
            <p><strong>Sıklık:</strong> {campaign.frequency}</p>
          </div>
        )}

        {/* AI Analiz Bölümü */}
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold">AI Reklam Analizi</h3>
            <img
              src="/robotpng.gif"
              alt="AI Einstein"
              className="w-10 h-10 transition duration-300 hover:animate-bounce hover:scale-110"
            />
          </div>
          <p><strong>Risk Seviyesi:</strong> {campaign.riskLevel}</p>
          <p className="text-blue-600">
            <strong>AI Önerisi:</strong> {campaign.advice}
          </p>
          {campaign.headlineAdvice && (
            <p className="text-orange-600">
              <strong>Başlık Uyarısı:</strong> {campaign.headlineAdvice}
            </p>
          )}
        </div>

        {/* Performans Grafiği */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Performans Grafiği</h3>
          <ChartSection />
        </div>

        {/* Kapat Butonu */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailModal;
