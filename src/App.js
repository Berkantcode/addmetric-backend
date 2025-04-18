import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdAccounts from "./pages/AdAccounts";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard"; // ✅ EKLENDİ

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", background: "#f1f1f1" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Ad Accounts</Link>
        <Link to="/analytics" style={{ marginRight: "10px" }}>Analytics</Link>
        <Link to="/dashboard">Dashboard</Link> {/* ✅ MENÜYE DE EKLENDİ */}
      </nav>

      <Routes>
        <Route path="/" element={<AdAccounts />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ ROTAYA EKLENDİ */}
      </Routes>
    </Router>
  );
}

export default App;
