import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SitePrincipalContent from "./siteprincipal/App";
import LandingPage from "./diaNamorados/pages/LandingPage";
import ReservaPage from "./diaNamorados/pages/Reserva";
import AdminLogin from "./diaNamorados/pages/AdminLogin";
import AdminRegistro from "./diaNamorados/pages/AdminRegistro";
import AdminDashboard from "./diaNamorados/pages/AdminDashboard";
import SuccessPage from "./diaNamorados/pages/SuccessPage";
import "./diaNamorados/styles/home.css";
import "./shared/styles/Fonts.css";

const DiaNamoradosLayout = ({ children }) => <>{children}</>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Dia dos namorados como rota principal temporariamente */}
        <Route path="/" element={<DiaNamoradosLayout><LandingPage /></DiaNamoradosLayout>} />
        <Route path="/reserva" element={<DiaNamoradosLayout><ReservaPage /></DiaNamoradosLayout>} />
        <Route path="/namorados/login" element={<DiaNamoradosLayout><AdminLogin /></DiaNamoradosLayout>} />
        <Route path="/namorados/registro" element={<DiaNamoradosLayout><AdminRegistro /></DiaNamoradosLayout>} />
        <Route path="/namorados/admin" element={<DiaNamoradosLayout><AdminDashboard /></DiaNamoradosLayout>} />
        <Route path="/namorados/sucesso" element={<DiaNamoradosLayout><SuccessPage /></DiaNamoradosLayout>} />
        <Route path="/namorados/erro" element={<DiaNamoradosLayout><SuccessPage /></DiaNamoradosLayout>} />
        <Route path="/namorados/pendente" element={<DiaNamoradosLayout><SuccessPage /></DiaNamoradosLayout>} />
        {/* Restante do site principal */}
        <Route path="/*" element={<SitePrincipalContent />} />
      </Routes>
    </Router>
  );
}

export default App;
