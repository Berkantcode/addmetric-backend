import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout showEarthBackground={true}>
      <div className="kampanya-wrapper">
        <h1 className="text-2xl font-bold mb-4">Hoş Geldin, Berkant</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">Kampanyalar: 12</div>
          <div className="bg-white p-4 rounded-xl shadow">Harcanan: $2,300</div>
          <div className="bg-white p-4 rounded-xl shadow">ROAS: 3.4x</div>
          <div className="bg-white p-4 rounded-xl shadow">SEO Skoru: 85</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
