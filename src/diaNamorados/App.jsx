import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ReservaPage from './pages/Reserva';
import AdminDashboard from './pages/AdminDashboard';
import SuccessPage from './pages/SuccessPage';
import './styles/home.css';

export default function DiaNamoradosApp() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/reserva" element={<ReservaPage />} />
        <Route path="/namorados/sucesso" element={<SuccessPage />} />
        <Route path="/namorados/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}
