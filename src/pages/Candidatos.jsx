import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavbarCandidatos from "../components/NavbarCandidatos";
import AllCandidatos from "./AllCandidatos";

const Candidatos = () => {
  const navigate = useNavigate(); // Hook para redirecionar

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redireciona para login se não tiver token
    }
  }, [navigate]); // Executa ao montar o componente

  return (
    <div className="candidatos-container">
      <NavbarCandidatos />
      <div className="candidatos-content">
        <Outlet /> {/* Renderiza dinamicamente os conteúdos das empresas aqui */}
        <AllCandidatos /> {/* Componente que mostra todos os candidatos */}
      </div>
    </div>
  );
};

export default Candidatos;
