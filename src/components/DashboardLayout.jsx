import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-4 h-screen z-10 relative">
      <h2 className="text-2xl font-bold text-indigo-600 mb-8">Addmetric</h2>
      <nav className="space-y-4">
        <a href="#" className="block text-gray-700 hover:text-indigo-600">📊 Dashboard</a>
        <a href="#" className="block text-gray-700 hover:text-indigo-600">📈 Reklam Hesapları</a>
        <div className="flex items-center gap-2">
          <a href="#" className="text-gray-700 hover:text-indigo-600 flex items-center gap-2">
            🤖 AI Reklam Analizi
          </a>
          <img
            src="/robotpng.gif"
            alt="AI"
            className="w-6 h-6 transition duration-300 hover:animate-bounce hover:scale-110"
          />
        </div>
        <a href="#" className="block text-gray-700 hover:text-indigo-600">📉 İstatistikler</a>
        <a href="#" className="block text-gray-700 hover:text-indigo-600">🔍 SEO Analizi</a>
        <a href="#" className="block text-gray-700 hover:text-indigo-600">⚙️ Ayarlar</a>
        <a href="#" className="block text-gray-700 hover:text-red-500">🚪 Çıkış Yap</a>
      </nav>
    </aside>
  );
};

const DashboardLayout = ({ children, showEarthBackground = false }) => {
  return (
    <div className="relative min-h-screen">
      {/* 🌍 Video arka plan */}
      {showEarthBackground && (
        <div className="earth-video-background">
          <video
            className="earth-video"
            src="/earth.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      )}

      {/* Sayfa içeriği */}
      <div className="relative z-10 flex">
        <Sidebar />
        <main className="flex-1 p-6 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
