import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ReservaPage from './pages/Reserva';
import './styles/home.css';

export default function DiaNamoradosApp() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/reserva" element={<ReservaPage />} />
      </Routes>
    </>
  );
}
