import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Candidatos from "./pages/Candidatos";
import Empresas from "./pages/Empresas";
import Login from "./pages/Login";
import AllCandidatos from "./pages/AllCandidatos";
import { AuthProvider } from "./context/AuthContext"; // Importando o AuthProvider
import "./styles/Fonts.css";

import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <Router>
      <AuthProvider> {/* Mantendo o contexto de autenticação */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Tela de Candidatos com Layout Fixo */}
          <Route path="/candidatos" element={<Candidatos />}>
            <Route index element={<AllCandidatos />} />
            <Route path="all" element={<AllCandidatos />} />
          </Route>

          <Route path="/empresas" element={<Empresas />} />
        </Routes>
        <Analytics /> {/* Adicionando o componente Analytics */}
      </AuthProvider>
    </Router>
  );
}

export default App;
